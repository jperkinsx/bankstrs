/**
 * @fileoverview BANKSTR Daily Orchestrator — main entry point.
 *
 * Runs once per day to:
 *   1. Calculate the current day number
 *   2. Fetch (or mock) the treasury balance
 *   3. Generate a deterministic seed
 *   4. Select traits from the seed
 *   5. Render placeholder art as a PNG
 *   6. Mint the NFT via Rare Protocol CLI
 *   7. Create a 24-hour zero-reserve auction
 *   8. Settle the previous day's auction
 *
 * Set DRY_RUN=1 to skip Rare CLI calls and only generate art + log metadata.
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { LAUNCH_DATE, TRAIT_DEFINITIONS, COLLECTION_NAME, MAX_DAYS, AUCTION_DURATION } from './config.js';
import { generateSeed, getDayNumber } from './seed.js';
import { selectTraits } from './traits.js';
import { generateArt } from './art.js';
import { getTreasuryBalance } from './bankr.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'output');
const DRY_RUN = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true';
const BANKR_API_KEY = process.env.BANKR_API_KEY || '';
const BANKSTR_CONTRACT = process.env.BANKSTR_CONTRACT || '';
const DAY_OFFSET = parseInt(process.env.DAY_OFFSET || '0', 10);

/**
 * Execute a shell command, logging it first. Throws on non-zero exit.
 *
 * @param {string} cmd - Shell command to run
 */
function exec(cmd) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

/**
 * Main orchestrator flow.
 */
async function main() {
  console.log('='.repeat(60));
  console.log(`  ${COLLECTION_NAME} Daily Orchestrator`);
  console.log(`  ${DRY_RUN ? '*** DRY RUN — no on-chain actions ***' : 'LIVE MODE'}`);
  console.log('='.repeat(60));

  // --- 1. Day number ---
  const dayNumber = getDayNumber(LAUNCH_DATE) + DAY_OFFSET;
  if (dayNumber < 1 || dayNumber > MAX_DAYS) {
    console.error(`Day ${dayNumber} is outside valid range [1, ${MAX_DAYS}]. Exiting.`);
    process.exit(1);
  }
  console.log(`\n[1/7] Day number: ${dayNumber}`);

  // --- 2. Treasury balance ---
  const balanceWei = await getTreasuryBalance(BANKR_API_KEY, dayNumber);
  console.log(`[2/7] Treasury balance: ${balanceWei} wei`);

  // --- 3. Seed ---
  const seed = generateSeed(balanceWei, dayNumber);
  console.log(`[3/7] Seed: ${seed}`);

  // --- 4. Traits ---
  const traits = selectTraits(seed, TRAIT_DEFINITIONS);
  console.log(`[4/7] Traits:`);
  for (const [category, value] of Object.entries(traits)) {
    console.log(`       ${category}: ${value}`);
  }

  // --- 5. Art ---
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  const artPath = path.join(OUTPUT_DIR, `bankstrs_${dayNumber}.png`);
  const artBuffer = await generateArt(traits, dayNumber);
  await writeFile(artPath, artBuffer);
  console.log(`[5/7] Art saved to ${artPath}`);

  // --- 6. Metadata summary ---
  const metadata = {
    day: dayNumber,
    seed,
    treasuryBalanceWei: balanceWei,
    traits,
    imagePath: artPath,
    timestamp: new Date().toISOString(),
  };
  console.log(`[6/7] Metadata:\n${JSON.stringify(metadata, null, 2)}`);

  if (DRY_RUN) {
    console.log('\n[DRY RUN] Skipping mint, auction, and settle steps.');
    console.log('Done.');
    return;
  }

  // --- 7. Mint + Auction ---
  if (!BANKSTR_CONTRACT) {
    console.error('BANKSTR_CONTRACT env var is required for live mode. Exiting.');
    process.exit(1);
  }

  // Build trait attributes for the rare mint command
  const attrFlags = [
    `--attribute "Day=${dayNumber}"`,
    `--attribute "Background=${traits.background}"`,
    `--attribute "Base=${traits.base}"`,
    `--attribute "Eyes=${traits.eyes}"`,
    `--attribute "Head=${traits.head}"`,
    `--attribute "Outfit=${traits.outfit}"`,
    `--attribute "Accessory=${traits.accessory}"`,
    `--attribute "Seed=${seed}"`,
    `--attribute "TreasuryBalance=${balanceWei}"`,
  ].join(' ');

  const description = `Day ${dayNumber} of ${MAX_DAYS}. Seed: ${seed}`;

  console.log('\n[7a] Minting NFT...');
  exec(
    `rare mint ` +
    `--contract ${BANKSTR_CONTRACT} ` +
    `--name "${COLLECTION_NAME} #${dayNumber}" ` +
    `--description "${description}" ` +
    `--image ${artPath} ` +
    `${attrFlags}`,
  );

  console.log('\n[7b] Creating 24h auction...');
  exec(
    `rare auction create ` +
    `--contract ${BANKSTR_CONTRACT} ` +
    `--token-id ${dayNumber} ` +
    `--starting-price 0 ` +
    `--duration ${AUCTION_DURATION}`,
  );

  // --- 8. Settle previous auction ---
  if (dayNumber > 1) {
    const prevTokenId = dayNumber - 1;
    console.log(`\n[7c] Settling previous auction (token ${prevTokenId})...`);
    try {
      exec(
        `rare auction settle ` +
        `--contract ${BANKSTR_CONTRACT} ` +
        `--token-id ${prevTokenId}`,
      );
    } catch (err) {
      // Settlement can fail if there were no bids or it was already settled
      console.warn(`Warning: settle for token ${prevTokenId} failed: ${err.message}`);
    }
  }

  console.log('\nDone. Bankstrs #' + dayNumber + ' minted and auctioned.');
}

main().catch((err) => {
  console.error('Orchestrator failed:', err);
  process.exit(1);
});
