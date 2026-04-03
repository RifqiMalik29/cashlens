text

## Project: CashLens (React Native Finance App)

### About the Project

CashLens adalah aplikasi keuangan personal berbasis React Native Expo untuk mencatat transaksi harian/bulanan/tahunan, scan struk otomatis via OCR, multi-currency, custom category, dan budgeting. Target platform: Android & iOS. Tujuan: portfolio pribadi.

### Tech Stack

- Framework: Expo SDK 54+ (Managed Workflow), Expo Router v6 (file-based)
- Language: TypeScript (strict mode), path alias @ → src/
- State Management: Zustand + persist middleware (AsyncStorage)
- Local DB: AsyncStorage (data) + MMKV (preferences)
- Backend: Supabase (auth + cloud sync, free tier)
- OCR: @react-native-ml-kit/text-recognition (on-device, gratis, offline)
- Receipt Parser: Regex + rule-based (client-side, no paid API)
- Charts: Victory Native (via victory-native)
- UI: Custom components (no UI library)
- Icons: Lucide React Native
- Bottom Sheet: @gorhom/bottom-sheet
- Currency Rates: exchangerate.host (free, no API key)
- Animation: react-native-reanimated, react-native-gesture-handler
- Camera: expo-camera, expo-image-picker

### Design System

- Konsep: Minimalis, detail hidden (progressive disclosure via BottomSheet/Dialog/Tooltip)
- Warna: background #F7FAF8, primary green #4CAF82, green light #E8F5EE, white #FFFFFF, text primary #1A1A2E, text secondary #6B7280
- Font sizes: xs:11, sm:13, base:15, lg:17, xl:20, 2xl:24, 3xl:30, 4xl:36
- Spacing: 4px-based scale
- Border radius: sm:6, md:10, lg:16, xl:24, full:9999

### Folder Structure

cashlens/
├── app/
│ ├── (auth)/ # login, register, onboarding
│ ├── (tabs)/ # index (dashboard), transactions, scanner, budget, settings
│ ├── \_layout.tsx # root layout
│ └── (auth)/\_layout.tsx # auth group layout
└── src/
├── components/ui/ # Button, Card, Typography, Input, Badge, etc.
├── components/ # transaction/, scanner/, budget/, dashboard/
├── screens/ # Login/, Register/, Onboarding/, Dashboard/, Transactions/, Scanner/, Budget/, Settings/
├── stores/ # useTransactionStore, useBudgetStore, useCategoryStore, useCurrencyStore, useAuthStore
├── services/ # supabase.ts, ocr.ts, receiptParser.ts, currencyService.ts
├── hooks/ # shared/global hooks
├── utils/ # helper functions
├── constants/ # theme.ts, defaultCategories.ts, currencies.ts
└── types/ # index.ts (Transaction, Category, Budget, Currency, UserPreferences)

### Path Aliases (tsconfig.json)

- @_ → src/_
- @components/_ → src/components/_
- @constants/_ → src/constants/_
- @hooks/_ → src/hooks/_
- @screens/_ → src/screens/_
- @services/_ → src/services/_
- @stores/_ → src/stores/_
- @types/_ → src/types/_
- @utils/_ → src/utils/_
  text

### Core Types

- Transaction: { id, amount, currency, amountInBaseCurrency, exchangeRate, type (income|expense), categoryId, note, date, receiptImageUri?, isFromScan, createdAt, updatedAt }
- Category: { id, name, icon, color, isDefault, isCustom, type (income|expense|both) }
- Budget: { id, categoryId, amount, currency, period (monthly|weekly|yearly), startDate, endDate? }
- Currency: { code, name, symbol, flag }
- UserPreferences: { baseCurrency, theme, language, createdAt }

### Default Categories

15 expense: Food & Drink, Transport, Shopping, Bills & Utilities, Health, Entertainment, Education, Travel, Housing, Personal Care, Gifts, Investment, Savings, Business, Other
5 income: Salary, Freelance, Investment Return, Gift, Other Income

### Workflow & Rules

