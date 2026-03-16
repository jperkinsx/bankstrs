/**
 * @fileoverview BANKSTR configuration — trait definitions, project constants, and launch parameters.
 * All trait categories have exactly 8 options for uniform distribution via modular arithmetic.
 */

/** Project name */
export const PROJECT_NAME = 'BANKSTR';

/** NFT collection name */
export const COLLECTION_NAME = 'Bankstrs';

/** Total number of days the project runs */
export const MAX_DAYS = 10000;

/** Auction duration in seconds (24 hours) */
export const AUCTION_DURATION = 86400;

/** Launch date — Day 1 of the project */
export const LAUNCH_DATE = new Date('2026-03-16T00:00:00Z');

/**
 * Trait definitions. Each category has exactly 8 options so that
 * `keccak256(seed + category) % 8` gives a uniform selection.
 */
export const TRAIT_DEFINITIONS = {
  background: [
    'black',
    'dark_blue',
    'dark_green',
    'dark_red',
    'dark_purple',
    'charcoal',
    'navy',
    'midnight',
  ],
  base: [
    'body_01',
    'body_02',
    'body_03',
    'body_04',
    'body_05',
    'body_06',
    'body_07',
    'body_08',
  ],
  eyes: [
    'normal',
    'angry',
    'happy',
    'sleepy',
    'star',
    'laser',
    'diamond',
    'monocle',
  ],
  head: [
    'none',
    'tophat',
    'fedora',
    'crown',
    'horns',
    'halo',
    'antenna',
    'mohawk',
  ],
  outfit: [
    'suit',
    'hoodie',
    'armor',
    'labcoat',
    'tux',
    'leather',
    'robe',
    'cyberjacket',
  ],
  accessory: [
    'none',
    'cigar',
    'briefcase',
    'phone',
    'coffee',
    'katana',
    'laptop',
    'goldchain',
  ],
};
