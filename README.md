<div align="center">

<img src="assets/crate-logo.svg" width="100" height="100" alt="Crate Logo" />

# Crate · Mobile

### React Native app — check earnings, discover beats, and get paid from your phone.

[![License](https://img.shields.io/badge/License-MIT-facc15?style=flat-square&labelColor=000)](LICENSE)
[![Expo](https://img.shields.io/badge/Expo-53-facc15?style=flat-square&labelColor=000&logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.79-facc15?style=flat-square&labelColor=000&logo=react&logoColor=white)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-facc15?style=flat-square&labelColor=000&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Stellar](https://img.shields.io/badge/Stellar-Testnet-facc15?style=flat-square&labelColor=000&logo=stellar&logoColor=white)](https://stellar.org)

[Overview](#overview) · [Features](#features) · [Screens](#screens) · [Quick Start](#quick-start) · [Contributing](#contributing)

</div>

---

## Currently Building

| Feature | Status | Branch |
|---|---|---|
| Discover feed with genre filters | ✅ Done | `main` |
| Earnings screen with one-tap withdraw | ✅ Done | `main` |
| Beat upload from phone audio library | 🔄 In Progress | `feat/mobile-upload` |
| Push notification on beat sale | 🔄 In Progress | `feat/push-notifications` |
| App Store / Play Store release | 📋 Planned | — |

---

## Overview

Producers in emerging markets are mobile-first. They shouldn't need a laptop to check if a beat sold, withdraw earnings, or upload a new track.

Crate Mobile brings the full marketplace to iOS and Android. Built with **Expo 53** and **Expo Router** for file-based navigation, **NativeWind** for Tailwind-style CSS, and `@stellar/stellar-sdk` for direct contract interaction — no wallet browser extension required.

> _"Most producers making beats in Lagos, Accra, or Nairobi are doing it on a phone. Crate is built for them."_

---

## Features

- **Discover feed** — Browse beats by genre (Trap, R&B, Drill, Afrobeats, Lo-Fi) and BPM
- **Live earnings** — Real-time XLM balance pulled directly from the Soroban contract
- **One-tap withdraw** — Pull accumulated earnings to your Stellar wallet in seconds
- **Upload from phone** — Select audio from your library, set pricing, list on-chain
- **Push notifications** — Get notified the moment a beat sells
- **Secure wallet storage** — Keypair managed with `expo-secure-store`, never leaves the device
- **Dark theme** — Same `#0a0a0a` / `#facc15` design system as the web app

---

## Screens

| Tab | Description |
|---|---|
| **Discover** | Beat grid with search + genre/BPM filter chips |
| **Upload** | Audio picker + pricing form + on-chain submit |
| **Earnings** | Live balance, withdrawal history, one-tap withdraw |
| **Profile** | Wallet management, your listings, settings |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Expo 53, React Native 0.79 |
| **Navigation** | Expo Router 5 (file-based tabs) |
| **Styling** | NativeWind (Tailwind for React Native) |
| **Stellar** | `@stellar/stellar-sdk` |
| **Wallet** | `expo-secure-store` — keypair encrypted on-device |
| **Notifications** | `expo-notifications` |
| **Audio** | `expo-av` for 30-second beat previews |
| **File picker** | `expo-document-picker` for audio upload |

---

## Quick Start

### Prerequisites

- Node.js 20+
- [Expo Go](https://expo.dev/go) app on your phone **or** iOS/Android simulator

```bash
# Clone
git clone https://github.com/Crate-Protocol/crate-mobile.git
cd crate-mobile

# Install
npm install

# Configure
cp .env.example .env

# Start
npx expo start
```

Scan the QR code with Expo Go or press `i` (iOS) / `a` (Android).

### Environment Variables

```env
EXPO_PUBLIC_CONTRACT_ID=CA7DGEWWS3VH5J2I4I7FFEB5UHK2MJSYWDKDQKXQM7GDNLI2IRATDTLG
EXPO_PUBLIC_NETWORK=TESTNET
EXPO_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
EXPO_PUBLIC_API_URL=http://localhost:3001
```

---

## Project Structure

```
app/
├── _layout.tsx          # Root layout — dark theme, fonts
└── (tabs)/
    ├── _layout.tsx      # Bottom tab bar (4 tabs)
    ├── index.tsx        # Discover — beat feed + filters
    ├── upload.tsx       # Upload — audio + pricing form
    ├── earnings.tsx     # Earnings — balance + history
    └── profile.tsx      # Profile — wallet + settings

src/
├── components/
│   ├── SampleCard.tsx   # Beat card with waveform bars
│   └── WaveformBars.tsx # Decorative audio visualization
├── hooks/
│   └── useWallet.ts     # Keypair generation + secure storage
└── constants/
    └── theme.ts         # Design tokens
```

---

## Design Tokens

```ts
// src/constants/theme.ts
export const theme = {
  colors: {
    bg:      "#0a0a0a",   // App background
    surface: "#111111",   // Cards, inputs
    border:  "#1a1a1a",   // Dividers
    accent:  "#facc15",   // Primary action (yellow)
    text:    "#ffffff",   // Primary text
    muted:   "#737373",   // Secondary text
  },
}
```

---

## Building for Production

```bash
# Requires Expo EAS account
npx eas build --platform ios
npx eas build --platform android
npx eas build --platform all
```

---

## Contributing

```bash
# Fork → clone → branch
git checkout -b feat/your-feature

# Make changes, then open a PR
```

---

## Ecosystem

| Repo | Description |
|---|---|
| [crate-frontend](https://github.com/Crate-Protocol/crate-frontend) | React 18 + TypeScript web app |
| [crate-backend](https://github.com/Crate-Protocol/crate-backend) | Node.js API, IPFS proxy, analytics |
| [crate-contracts](https://github.com/Crate-Protocol/crate-contracts) | Soroban smart contracts (Rust) |

---

## License

MIT — see [LICENSE](LICENSE)

---

<div align="center">
  <img src="assets/crate-logo.svg" width="40" alt="Crate" />
  <br/>
  <sub>Built on Stellar · React Native · Open Source</sub>
  <br/><br/>

  [![Stars](https://img.shields.io/github/stars/Crate-Protocol/crate-mobile?style=flat-square&labelColor=000&color=facc15)](https://github.com/Crate-Protocol/crate-mobile/stargazers)
  [![Forks](https://img.shields.io/github/forks/Crate-Protocol/crate-mobile?style=flat-square&labelColor=000&color=facc15)](https://github.com/Crate-Protocol/crate-mobile/network/members)
  [![Issues](https://img.shields.io/github/issues/Crate-Protocol/crate-mobile?style=flat-square&labelColor=000&color=facc15)](https://github.com/Crate-Protocol/crate-mobile/issues)
</div>
