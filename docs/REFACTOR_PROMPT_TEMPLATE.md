Act as a Senior React Native Developer working on the CashLens app.

### Objective

Implement the Transaction CRUD feature (Thread #3). This includes listing transactions on the `TransactionsScreen` and providing a form to add/edit transactions.

### Requirements:

1. **Transactions Listing (`src/screens/Transactions/TransactionsScreen.tsx`)**:
   - Use `SectionList` to group transactions by date (descending).
   - Each section header should display the date (e.g., "Today", "Yesterday", "25 Mar 2026") and the net balance for that day.
   - Use a `TransactionItem` subcomponent to display each record:
     - Show category icon (with circular background using category color).
     - Show category name and note (if exists).
     - Show amount formatted with currency (e.g., "-Rp 50.000" for expense in red/dark, "Rp 100.000" for income in green).
   - Implement an "Add" button in the header (using `headerRight`) that navigates to the transaction form.
   - Show an `EmptyState` component when there are no transactions.

2. **Transaction Form (`src/screens/TransactionForm/`)**:
   - Create a new screen `TransactionFormScreen.tsx` and its logic hook `useTransactionForm.ts`.
   - The form should handle both "Add" and "Edit" modes (based on an optional `id` parameter).
   - **Fields**:
     - **Amount**: Numeric keyboard, large typography.
     - **Type**: Toggle/Segmented control for "Expense" vs "Income".
     - **Category Selector**: A grid or list of categories fetched from `useCategoryStore`. Active category should be highlighted.
     - **Date Picker**: Use a standard date picker to select the transaction date.
     - **Note**: Multiline input for optional notes.
     - **Currency**: Default to base currency from `useCurrencyStore`.
   - **Actions**:
     - "Save" button to persist the transaction to `useTransactionStore`.
     - "Delete" button (only in Edit mode) with confirmation.
   - Navigate back after successful save/delete.

3. **Shared Components (`src/components/transaction/`)**:
   - `TransactionItem.tsx`: Individual row in the list.
   - `TransactionList.tsx`: Wrapper for the SectionList.
   - `CategoryPicker.tsx`: Component for selecting a category.

### Guidelines:

- **Styling**: Use NativeWind v4 `className` exclusively. Refer to `src/constants/theme.ts` for spacing, colors, and shadows.
- **Logic**: All screen state and handlers MUST be in the `use<ScreenName>.ts` hook. The screen file should be purely UI.
- **Types**: Use the `Transaction` and `Category` types from `src/types/index.ts`.
- **Formatting**: Use a utility to format currency based on the transaction's currency code.
- **Navigation**: Use `expo-router` for navigation between screens.
- **Code Quality**: Maximum 200 lines per file. Break complex components into smaller sub-components.

Please provide the implementation for the new screen, updated components, and the logic hooks. Ensure everything is wired up to `useTransactionStore`, `useCategoryStore`, and `useCurrencyStore`.
