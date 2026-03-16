/**
 * BankstrCoin — the orange pixel-smiley coin from the cyberdeck design reference.
 * Pure SVG, no external assets. Accepts an optional `size` (px).
 */
export function BankstrCoin({ size = 220, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      className={`bankstr-coin ${className}`}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Outer bevel gradient */}
        <linearGradient id="bevelOuter" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff9955" />
          <stop offset="20%" stopColor="#ff4d00" />
          <stop offset="80%" stopColor="#cc3d00" />
          <stop offset="100%" stopColor="#661e00" />
        </linearGradient>

        {/* Inner face gradient */}
        <linearGradient id="faceBase" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff6600" />
          <stop offset="100%" stopColor="#e64500" />
        </linearGradient>

        {/* Emboss effect for outer ring */}
        <filter id="coinEmboss">
          <feDropShadow dx={-1} dy={-1} stdDeviation={2} floodColor="#ffb880" floodOpacity={0.8} />
          <feDropShadow dx={2} dy={4} stdDeviation={4} floodColor="#000000" floodOpacity={0.6} />
        </filter>

        {/* Recessed pixel look for face features */}
        <filter id="coinRecess">
          <feDropShadow dx={0} dy={1} stdDeviation={1} floodColor="#ffffff" floodOpacity={0.15} />
          <feDropShadow dx={0} dy={-1} stdDeviation={1} floodColor="#4a1500" floodOpacity={0.7} />
        </filter>
      </defs>

      {/* Outer beveled ring */}
      <circle cx={100} cy={100} r={95} fill="url(#bevelOuter)" filter="url(#coinEmboss)" />

      {/* Inner face */}
      <circle cx={100} cy={100} r={75} fill="url(#faceBase)" stroke="#aa3300" strokeWidth={2} />

      {/* Pixel face — eyes + mouth */}
      <g fill="#4a1500" filter="url(#coinRecess)">
        {/* Left eye (2 stacked pixels) */}
        <rect x={70} y={70} width={15} height={15} rx={2} />
        <rect x={70} y={85} width={15} height={15} rx={2} />

        {/* Right eye (2 stacked pixels) */}
        <rect x={115} y={70} width={15} height={15} rx={2} />
        <rect x={115} y={85} width={15} height={15} rx={2} />

        {/* Smile — 5 pixels in an arc */}
        <rect x={60} y={115} width={15} height={15} rx={2} />
        <rect x={75} y={130} width={15} height={15} rx={2} />
        <rect x={90} y={130} width={15} height={15} rx={2} />
        <rect x={105} y={130} width={15} height={15} rx={2} />
        <rect x={125} y={115} width={15} height={15} rx={2} />
      </g>

      {/* Subtle rim highlight */}
      <circle cx={100} cy={100} r={95} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
    </svg>
  );
}
