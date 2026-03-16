# BANKSTR — System Architecture

## Overview
BANKSTR is a 10,000-day generative PFP project. Every 24 hours, the system:
1. Fetches the BANKSTR treasury balance from the Bankr Agent API
2. Hashes the balance snapshot + day number into a deterministic seed
3. Generates a unique "Bankstrs" PFP from the seed (placeholder ASCII art for now)
4. Uploads the image + metadata to IPFS
5. Mints the NFT via Rare Protocol CLI
6. Creates a 24-hour zero-reserve auction via Rare Protocol CLI
7. Settles the previous day's auction

Auction revenue flows to the BANKSTR Bankr Agent treasury on Base.

---

## Chain & Environment Strategy

### Phase 1 (Development/Testing)
- **NFT Collection + Auctions**: Ethereum Sepolia (Rare CLI full support)
- **Bankr Agent API**: Mocked (Bankr has no testnet support — mainnets only: Base, Ethereum, Polygon, Unichain, Solana)
- **Frontend**: Sepolia via wagmi/viem

### Phase 2 (Production)
- **NFT Collection + Auctions**: Ethereum Mainnet (or Base when Rare CLI adds full support)
- **Bankr Agent**: Base mainnet (primary chain, gas sponsored)
- **Treasury Bridge**: Auction ETH on Ethereum → bridge to Bankr agent wallet on Base
- **$BNKSTR Token**: Launched via `bankr launch` on Base (done independently by team)

---

## Contract Addresses

### Rare Protocol (Sepolia)
| Contract | Address |
|----------|---------|
| Factory (SovereignBatchMintFactory) | `0x3c7526a0975156299ceef369b8ff3c01cc670523` |
| Auction (SuperRareBazaar) | `0xC8Edc7049b233641ad3723D6C60019D1c8771612` |

### Rare Protocol (Mainnet)
| Contract | Address |
|----------|---------|
| Factory | `0xAe8E375a268Ed6442bEaC66C6254d6De5AeD4aB1` |
| Auction (SuperRareBazaar) | `0x6D7c44773C52D396F43c2D511B81aa168E9a7a42` |

### SuperRareBazaar ABI (Key Functions)
```solidity
// Configure a new auction
function configureAuction(
    bytes32 _auctionType,       // "COLDIE_AUCTION" for reserve auctions
    address _originContract,     // NFT contract address
    uint256 _tokenId,
    uint256 _startingAmount,     // 0 for zero-reserve
    address _currencyAddress,    // address(0) for ETH
    uint256 _lengthOfAuction,   // 86400 for 24 hours
    uint256 _startTime,          // block.timestamp for immediate
    address payable[] _splitAddresses,
    uint8[] _splitRatios
) external

// Place a bid
function bid(
    address _originContract,
    uint256 _tokenId,
    address _currencyAddress,    // address(0) for ETH
    uint256 _amount
) external payable

// Settle ended auction
function settleAuction(
    address _originContract,
    uint256 _tokenId
) external

// Get auction details
function getAuctionDetails(
    address _originContract,
    uint256 _tokenId
) external view returns (...)
```

---

## Bankr Agent API

### Base URL
`https://api.bankr.bot`

### Authentication
```
X-API-Key: <BANKR_API_KEY>
```

### Key Endpoints

#### Get Balances
```
GET /agent/balances
Headers: X-API-Key: <key>
```

#### Submit Prompt (async)
```
POST /agent/prompt
Body: { "prompt": "..." }
Response: { "success": true, "jobId": "abc123", "status": "pending" }
```

#### Poll Job Status
```
GET /agent/job/{jobId}
Response: { "status": "completed", "response": "...", "richData": [...] }
```

