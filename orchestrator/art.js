/**
 * @fileoverview Placeholder ASCII-art generator.
 * Renders a simple "Bankstrs" face as a 1000x1000 PNG using sharp.
 * The face varies per trait combination — background color from traits,
 * eyes/head/outfit/accessory alter specific character rows.
 */

import sharp from 'sharp';

/**
 * Map background trait names to hex color values.
 * @type {Record<string, string>}
 */
const BG_COLORS = {
  black: '#0a0a0a',
  dark_blue: '#0d1b2a',
  dark_green: '#0b2916',
  dark_red: '#2a0d0d',
  dark_purple: '#1a0d2a',
  charcoal: '#1e1e1e',
  navy: '#0a1628',
  midnight: '#101020',
};

/**
 * Map eye trait names to ASCII eye characters.
 * @type {Record<string, string>}
 */
const EYE_CHARS = {
  normal: 'O  O',
  angry: '>  <',
  happy: '^  ^',
  sleepy: '-  -',
  star: '*  *',
  laser: '#  #',
  diamond: '<> <>',
  monocle: 'O  @',
};

/**
 * Map head trait names to ASCII headgear rows.
 * @type {Record<string, string>}
 */
const HEAD_CHARS = {
  none: '         ',
  tophat: '  _===_  ',
  fedora: '  /===\\  ',
  crown: ' ^^V^V^^ ',
  horns: ' }     { ',
  halo: '  -oOo-  ',
  antenna: '    |    ',
  mohawk: '  |||||  ',
};

/**
 * Map outfit trait names to ASCII body decoration.
 * @type {Record<string, string>}
 */
const OUTFIT_CHARS = {
  suit: '|[=====]|',
  hoodie: '|(ooooo)|',
  armor: '|{#####}|',
  labcoat: '|[     ]|',
  tux: '|[=.=.=]|',
  leather: '|(xxxxx)|',
  robe: '|{~~~~~}|',
  cyberjacket: '|[>===<]|',
};

/**
 * Map accessory trait names to an extra line below the body.
 * @type {Record<string, string>}
 */
const ACCESSORY_CHARS = {
  none: '         ',
  cigar: '   __/   ',
  briefcase: '  [===]  ',
  phone: '  [|||]  ',
  coffee: '  {___}  ',
  katana: '  /|||\\  ',
  laptop: ' [=====] ',
  goldchain: '  *~*~*  ',
};

/**
 * Generate a placeholder Bankstrs PNG from the given traits.
 *
 * @param {Record<string, string>} traits - Selected traits (background, base, eyes, head, outfit, accessory)
 * @param {number} dayNumber - Current day number (rendered in the image)
 * @returns {Promise<Buffer>} PNG image buffer (1000x1000)
 */
export async function generateArt(traits, dayNumber) {
  const bgHex = BG_COLORS[traits.background] || '#0a0a0a';

  const head = HEAD_CHARS[traits.head] || HEAD_CHARS.none;
  const eyes = EYE_CHARS[traits.eyes] || EYE_CHARS.normal;
  const outfit = OUTFIT_CHARS[traits.outfit] || OUTFIT_CHARS.suit;
  const accessory = ACCESSORY_CHARS[traits.accessory] || ACCESSORY_CHARS.none;

  // Build the ASCII face as an array of lines
  const face = [
    '',
    `  ${head}`,
    ' +---------+',
    ` | ${eyes}  |`,
    ' |    >    |',
    ' |  \\___/  |',
    ' +---------+',
    `  ${outfit}`,
    `  ${accessory}`,
    '',
    ` BANKSTRS #${dayNumber}`,
    ` ${traits.base}`,
  ];

  // Render each line as white text on the background color using SVG
  const lineHeight = 60;
  const topPadding = 200;
  const textLines = face
    .map((line, i) => {
      const y = topPadding + i * lineHeight;
      // Escape XML special characters
      const escaped = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
      return `<text x="500" y="${y}" text-anchor="middle" font-family="monospace" font-size="48" fill="#e0e0e0">${escaped}</text>`;
    })
    .join('\n');

  const svg = `<svg width="1000" height="1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="1000" height="1000" fill="${bgHex}" />
  ${textLines}
</svg>`;

  const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return buffer;
}
