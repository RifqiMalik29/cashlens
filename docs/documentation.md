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

#### 1. Supabase Setup (Cloud Sync & Auth) ✅ COMPLETED

CashLens uses Supabase for authentication and cloud data synchronization.

**Status: Fully Configured**

- ✅ Project URL & Anon Key configured in `.env.local`
- ✅ Database schema created (`supabase-schema.sql` executed)
- ✅ Supabase client configured with AsyncStorage persistence
- ✅ Sync service implemented (`src/services/syncService.ts`)
- ✅ RLS policies enabled for data security

**Database Tables Created:**

- `profiles` table for user preferences and email ✅
- `transactions` table with RLS enabled ✅
- `budgets` table with RLS enabled ✅
- `categories` table with RLS enabled ✅
- Indexes and policies ensuring users can only access their own data ✅

**Next Steps (Optional Enhancements):**

- [ ] Add sync UI with status indicators
- [ ] Implement auth flow (login/signup screens)
- [ ] Test sync functionality end-to-end
- [ ] Add real-time subscriptions for live updates

#### 2. Environment Variables ✅ CONFIGURED

The `.env.local` file has been created in the root directory with Supabase credentials:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://cuqoqayibifuiaitnciv.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Eb5Cb09bEIqXBeswBlWefA_idMg4bBv
```

**Note:** This file is gitignored for security.

#### 3. Native Dependencies (OCR & Camera)

The app relies on native modules that require proper installation:

- **OCR**: Powered by `@react-native-ml-kit/text-recognition`. This is an on-device OCR that works offline.
- **Camera**: Powered by `expo-camera` for real-time receipt capture.
- **Image Picker**: Powered by `expo-image-picker` for gallery selection.
- **Haptics**: Powered by `expo-haptics` for tactile feedback on user actions.

#### 4. Android/iOS Configuration

- **Package Name**: `com.rifqi2173.cashlens` (Android) / `cashlens` (iOS).
- **Permissions**: Ensure permissions for Camera and Media Library are requested in `app.json` or handled at runtime.

#### 5. Store Deployment Guide

For complete instructions on deploying CashLens to Google Play Store and Apple App Store, see:

- **[Store Deployment Guide](./STORE_DEPLOYMENT.md)** - Step-by-step deployment checklist, asset requirements, submission process, and post-launch maintenance.

### Thread Progress

- [✅] Thread #0 — Planning & Architecture
- [✅] Thread #1 — Project Setup + Design System
- [✅] Thread #2 — Auth + Onboarding (Login, Register, Onboarding screens implemented)
- [✅] Thread #3 — Transaction CRUD (Listing, Add/Edit Form, Custom DatePicker)
- [✅] Thread #4 — Receipt Scanner (ML Kit + Locale-aware Parsing)
- [✅] Thread #5 — Dashboard + Analytics (Balance Summary, Spending Charts)
- [✅] Thread #6 — Budget Management (Budget Planning, Progress Tracking)
- [✅] Thread #7 — Cloud Sync (Supabase - Client configured, schema created, sync service implemented)
- [✅] Thread #8 — Settings + Polish (Currency, Category, Preferences, UX)
- [✅] Thread #9 — Branding & Launch Prep (Icon, Splash, App Name configured in app.json)
- [✅] Thread #10 — Localization (i18n implementation - Indonesian & English)
- [✅] Thread #11 — Business Plan & Strategy (Drafted in docs/BUSINESS_PLAN.md)
- [✅] Thread #12 — Store Deployment Preparation (Guide created in docs/STORE_DEPLOYMENT.md)

### Current Thread

Thread #13 — Infrastructure & Polish (Current)

**Recently Completed:**

- ✅ Supabase connection configured with AsyncStorage persistence
- ✅ Database schema created with RLS policies
- ✅ Environment variables secured
- ✅ Store deployment guide created
- ✅ Status bar color issue fixed
- ✅ Cloud Sync stabilized with retry logic and UUID validation
- ✅ Auto-login after registration implemented
- ✅ Localization (i18n) implemented for Indonesian and English
- ✅ Language toggle in Settings working with Zustand sync

**Upcoming Tasks:**

- [ ] Test sync functionality end-to-end with real Supabase data
- [ ] Add real-time subscriptions for live data updates
- [ ] Final testing and bug fixes before store deployment
- [ ] Prepare app icons and splash screens for production
- [ ] Configure app signing and build production bundles

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
