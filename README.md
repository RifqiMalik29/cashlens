# CashLens 💰

Personal finance tracker built with React Native Expo. Features daily/monthly/yearly transaction recording, automatic receipt scanning via OCR, multi-currency support, custom categories, and budgeting.

---

## Tech Stack

| Category       | Technology                                        |
| -------------- | ------------------------------------------------- |
| Framework      | Expo SDK 54 (Managed Workflow)                    |
| Navigation     | Expo Router v6 (file-based)                       |
| Language       | TypeScript (strict)                               |
| Styling        | NativeWind v4 + Tailwind CSS                      |
| State          | Zustand + AsyncStorage persist                    |
| Local Storage  | AsyncStorage (data) + MMKV (preferences)          |
| Backend        | Supabase (auth + cloud sync)                      |
| OCR            | @react-native-ml-kit/text-recognition (on-device) |
| Charts         | Victory Native XL                                 |
| Icons          | Lucide React Native                               |
| Bottom Sheet   | @gorhom/bottom-sheet                              |
| Currency Rates | exchangerate.host                                 |

---

## Features

- 📝 Record income & expense transactions
- 📷 Scan receipts automatically with on-device OCR
- 💱 Multi-currency with live exchange rates
- 🗂️ Custom categories
- 📊 Budget management with period tracking
- ☁️ Cloud sync via Supabase
- 📱 Android & iOS support

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Expo Go app or Android/iOS emulator

### Installation

```bash
# Clone the repository
git clone https://github.com/RifqiMalik29/cashlens.git
cd cashlens

# Install dependencies
pnpm install

# Start development server
pnpm start
```

### Running on device

```bash
pnpm android   # Android emulator
pnpm ios       # iOS simulator
```

---

## Project Structure

```
cashlens/
├── app/
│   ├── (auth)/          # Login, onboarding screens
│   ├── (tabs)/          # Main tab screens (re-exports only)
│   └── _layout.tsx      # Root layout
└── src/
    ├── components/
    │   └── ui/          # Reusable UI components
    ├── constants/        # Theme, categories, currencies
    ├── hooks/           # Shared hooks (useHeader, etc.)
    ├── screens/         # Screen components + co-located hooks
    │   ├── Dashboard/
    │   ├── Transactions/
    │   ├── Scanner/
    │   ├── Budget/
    │   └── Settings/
    ├── services/        # Supabase, OCR, currency API
    ├── stores/          # Zustand stores
    ├── types/           # TypeScript types
    └── utils/           # Helper functions
```

---

## Scripts

```bash
pnpm start          # Start Expo dev server
pnpm android        # Run on Android
pnpm ios            # Run on iOS
pnpm typecheck      # TypeScript check
pnpm lint           # ESLint check
pnpm lint:fix       # ESLint auto-fix
pnpm format         # Prettier format
pnpm format:check   # Prettier check
```

---

## Development Notes

- All screen logic lives in `src/screens/<Name>/use<Name>.ts`
- Route files in `app/` are thin re-exports only
- Use `className` (NativeWind) for static styling, `style={}` for dynamic values
- Max 200 lines per file — split into subcomponents or helpers if exceeded
- Pre-commit hook runs: `prettier → eslint --fix → tsc --noEmit`

---

## License

MIT
