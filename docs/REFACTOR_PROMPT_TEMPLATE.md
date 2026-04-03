Act as a Senior React Native Developer.

### Objective

Implement a dedicated **Language Selection** screen in the Settings flow, replacing the current inline toggle for a better user experience.

### Requirements:

1.  **New Route (`app/(tabs)/settings/language.tsx`)**:
    - Create a new route file that re-exports the `LanguageSelectorScreen`.

2.  **New Screen (`src/screens/LanguageSelector/LanguageSelectorScreen.tsx`)**:
    - Create a clean list of supported languages (Indonesian, English).
    - Display each language with its name and a radio-button or checkmark indicating the current selection.
    - Follow the project's design system: card-based or list-item layout with proper spacing.
    - Use the `useHeader` hook to set the title (e.g., "Pilih Bahasa" / "Select Language").

3.  **Hook Logic (`src/screens/LanguageSelector/useLanguageSelector.ts`)**:
    - Handle language selection logic.
    - Update the `useAuthStore` preferences when a language is selected.
    - Call `i18n.changeLanguage()` to apply the change immediately across the app.
    - Navigate back to the Settings screen after selection.

4.  **Update Settings Screen**:
    - Update `useSettingsScreen.ts` to navigate to `/(tabs)/settings/language` instead of toggling the state inline.
    - Update `app/(tabs)/settings/_layout.tsx` to include the new `language` screen in the Stack.

5.  **Styling**:
    - Use NativeWind v4 `className` for all layout and UI components.
    - Align colors and typography with the existing `CurrencySelector` screen for consistency.

Please provide the implementation for the new screen, its hook, and the necessary updates to navigation and existing settings logic.
