# crate-mobile

React Native + Expo mobile app for the Crate P2P beat marketplace.

## Currently Building

| Feature | Status |
|---|---|
| Discover feed | Done |
| Earnings screen | Done |
| Upload from phone | In Progress |
| Push notifications on sale | In Progress |
| App Store / Play Store release | Planned |

## Stack

- **Expo SDK 53** + Expo Router 5
- **React Native 0.79**
- **@stellar/stellar-sdk** — contract interactions + keypair management
- **expo-secure-store** — encrypted keypair storage
- **expo-document-picker** — audio file selection
- **nativewind** — Tailwind for React Native
- **@expo/vector-icons** — Ionicons tab icons

## Screens (Tabs)

| Tab | Description |
|---|---|
| Discover | Browse and buy samples |
| Upload | Upload beats to IPFS + contract |
| Earnings | Producer earnings, withdrawal |
| Profile | Wallet connect/generate/import |

## Setup

```bash
npm install
cp .env.example .env
npx expo start
```

### iOS
```bash
npx expo start --ios
```

### Android
```bash
npx expo start --android
```

## Wallet

On mobile, Freighter extension isn't available. The app uses:
1. **Generate** — creates a new Stellar keypair, stores secret in `expo-secure-store`
2. **Import** — import an existing secret key

> For testnet only. Fund your address at [Stellar Friendbot](https://friendbot.stellar.org)

## Contract

**Testnet:** `CA7DGEWWS3VH5J2I4I7FFEB5UHK2MJSYWDKDQKXQM7GDNLI2IRATDTLG`

## Design

Dark theme: background `#0a0a0a`, accent yellow `#facc15` — matches web app exactly.
