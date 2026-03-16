/**
 * Generate static JSON files for GitHub Pages deployment.
 * Run after `npm run build` to create /dist/public/api/ files
 * so the frontend can fetch mock data without an Express server.
 */
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const BACKGROUNDS = ["black", "dark_blue", "dark_green", "dark_red", "dark_purple", "charcoal", "navy", "midnight"];
const BASES = ["body_01", "body_02", "body_03", "body_04", "body_01", "body_02", "body_03", "body_04"];
const EYES = ["normal", "angry", "happy", "sleepy", "star", "laser", "diamond", "monocle"];
const HEADS = ["none", "tophat", "fedora", "crown", "horns", "halo", "antenna", "mohawk"];
const OUTFITS = ["suit", "hoodie", "armor", "labcoat", "tux", "leather", "robe", "cyberjacket"];
const ACCESSORIES = ["none", "cigar", "briefcase", "phone", "coffee", "katana", "laptop", "goldchain"];

function mockAddress(i) {
  return `0x${i.toString(16).padStart(4, "0")}${"a".repeat(36)}`;
}

const now = Math.floor(Date.now() / 1000);
const bankstrs = [];

for (let day = 1; day <= 12; day++) {
  const isActive = day === 12;
  bankstrs.push({
    day,
    seed: `0x${day.toString(16).padStart(2, "0")}${"ab".repeat(31)}`,
    traits: {
      background: BACKGROUNDS[day % BACKGROUNDS.length],
      base: BASES[day % BASES.length],
      eyes: EYES[day % EYES.length],
      head: HEADS[day % HEADS.length],
      outfit: OUTFITS[day % OUTFITS.length],
      accessory: ACCESSORIES[day % ACCESSORIES.length],
    },
    imageUrl: `/placeholder-bankstr-${day}.png`,
    owner: isActive ? null : mockAddress(day),
    auctionEndTime: isActive ? now + 43200 : now - (12 - day) * 86400,
    highestBid: isActive ? "0.042" : `0.0${day + 10}`,
    highestBidder: isActive ? mockAddress(99) : mockAddress(day + 20),
    settled: !isActive,
  });
}

const currentAuction = bankstrs[bankstrs.length - 1];
const gallery = bankstrs.filter((b) => b.settled);
const stats = { currentDay: 12, totalMinted: 12 };

const outDir = join(process.cwd(), "dist", "public", "api");

// Create nested directories for routes
mkdirSync(join(outDir, "auction"), { recursive: true });

writeFileSync(join(outDir, "auction", "current"), JSON.stringify(currentAuction));
writeFileSync(join(outDir, "gallery"), JSON.stringify(gallery));
writeFileSync(join(outDir, "stats"), JSON.stringify(stats));

console.log("Static API files generated in dist/public/api/");