- Vibe coding menggunakan Qwen CLI gunakan peran sebagai senior react native developer
- Setiap thread = 1 fitur saja
- Di setiap thread: buat rencana dulu → buat prompt detail untuk Qwen CLI sebagai senior React Native developer
- Tidak ada comment di dalam code
- Tidak mengubah bentuk/struktur code jika tidak diminta
- Di akhir setiap thread: buat rangkuman apa yang sudah dikerjakan, lalu user akan update instruksi ini
- Gunakan 1 fenced code block di tiap promptnya
- Buat prompt dalam bahasa inggris
- Setiap prompt akan dibuat dalam format single fenced code block lengkap

### Infrastructure & External Setup

#### 1. Supabase Setup (Cloud Sync & Auth)

CashLens uses Supabase for authentication and cloud data synchronization.

- **Project URL & Anon Key**: Obtain these from your Supabase Project Settings.
- **Authentication**: Enable "Email Auth" in the Authentication dashboard.
- **Database**: Run the provided `supabase-schema.sql` in the **SQL Editor** of your Supabase dashboard. This will create:
  - `transactions` table with RLS enabled.
  - `budgets` table with RLS enabled.
  - `categories` table with RLS enabled.
  - Necessary indexes and policies to ensure users can only access their own data.

#### 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### 3. Native Dependencies (OCR & Camera)

The app relies on native modules that require proper installation:

- **OCR**: Powered by `@react-native-ml-kit/text-recognition`. This is an on-device OCR that works offline.
- **Camera**: Powered by `expo-camera` for real-time receipt capture.
- **Image Picker**: Powered by `expo-image-picker` for gallery selection.
- **Haptics**: Powered by `expo-haptics` for tactile feedback on user actions.

#### 4. Android/iOS Configuration

- **Package Name**: `com.rifqi2173.cashlens` (Android) / `cashlens` (iOS).
- **Permissions**: Ensure permissions for Camera and Media Library are requested in `app.json` or handled at runtime.

### Thread Progress

- [✅] Thread #0 — Planning & Architecture
- [✅] Thread #1 — Project Setup + Design System
- [✅] Thread #2 — Auth + Onboarding (Login, Register, Onboarding screens implemented)
- [✅] Thread #3 — Transaction CRUD (Listing, Add/Edit Form, Custom DatePicker)
- [✅] Thread #4 — Receipt Scanner (ML Kit + Locale-aware Parsing)
- [✅] Thread #5 — Dashboard + Analytics (Balance Summary, Spending Charts)
- [✅] Thread #6 — Budget Management (Budget Planning, Progress Tracking)
- [✅] Thread #7 — Cloud Sync (Supabase)
- [✅] Thread #8 — Settings + Polish (Currency, Category, Preferences, UX)
- [✅] Thread #9 — Branding & Launch Prep (Icon, Splash, App Name configured in app.json)
- [ ] Thread #10 — Localization (i18n implementation)
- [✅] Thread #11 — Business Plan & Strategy (Drafted in docs/BUSINESS_PLAN.md)

### Current Thread

Thread #10 — Localization (i18n implementation) (next)

### Additional Rules

- Styling default menggunakan NativeWind v4 dengan `className`
- `StyleSheet` atau `style={}` hanya digunakan untuk nilai dinamis, safe area inset, atau case yang tidak cocok dengan NativeWind
- Semua route file di `app/` harus tipis, hanya untuk re-export screen dari `src/screens/`
- Semua UI screen harus berada di `src/screens/<ScreenName>/<ScreenName>.tsx`
- Semua logic screen harus berada di `src/screens/<ScreenName>/use<ScreenName>.ts`
- `src/hooks/` hanya untuk shared/global hooks
- Gunakan `useHeader` di screen-specific hook, bukan langsung di file screen
- Maksimal 200 line per file, jika lebih harus dipecah ke subcomponent, hook, helper, atau constants terpisah
- Gunakan format code: semicolons, double quotes, no trailing comma, print width default
- Jalankan alur commit dengan format otomatis: prettier → eslint --fix → typecheck

### Scripts (package.json)

- `pnpm start` — start Expo dev server
- `pnpm android` — run on Android
- `pnpm ios` — run on iOS
- `pnpm lint` — run ESLint
- `pnpm typecheck` — run TypeScript type check
- `pnpm lint:fix` — auto-fix ESLint issues
- `pnpm format` — format code with Prettier
- `pnpm format:check` — check code formatting
