Act as a Senior React Native Developer working on the CashLens app.

I need you to refactor the screen files inside the `src/screens/` folder. Currently, the `Budget`, `Dashboard`, `Scanner`, `Settings`, and `Transactions` screens are empty wrappers, so please focus specifically on refactoring `LoginScreen.tsx`, `RegisterScreen.tsx`, and `OnboardingScreen.tsx`.

### Objective

Refactor these screens to be strictly component-based by breaking them down into smaller, cohesive subcomponents, and migrate their styling to NativeWind v4.

### Key Guidelines & Rules:

1. **Component Extraction**: Break down the large screen files into smaller parts.
   - For Login & Register: Extract sections like `AuthLogo`, `LoginForm`, `RegisterForm`, and `AuthFooter`. If components are shared between Login and Register (like the Logo or Footer), place them in `src/components/auth/`. If they are specific to the screen, place them in `src/screens/<ScreenName>/components/`.
   - For Onboarding: Extract sections like `OnboardingSlide`, `PaginationDots`, and `BottomControls` into `src/screens/Onboarding/components/`.
2. **Styling Migration (Crucial)**: The current screens heavily rely on `StyleSheet`. You must refactor all styling to use NativeWind v4 via the `className` prop. Only use `style={}` or `StyleSheet` for dynamic values, `SafeAreaView` insets, or complex layout calculations (such as dynamic widths from `useWindowDimensions`).
3. **Separation of Concerns**: Main screen UI must remain in `src/screens/<ScreenName>/<ScreenName>.tsx`. Keep all state and business logic untouched inside their respective `use<ScreenName>.ts` files.
4. **Code Standards**:
   - Maximum 200 lines per file.
   - NO comments inside the generated code.
   - Use semicolons, double quotes, and no trailing commas.
   - Do not alter the existing app behavior, types, or functionality.
5. **Output Requirement**: Provide the complete refactored code for all new and updated files. Do not use placeholders like "..." or omit any existing code.

Please start by providing the refactored code for the newly extracted components and the updated `LoginScreen.tsx`, `RegisterScreen.tsx`, and `OnboardingScreen.tsx`.
