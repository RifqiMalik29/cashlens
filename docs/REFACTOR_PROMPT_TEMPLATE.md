Act as a Senior React Native Developer.

### Objective

Implement **Localization (i18n)** for the CashLens app (Thread #10). This will allow the app to support both Indonesian (id) and English (en) languages seamlessly.

### Requirements:

1.  **Setup i18next**:
    - Install (or assume usage of) `i18next` and `react-i18next`.
    - Create a configuration file at `src/services/i18n.ts`.
    - Initialize with `en` and `id` resources.
    - Detect system language or fallback to the language stored in `useAuthStore`.

2.  **Resource Files**:
    - Create `src/constants/translations/en.json`.
    - Create `src/constants/translations/id.json`.
    - Translate key UI strings:
      - **Auth**: Login, Register, Email, Password, etc.
      - **Tabs**: Home, Transactions, Scan, Budget, Settings.
      - **Dashboard**: Total Balance, Recent Transactions, etc.
      - **Form**: Amount, Category, Date, Note, Save, Delete.

3.  **App Integration**:
    - Import `src/services/i18n.ts` in `app/_layout.tsx`.
    - Replace hardcoded strings in screens and components with the `t()` function from `useTranslation()`.
    - Update the language toggle in `SettingsScreen.tsx` to actually change the app language using `i18n.changeLanguage()`.

4.  **Zustand Sync**:
    - Ensure the language preference in `useAuthStore` is updated and persisted when the language is changed.

### Guidelines:

- **Consistency**: Use a hierarchical structure in JSON files (e.g., `auth.login`, `dashboard.balance`).
- **Ease of Use**: All new strings added in the future should follow this i18n pattern.

Please provide the implementation for the i18n service, translation files, and examples of how to update a screen (e.g., `LoginScreen.tsx`) to use translations.
