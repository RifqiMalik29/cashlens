# CashLens 💰

Personal finance tracker built with React Native Expo. Features daily/monthly/yearly transaction recording, AI-powered receipt scanning with offline fallback, automatic transaction detection from banking notifications, multi-currency support, custom categories, and budgeting.

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
| Auth & Sync    | Custom REST API with JWT tokens                   |
| Secure Storage | react-native-keychain (encrypted token storage)   |
| Backend        | Custom backend (Google Cloud Run)                 |
| AI             | Google Gemini 3.1 Flash-Lite                      |
| OCR            | @react-native-ml-kit/text-recognition (on-device) |
| Charts         | Victory Native XL                                 |
| Icons          | Lucide React Native                               |
| Bottom Sheet   | @gorhom/bottom-sheet                              |
| i18n           | react-i18next (Indonesian & English)              |
| Currency Rates | exchangerate.host                                 |

---

## Features

- 📝 Record income & expense transactions
- 🤖 AI-powered receipt scanning with Advanced Hybrid pipeline
  - Local OCR → Gemini AI text parsing → Regex fallback
  - MD5 caching for duplicate scans (zero API cost on repeats)
  - 100% offline fallback when AI rate limit exceeded
- 🔔 **Automatic transaction detection from banking notifications**
  - Monitors banking app notifications (BCA Mobile, GoPay, etc.)
  - Parses transaction details using regex patterns
  - Creates draft transactions for review before adding to records
  - Zero manual entry required for detected transactions
- 💱 Multi-currency with live exchange rates
- 🗂️ Custom categories with filtering
- 📊 Budget management with period tracking
- 🌐 Bilingual support (Indonesian & English)
- 🎨 Customizable themes
- ☁️ Cloud sync via custom REST API
- 🔐 Secure authentication with JWT tokens + encrypted storage
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

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and Gemini API keys

# Start development server
pnpm start
```

### Environment Variables

Create a `.env.local` file in the project root:

```bash
# Backend API URL (production)
EXPO_PUBLIC_BACKEND_URL=https://cashlens-backend-552315397645.us-central1.run.app

# For development builds, use:
# APP_VARIANT=development
# EXPO_PUBLIC_BACKEND_URL=http://localhost:8080

# AI Services
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Optional: Sentry for error tracking
EXPO_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

> **Note**: The app uses a custom backend API for authentication and cloud sync. Contact the maintainer for backend access or deploy your own instance.

### Running on device

```bash
pnpm android   # Android emulator/device
pnpm ios       # iOS simulator/device
```

---

## Project Structure

```
cashlens/
├── app/
│   ├── (auth)/          # Login, onboarding screens
│   ├── (tabs)/          # Main tab screens (re-exports only)
│   ├── drafts.tsx       # Draft inbox screen
│   └── _layout.tsx      # Root layout
└── src/
    ├── components/
    │   ├── ui/          # Reusable UI components
    │   ├── scanner/     # Scanner-specific components
    │   └── ...          # transaction/, budget/, dashboard/, settings/
    ├── constants/       # Theme, categories, currencies, translations/
    ├── hooks/           # Shared hooks (useHeader, useSyncStatus, etc.)
    ├── screens/         # Screen components + co-located hooks
    │   ├── Dashboard/
    │   ├── Transactions/
    │   ├── Scanner/
    │   │   ├── hooks/   # useScannerCamera, useScannerProcessor
    │   │   └── ...
    │   ├── Drafts/      # Draft transaction inbox
    │   ├── Budget/
    │   ├── Settings/
    │   └── ...
    ├── services/        # API client, auth, Gemini AI, OCR, currency, sync, i18n, notifications
    ├── stores/          # Zustand stores (including useDraftStore)
    ├── types/           # TypeScript types (AI, transactions, etc.)
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

- All screen logic lives in `src/screens/<Name>/use<Name>.ts` hooks
- Route files in `app/` are thin re-exports only
- Use `className` (NativeWind) for static styling, `style={}` for dynamic values
- Max 200 lines per file — split into subcomponents or helpers if exceeded
- Pre-commit hook runs: `prettier → eslint --fix → tsc --noEmit`

### Path Aliases

Standardized to specific aliases (no catch-all `@/*`):

- `@components/*` → `src/components/*`
- `@constants/*` → `src/constants/*`
- `@hooks/*` → `src/hooks/*`
- `@screens/*` → `src/screens/*`
- `@services/*` → `src/services/*`
- `@stores/*` → `src/stores/*`
- `@types/*` → `src/types/*`
- `@utils/*` → `src/utils/*`

---

## License

MIT
