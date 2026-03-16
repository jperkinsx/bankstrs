/**
 * @fileoverview Deterministic seed generation using keccak256.
 * The seed is derived from the treasury balance (in wei) and the day number,
 * ensuring each day's NFT is uniquely and verifiably determined by on-chain state.
 */

import { ethers } from 'ethers';
import { LAUNCH_DATE } from './config.js';

/**
 * Generate a deterministic seed by hashing the treasury balance and day number.
 *
 * @param {string} treasuryBalanceWei - Treasury ETH balance in wei (as a decimal string)
 * @param {number} dayNumber - Day number since launch (1-indexed)
 * @returns {string} Hex-encoded keccak256 hash (0x-prefixed, 66 chars)
 */
export function generateSeed(treasuryBalanceWei, dayNumber) {
  return ethers.solidityPackedKeccak256(
    ['uint256', 'uint256'],
    [treasuryBalanceWei, dayNumber],
  );
}

/**
 * Calculate the current day number relative to the launch date.
 * Day 1 is the launch day itself.
 *
 * @param {Date} [launchDate=LAUNCH_DATE] - The project launch date
 * @returns {number} 1-indexed day number
 */
export function getDayNumber(launchDate = LAUNCH_DATE) {
  const now = new Date();
  const msPerDay = 86400 * 1000;
  const diffMs = now.getTime() - launchDate.getTime();
  return Math.floor(diffMs / msPerDay) + 1;
}
