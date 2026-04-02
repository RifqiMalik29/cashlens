Act as a Senior React Native Developer.

### Objective

Implement the **Settings & Polish** feature (Thread #8). This final thread focuses on user preferences, customization, and refining the overall user experience.

### Requirements:

1.  **Settings Overview (`src/screens/Settings/SettingsScreen.tsx`)**:
    - Display sections: **Profile**, **Finance**, **Preferences**, **Support**, and **Account**.
    - **Profile**: Show user email and a "Logout" button.
    - **Finance**:
      - "Base Currency": Navigate to a selector to change the primary currency.
      - "Manage Categories": Navigate to a screen to add/edit/delete categories.
    - **Preferences**:
      - "Language": Toggle between Indonesian and English.
      - "Theme": Toggle between Light, Dark, and System.

2.  **Currency Selector (`src/screens/CurrencySelector/`)**:
    - List all available currencies from `src/constants/currencies.ts`.
    - Search bar to filter currencies.
    - Update `useAuthStore` or `useCurrencyStore` when a new base currency is selected.

3.  **Category Management (`src/screens/CategoryManagement/`)**:
    - List all categories from `useCategoryStore`.
    - Allow adding a new custom category (Name, Icon, Color, Type).
    - Allow editing or deleting custom categories (Default categories cannot be deleted).

4.  **UI/UX Polish**:
    - **Animations**: Ensure smooth screen transitions and button interactions.
    - **Feedback**: Use `Haptics` (expo-haptics) for key actions like adding a transaction or deleting a budget.
    - **Error Handling**: Improve visual feedback for API/Sync errors.
    - **Empty States**: Refine empty states across the app with consistent illustrations or icons.

### Guidelines:

- **Styling**: Continue with NativeWind v4 `className`.
- **Consistency**: Use the `useHeader` hook for all new screens.
- **Icons**: Use `lucide-react-native`.

Please provide the implementation for the Settings screen, its sub-screens, and the overall UX refinements.
