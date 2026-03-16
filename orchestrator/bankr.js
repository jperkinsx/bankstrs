/**
 * @fileoverview Bankr Agent API client with mock-mode fallback.
 * In mock mode (default for Sepolia testing), returns deterministic fake balances.
 * In live mode, communicates with https://api.bankr.bot using the submit-poll-complete pattern.
 */

const BANKR_BASE_URL = 'https://api.bankr.bot';

/**
 * Whether to use mock data instead of hitting the live Bankr API.
 * Set to false when running against mainnet with a real Bankr agent.
 * @type {boolean}
 */
export const MOCK_MODE = process.env.BANKR_MOCK_MODE !== 'false';

/**
 * Get a deterministic fake balance for a given day number (mock mode).
 * Produces a pseudo-random but reproducible wei value.
 *
 * @param {number} dayNumber - Day number
 * @returns {string} Fake balance in wei as a decimal string
 */
function getMockBalance(dayNumber) {
  // Deterministic "random-looking" balance: base 1 ETH ± variation per day
  const baseWei = BigInt('1000000000000000000'); // 1 ETH
  const variation = BigInt(dayNumber) * BigInt('31415926535897932');
  return (baseWei + variation).toString();
}

/**
 * Fetch the Bankr agent's wallet balances from the live API.
 *
 * @param {string} apiKey - Bankr API key
 * @returns {Promise<object>} Balances response from the API
 */
export async function getAgentBalances(apiKey) {
  const res = await fetch(`${BANKR_BASE_URL}/agent/balances`, {
    headers: { 'X-API-Key': apiKey },
  });
  if (!res.ok) {
    throw new Error(`Bankr balances request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/**
 * Submit a prompt to the Bankr agent and poll until completion.
 * Implements the submit-poll-complete pattern: POST prompt → poll job status every 2s.
 *
 * @param {string} apiKey - Bankr API key
 * @param {string} prompt - Prompt text to send to the agent
 * @returns {Promise<object>} Completed job response
 */
export async function submitPrompt(apiKey, prompt) {
  // 1. Submit the prompt
  const submitRes = await fetch(`${BANKR_BASE_URL}/agent/prompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify({ prompt }),
  });
  if (!submitRes.ok) {
    throw new Error(`Bankr prompt submit failed: ${submitRes.status} ${submitRes.statusText}`);
  }
  const { jobId } = await submitRes.json();

  // 2. Poll every 2s, max 60 attempts (2 minutes)
  for (let i = 0; i < 60; i++) {
    const jobRes = await fetch(`${BANKR_BASE_URL}/agent/job/${jobId}`, {
      headers: { 'X-API-Key': apiKey },
    });
    if (!jobRes.ok) {
      throw new Error(`Bankr job poll failed: ${jobRes.status} ${jobRes.statusText}`);
    }
    const job = await jobRes.json();

    if (job.status === 'completed') return job;
    if (job.status === 'failed') throw new Error(`Bankr job failed: ${job.error}`);

    await new Promise((r) => setTimeout(r, 2000));
  }

  throw new Error('Bankr job timed out after 120 seconds');
}

/**
 * Get the treasury ETH balance in wei.
 * In mock mode, returns a deterministic fake balance.
 * In live mode, calls the Bankr balances endpoint and extracts ETH balance.
 *
 * @param {string} apiKey - Bankr API key (ignored in mock mode)
 * @param {number} dayNumber - Current day number (used for mock determinism)
 * @returns {Promise<string>} Treasury balance in wei as a decimal string
 */
export async function getTreasuryBalance(apiKey, dayNumber) {
  if (MOCK_MODE) {
    const balance = getMockBalance(dayNumber);
    console.log(`[MOCK] Treasury balance for day ${dayNumber}: ${balance} wei`);
    return balance;
  }

  const balances = await getAgentBalances(apiKey);
  // Extract ETH balance — the exact shape depends on the API response,
  // but typically there is an ETH entry with a balance in wei.
  const ethEntry = balances?.balances?.find(
    (b) => b.symbol === 'ETH' || b.token === 'ETH',
  );
  if (!ethEntry) {
    throw new Error('No ETH balance found in Bankr agent balances');
  }
  return ethEntry.balanceWei || ethEntry.balance;
}
