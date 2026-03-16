/**
 * @fileoverview Trait selection engine.
 * Each trait category is selected independently by hashing the seed with the
 * category name, then taking the result modulo the number of options.
 */

import { ethers } from 'ethers';

/**
 * Select one trait per category deterministically from a seed.
 *
 * For each category the index is computed as:
 *   keccak256(seed + categoryName) % optionCount
 *
 * This ensures that different categories are selected independently even
 * though they share the same root seed.
 *
 * @param {string} seed - Hex-encoded seed (0x-prefixed)
 * @param {Record<string, string[]>} traitDefinitions - Map of category → option arrays
 * @returns {Record<string, string>} Map of category → selected option
 */
export function selectTraits(seed, traitDefinitions) {
  const selected = {};

  for (const [category, options] of Object.entries(traitDefinitions)) {
    const hash = ethers.solidityPackedKeccak256(
      ['bytes32', 'string'],
      [seed, category],
    );
    // Take the last 8 hex chars (32 bits) to get a manageable number, then mod
    const index = Number(BigInt(hash) % BigInt(options.length));
    selected[category] = options[index];
  }

  return selected;
}