### Submit-Poll-Complete Pattern
```typescript
// 1. Submit prompt
const { jobId } = await fetch('https://api.bankr.bot/agent/prompt', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-API-Key': key },
  body: JSON.stringify({ prompt })
}).then(r => r.json());

// 2. Poll every 2s, max 60 attempts
for (let i = 0; i < 60; i++) {
  const job = await fetch(`https://api.bankr.bot/agent/job/${jobId}`, {
    headers: { 'X-API-Key': key }
  }).then(r => r.json());
  
  if (job.status === 'completed') return job;
  if (job.status === 'failed') throw new Error(job.error);
  await new Promise(r => setTimeout(r, 2000));
}
```

---

## Daily Orchestrator (Node.js)

### Seed Generation (Deterministic)
```
seed = keccak256(abi.encodePacked(
  treasuryBalanceWei,    // uint256 - Bankr agent ETH balance in wei
  dayNumber              // uint256 - days since epoch (day 1 = launch day)
))
```

The seed is published in the NFT metadata so anyone can verify the generation was deterministic.

### Trait Engine
Traits are selected deterministically from the seed using modular arithmetic:

| Trait | Options (placeholder) |
|-------|----------------------|
| Background | Solid colors: black, dark_blue, dark_green, dark_red, dark_purple, charcoal, navy, midnight |
| Base | body_01, body_02, body_03, body_04 |
| Eyes | normal, angry, happy, sleepy, star, laser, diamond, monocle |
| Head | none, tophat, fedora, crown, horns, halo, antenna, mohawk |
| Outfit | suit, hoodie, armor, labcoat, tux, leather, robe, cyberjacket |
| Accessory | none, cigar, briefcase, phone, coffee, katana, laptop, goldchain |

```
traitIndex = uint256(keccak256(seed + traitCategory)) % optionCount
```

### Placeholder Art
Simple colored ASCII-art rendered to PNG via `sharp`. The ASCII art is a grid-based "Bankstrs" face composed from the selected traits.

### IPFS Upload
- Rare CLI handles IPFS upload automatically with `rare mint --image ./art.png`
- Metadata follows ERC-721 standard with additional `bankstr_seed` and `bankstr_day` properties

### Mint + Auction Flow
```bash
# 1. Mint the NFT
rare mint \
  --contract $BANKSTR_CONTRACT \
  --name "Bankstrs #$DAY_NUMBER" \
  --description "Day $DAY_NUMBER of 10,000. Seed: $SEED" \
  --image ./output/bankstrs_$DAY_NUMBER.png \
  --attribute "Day=$DAY_NUMBER" \
  --attribute "Background=$BG" \
  --attribute "Eyes=$EYES" \
  --attribute "Head=$HEAD" \
  --attribute "Outfit=$OUTFIT" \
  --attribute "Accessory=$ACCESSORY" \
  --attribute "Seed=$SEED" \
  --attribute "TreasuryBalance=$BALANCE"

# 2. Create 24h zero-reserve auction
rare auction create \
  --contract $BANKSTR_CONTRACT \
  --token-id $TOKEN_ID \
  --starting-price 0 \
  --duration 86400

# 3. Settle yesterday's auction (if exists)
rare auction settle \
  --contract $BANKSTR_CONTRACT \
  --token-id $PREV_TOKEN_ID
```

---

## Frontend (Next.js + React)

### Pages
1. **Landing/Home** (`/`): Hero with project info, current auction preview, key stats
2. **Auction** (`/auction`): Live auction with countdown, current bid, bidding interface via wagmi/viem
3. **Gallery** (`/gallery`): Browse past Bankstrs with filtering
4. **Agent** (`/agent`): Link to Bankr agent profile, $BNKSTR token info

### Wallet Integration
- wagmi v2 + viem for wallet connection
- RainbowKit or custom connect button
- Direct interaction with SuperRareBazaar contract for bidding
- Sepolia chain configuration

### Bidding Flow (wagmi/viem)
```typescript
// Read auction details
const { data: auctionDetails } = useReadContract({
  address: BAZAAR_ADDRESS,
  abi: BAZAAR_ABI,
  functionName: 'getAuctionDetails',
  args: [NFT_CONTRACT, tokenId],
});

