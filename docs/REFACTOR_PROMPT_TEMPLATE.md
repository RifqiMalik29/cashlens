Act as a Senior React Native Developer.

### Objective

Implement a fully custom, highly polished **DatePicker** component for the CashLens app using `react-native-reanimated` and `react-native-gesture-handler`. This component will replace the standard date input in the `TransactionFormScreen`.

### Requirements:

1.  **Visual Design**:
    - The picker should appear as a **Bottom Sheet** or a **Centered Modal** with a backdrop.
    - Follow the CashLens design system: background `#F7FAF8`, primary green `#4CAF82`, text primary `#1A1A2E`.
    - Include a header with the current month/year and "Prev/Next" navigation arrows.
    - Grid layout for days (7 columns). Highlight the selected date with a circular primary green background.
    - Smooth entry/exit animations and layout transitions using `react-native-reanimated`.

2.  **Functionality**:
    - Support selecting a specific date (Year, Month, Day).
    - Support navigating between months.
    - Display "Today" clearly and allow a quick jump to today's date.
    - Return the selected date in `ISO 8601` format or a standard `Date` object to the parent form.

3.  **Component Structure (`src/components/ui/DatePicker.tsx`)**:
    - Create a reusable `DatePicker` component.
    - Create a `DateInput` wrapper component in `src/components/transaction/DateInput.tsx` that displays the current value and triggers the picker on press.

4.  **Refactor `TransactionFormScreen.tsx`**:
    - Integrate the new `DateInput` and `DatePicker` into the form.
    - Ensure the state management in `useTransactionForm.ts` remains consistent with the new component.

### Guidelines:

- **Styling**: Use NativeWind v4 `className` for layout and static styles.
- **Animation**: Use `useSharedValue`, `useAnimatedStyle`, and `withTiming`/`withSpring` for all transitions.
- **Gestures**: Use `GestureDetector` from `react-native-gesture-handler` for swipe-to-change-month if possible.
- **Code Standards**: No third-party date picker libraries (like `react-native-modal-datetime-picker`). Build the UI from scratch using standard `View`, `Text`, and `TouchableOpacity`.

Please provide the implementation for the `DatePicker` component, the updated `DateInput`, and any necessary updates to the `TransactionForm` flow.
