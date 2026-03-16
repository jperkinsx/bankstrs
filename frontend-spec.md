# BANKSTRS Frontend Build Spec

## Project Location
/home/user/workspace/bankstr/frontend/ — already set up from the webapp template with wagmi v2, viem v2, @rainbow-me/rainbowkit@2 installed.

## Architecture Context
Read /home/user/workspace/BANKSTR_ARCHITECTURE.md for the full system architecture.

## Design Direction
- **Corporate-cyberpunk**: Dark-first, monospace accents, neon green/teal accents on dark surfaces
- Inspired by bankr.bot (clean, monospace, terminal aesthetic) but with its own identity
- Think: Bloomberg terminal meets cyberpunk NFT project
- Dark mode primary, light mode secondary
- Font: JetBrains Mono for display/headings (monospace, technical), Inter or Satoshi for body

## Color Palette (HSL format for index.css)
- Background dark: ~220 20% 6% (very dark blue-black)
- Surface dark: ~220 18% 9%
- Foreground dark: ~0 0% 95%
- Primary accent: ~160 100% 45% (neon green, cyber feel)
- Primary hover: ~160 90% 35%
- Muted: ~220 10% 30%
- Border dark: ~220 10% 15%
- Destructive: ~0 80% 50%

Light mode:
- Background: ~0 0% 98%
- Foreground: ~220 20% 10%
- Primary: ~160 80% 30%

## Pages to Build

### 1. Home Page (`/`)
- Big hero: "BANKSTRS" in large monospace type with a tagline: "10,000 days. One Bankstr per day. Zero-reserve auction."
- Below hero: three stat cards (Day #, Total Minted, Current Bid)
- "Today's Auction" preview card with image, countdown, current bid, and CTA to go to auction page
- Brief "How It Works" section explaining the daily loop
- Link to Agent profile at bottom

### 2. Auction Page (`/auction`)
- Large display of current Bankstr image
- Auction details: token name, day number, traits list
- Live countdown timer (hours:minutes:seconds until auction ends)
- Current highest bid and bidder address (truncated)
- Bid input form with ETH amount — uses wagmi useWriteContract to call SuperRareBazaar.bid()
- Wallet connect button (RainbowKit) if not connected
- Transaction status feedback (pending, success, error)
- Seed & verification info section (shows the seed hash, treasury balance used, so anyone can verify)

### 3. Gallery Page (`/gallery`)
- Grid of past Bankstrs (cards with image, day #, traits summary)
- For now: generate mock data for days 1-12 as sample gallery items
- Each card shows the placeholder image, day number, and owner (or "Auction Active")
- Simple, clean grid layout

### 4. Agent Page (`/agent`)
- Section with $BNKSTRS token info placeholder (symbol, market cap TBD, contract TBD)
- Prominent link/embed to the Bankr agent profile: "View Agent on Bankr" button that opens https://bankr.bot/agents/{address}
- Brief explanation of the treasury flywheel: "Auction revenue flows to the BANKSTRS treasury on Base, managed by an autonomous Bankr AI Agent"
- For now: use placeholder address 0x0000...0000 since the agent isn't deployed yet

## Key Components

### WalletProvider (wrap the app)
- Configure wagmi with sepolia chain
- RainbowKit provider with dark theme
- WalletConnect project ID can be placeholder for now

### Navigation
- Top nav bar with: Logo (BANKSTRS in monospace), links to Home/Auction/Gallery/Agent
- Wallet connect button in the top right
- Monospace font, minimal, dark background

### Countdown Timer
- Shows HH:MM:SS until auction end
- Updates every second
- Shows "Auction Ended" when complete

### BidForm
- ETH amount input
- "Place Bid" button
- Uses wagmi useWriteContract with SuperRareBazaar ABI
- Shows current wallet balance
- Validates bid > current highest bid

## SuperRareBazaar Contract Integration
Create a file at client/src/lib/contracts.ts with:
- BAZAAR_ADDRESS (Sepolia): 0xC8Edc7049b233641ad3723D6C60019D1c8771612
- NFT_CONTRACT: placeholder 0x0000000000000000000000000000000000000000
- Partial ABI for: configureAuction, bid, settleAuction, getAuctionDetails
- Export wagmi-compatible config

## Backend Routes (server/routes.ts)
- GET /api/auction/current — returns mock current auction data (day, traits, seed, image URL, endTime, highestBid, highestBidder)
- GET /api/gallery — returns mock array of past bankstrs
- GET /api/stats — returns mock stats (currentDay, totalMinted, etc.)

## Data Schema (shared/schema.ts)
Define types (not DB tables, just TypeScript types) for:
- Bankstr: { day, seed, traits, imageUrl, owner, auctionEndTime, highestBid, highestBidder }
- AuctionState: { tokenId, startTime, endTime, highestBid, highestBidder, settled }
- Stats: { currentDay, totalMinted }

## IMPORTANT TECHNICAL NOTES
- Use `useHashLocation` from `wouter/use-hash-location` in the Router
- Use `apiRequest` from `@/lib/queryClient` for all API calls
- Dark mode: use `darkMode: ["class"]` in tailwind config, default to dark
- Do NOT use localStorage/sessionStorage
- Replace ALL `red` placeholder values in index.css with the cyberpunk palette
- Max heading size: --text-xl (this is a web app, not an informational site)
- Add data-testid attributes to all interactive elements
- Load JetBrains Mono from Google Fonts in client/index.html
- Load Satoshi from Fontshare for body text