// Place bid
const { writeContract } = useWriteContract();
writeContract({
  address: BAZAAR_ADDRESS,
  abi: BAZAAR_ABI,
  functionName: 'bid',
  args: [NFT_CONTRACT, tokenId, ADDRESS_ZERO, bidAmount],
  value: bidAmount, // ETH sent with transaction
});
```

---

## Automation (GitHub Action)

```yaml
name: Daily Bankstrs
on:
  schedule:
    - cron: '0 12 * * *'  # Noon UTC daily
  workflow_dispatch: {}     # Manual trigger

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm install -g @rareprotocol/rare-cli
      - run: |
          rare configure \
            --chain sepolia \
            --private-key ${{ secrets.DEPLOYER_PRIVATE_KEY }} \
            --rpc-url ${{ secrets.RPC_URL }}
      - run: node orchestrator/run.js
        env:
          BANKR_API_KEY: ${{ secrets.BANKR_API_KEY }}
          BANKSTR_CONTRACT: ${{ secrets.BANKSTR_CONTRACT }}
          DAY_OFFSET: '0'
```

---

## Environment Variables

| Variable | Description | Used By |
|----------|-------------|---------|
| `BANKR_API_KEY` | Bankr Agent API key | Orchestrator |
| `BANKSTR_CONTRACT` | Deployed NFT contract address | Orchestrator |
| `DEPLOYER_PRIVATE_KEY` | Wallet private key for minting | Rare CLI |
| `RPC_URL` | Ethereum/Sepolia RPC endpoint | Rare CLI |
| `NEXT_PUBLIC_CHAIN_ID` | Chain ID (11155111 for Sepolia) | Frontend |
| `NEXT_PUBLIC_BAZAAR_ADDRESS` | SuperRareBazaar contract | Frontend |
| `NEXT_PUBLIC_NFT_CONTRACT` | BANKSTR NFT contract | Frontend |
| `NEXT_PUBLIC_BANKR_AGENT_URL` | Bankr agent profile URL | Frontend |

---

## $BNKSTR Token Info Display

The frontend will display token info by linking to the Bankr agent profile page:
- URL pattern: `https://bankr.bot/agents/{agent_wallet_address}`
- Displays: token symbol, market cap, contract address, price chart (via GeckoTerminal)
- "Buy on Bankr Swap" CTA

---

## File Structure

```
bankstr/
├── orchestrator/
│   ├── run.js              # Main daily orchestrator
│   ├── seed.js             # Deterministic seed generation
│   ├── traits.js           # Trait selection engine
│   ├── art.js              # Placeholder ASCII art generator
│   ├── bankr.js            # Bankr API client (with mock mode)
│   └── config.js           # Trait definitions and constants
├── frontend/               # Next.js app (webapp template)
│   ├── client/
│   │   └── src/
│   │       ├── pages/
│   │       │   ├── home.tsx
│   │       │   ├── auction.tsx
│   │       │   ├── gallery.tsx
│   │       │   └── agent.tsx
│   │       ├── components/
│   │       │   ├── AuctionCard.tsx
│   │       │   ├── BankstrsImage.tsx
│   │       │   ├── BidForm.tsx
│   │       │   ├── Countdown.tsx
│   │       │   ├── GalleryGrid.tsx
│   │       │   ├── WalletConnect.tsx
│   │       │   └── TokenInfo.tsx
│   │       ├── lib/
│   │       │   ├── contracts.ts  # ABI + addresses
│   │       │   ├── wagmi.ts      # Wagmi config
│   │       │   └── utils.ts
│   │       └── hooks/
│   │           ├── useAuction.ts
│   │           └── useBankstrs.ts
│   ├── server/
│   │   └── routes.ts        # API for gallery data, current auction
│   └── shared/
│       └── schema.ts         # Data models
├── .github/
│   └── workflows/
│       └── daily-bankstrs.yml
├── package.json
└── README.md
```
