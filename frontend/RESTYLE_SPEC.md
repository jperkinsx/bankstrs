# Bankstrs Restyle Specification

## Reference
The design reference is at `/home/user/workspace/bankstr/frontend/design-reference.html` — a cyberdeck / retro CRT terminal aesthetic. Open it and study every CSS rule. Your job is to port this exact visual language into the existing React + Tailwind app.

## Design System to Implement

### Colors (CSS custom properties in index.css)
From the reference:
```
--chassis-base: #1c1c1e
--chassis-dark: #121214
--chassis-light: #2a2a2d
--screen-bg: #030a05
--screen-glare: rgba(57, 255, 20, 0.03)
--neon-green: #39ff14
--neon-green-dim: #1a7a0b
--neon-green-glow: rgba(57, 255, 20, 0.4)
--molded-orange: #ff4d00
--molded-orange-light: #ff7a00
--molded-orange-dark: #cc3d00
--text-muted: #6e6e73
--text-bright: #d2d2d7
```

Map these to shadcn variables:
- `--background` → chassis-dark (#121214) in HSL
- `--foreground` → text-bright (#d2d2d7) in HSL
- `--card` → chassis-base (#1c1c1e) in HSL
- `--card-foreground` → text-bright
- `--border` → ~#2a2a2d (chassis-light)
- `--primary` → neon-green (#39ff14) in HSL — ~130 100% 55%
- `--primary-foreground` → chassis-dark
- `--muted` → chassis-light (#2a2a2d)
- `--muted-foreground` → text-muted (#6e6e73)
- `--destructive` → molded-orange (#ff4d00) — used for emphasis/accents too
- `--ring` → neon-green
- `--input` → #2a2a2d

### Fonts
Replace current fonts in index.css with:
- `--font-sans: 'Space Grotesk', sans-serif`
- `--font-mono: 'JetBrains Mono', monospace`

Add Google Fonts link to `client/index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
```

### Shadows (critical for the hardware/molded feel)
Add these as CSS custom properties and use them throughout:
```css
--shadow-elevated: 8px 12px 24px rgba(0,0,0,0.6), -2px -2px 6px rgba(255,255,255,0.03), inset 1px 1px 1px rgba(255,255,255,0.05);
--shadow-recessed: inset 6px 8px 16px rgba(0,0,0,0.8), inset -1px -1px 2px rgba(255,255,255,0.04);
--shadow-button: 4px 6px 12px rgba(0,0,0,0.5), inset 1px 1px 2px rgba(255,255,255,0.1), inset -1px -1px 2px rgba(0,0,0,0.4);
--shadow-button-pressed: 1px 2px 4px rgba(0,0,0,0.8), inset 2px 4px 8px rgba(0,0,0,0.6), inset -1px -1px 1px rgba(255,255,255,0.05);
```

### CRT Scanline Effect
Add a global `body::before` pseudo-element for scanlines:
```css
body::before {
  content: "";
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%),
              linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06));
  background-size: 100% 4px, 6px 100%;
  z-index: 100;
  pointer-events: none;
  opacity: 0.3;
}
```

### Body Background
```css
body {
  background-color: #0a0a0c;
  background-image: radial-gradient(circle at 50% 50%, #1a1a1c 0%, #050505 100%);
}
```

## Component Styling

### Navbar
- Background: chassis-dark with slight transparency + backdrop-blur
- Logo text: text-muted color, uppercase, tracking-wide
- Add an orange dot before the "BANKSTRS" text (like .logo-dot in reference)
- Nav links: text-muted, on active/hover: neon-green with text-shadow glow
- Connect Wallet button: keep RainbowKit but ensure it fits the dark theme
- Bottom border: 2px solid chassis-dark with subtle light edge

### Cards → "Module Blocks"
Style all cards like the `.module-block` in the reference:
- Background: chassis-base (#1c1c1e)
- Border-radius: 20px
- Box-shadow: var(--shadow-elevated)
- Border: 1px solid rgba(255,255,255,0.02)
- Headers should have a `.module-header` style: flex between label and status light
- Labels: tiny uppercase, letter-spaced, text-muted (like .hardware-label)

### Recessed Displays (for data values)
For stat numbers, countdown, bid amounts — use recessed display style:
- Background: #0a0a0a
- Padding: 12px 16px
- Border-radius: 8px
- Box-shadow: var(--shadow-recessed)
- Border: 1px solid #1a1a1a
- Text color: neon-green or molded-orange for important numbers
- Text-shadow for glow effect

### Buttons → "Physical Buttons"
Style buttons like `.btn-physical`:
- Background: chassis-light (#2a2a2d)
- Border-radius: 12px
- Box-shadow: var(--shadow-button)
- Uppercase, letter-spaced, bold
- On :active → translateY(4px) + shadow-button-pressed
- Primary buttons (bid, connect): neon-green text + gradient background

### Status Lights
Add blinking green dot status indicators to module headers:
- 8px circle, neon-green background
- box-shadow: 0 0 8px neon-green
- animation: blink 2s steps(2, start) infinite

### Countdown
- Use molded-orange color for the timer digits
- Each digit in its own container with orange tint background + border
- Large font-weight: 800

### Auction Page Screen Area
The main NFT display area should look like the CRT display:
- Background: screen-bg (#030a05)
- Rounded corners, recessed shadow
- Grid overlay (subtle green grid lines at 40px intervals, 0.1 opacity)
- CLI-style overlays at corners showing trait data in neon-green mono text
- The NFT placeholder centered with a target reticle animation around it

### Gallery Cards
- Module block styling
- Image area: screen-bg with recessed shadow
- Trait badges: small, outlined, neon-green text
- Status badge: "Settled" in text-muted, "Active" with neon-green glow

### Agent Page
- Module blocks for each section
- Status lights on headers
- "View Agent on Bankr" button: btn-physical btn-primary style
- Treasury flywheel steps: numbered in molded-orange

### Home Page
- Hero: "BANKSTRS" in Space Grotesk bold, text-muted (NOT neon-green — subtler like the reference logo)
- Tagline: text-muted, mono font
- Stats: recessed display style with neon-green values
- "How It Works" cards: module-block style with orange step numbers
- Today's Auction preview: module-block with screen-bg art area inside

## Files to Modify

1. **`client/index.html`** — Add Google Fonts links
2. **`client/src/index.css`** — Complete overhaul of CSS variables (both :root and .dark), add scanlines, body bg, shadow vars, CRT grid utility classes
3. **`client/src/components/Navbar.tsx`** — Add orange dot, restyle
4. **`client/src/pages/home.tsx`** — Restyle all sections with module-block, recessed displays
5. **`client/src/pages/auction.tsx`** — CRT display area, CLI overlays, recessed data, physical buttons
6. **`client/src/pages/gallery.tsx`** — Module-block cards, screen-bg image areas
7. **`client/src/pages/agent.tsx`** — Module-block sections, physical buttons, orange numbers
8. **`client/src/components/Countdown.tsx`** — Orange digit styling
9. **`client/src/components/BidForm.tsx`** — Physical button styling for bid button

## IMPORTANT Rules
- Keep ALL existing functionality intact (wagmi, RainbowKit, routing, API fetches, data-testid attributes)
- Keep useHashLocation routing
- Keep PerplexityAttribution component on every page
- Do NOT change any logic — only styling/visual changes
- The .dark class is force-applied in App.tsx — all styling should be dark-mode
- Use Tailwind classes + custom CSS properties; leverage @apply or arbitrary values where needed
- Add custom utility classes in index.css for repeated patterns (e.g., .module-block, .recessed-display, .status-light, .btn-physical, .crt-screen)
- The scanline overlay should be SUBTLE (opacity 0.3) — not overwhelming
- Body should NOT have `overflow: hidden` since pages scroll
- Do NOT touch: App.tsx, wagmi.ts, contracts.ts, queryClient.ts, shared/schema.ts, server files
