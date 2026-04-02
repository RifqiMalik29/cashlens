# Hardcoded Height Values Documentation

**Generated:** April 1, 2026  
**Project:** CashLens  
**Tech Stack:** Expo SDK 52, React Native, NativeWind v4

---

## Overview

This document catalogs all hardcoded height-related values found in the CashLens codebase. Values are categorized by type and location with recommendations for improvement.

---

## Summary

| Category                       | Count | Files Affected |
| ------------------------------ | ----- | -------------- |
| Direct `height`                | 6     | 3              |
| NativeWind `h-*`               | 3     | 2              |
| `paddingTop` / `paddingBottom` | 10    | 4              |
| `marginTop` / `marginBottom`   | 20+   | 5              |
| Shadow offsets                 | 3     | 1              |

---

## 1. Direct Height Values

### Component Files

| File                           | Line | Value         | Context            | Recommendation                        |
| ------------------------------ | ---- | ------------- | ------------------ | ------------------------------------- |
| `src/components/ui/Input.tsx`  | 60   | `h-12` (48px) | Input field height | ✅ Acceptable - standard input height |
| `src/components/ui/Button.tsx` | 42   | `h-9` (36px)  | Button small size  | ✅ Acceptable - size variant          |
| `src/components/ui/Button.tsx` | 43   | `h-11` (44px) | Button medium size | ✅ Acceptable - size variant          |
| `src/components/ui/Button.tsx` | 44   | `h-[52px]`    | Button large size  | ⚠️ Use constant from theme            |

### Screen Files

| File                                          | Line | Value        | Context               | Recommendation                         |
| --------------------------------------------- | ---- | ------------ | --------------------- | -------------------------------------- |
| `src/screens/Onboarding/OnboardingScreen.tsx` | 147  | `height: 8`  | Dot indicator height  | ⚠️ Extract to constant                 |
| `src/screens/Onboarding/OnboardingScreen.tsx` | 153  | `height: 52` | Primary button height | ⚠️ Use `spacing[13]` or theme constant |
| `app/(tabs)/_layout.tsx`                      | 21   | `height: 60` | Tab bar height        | ✅ Acceptable - standard tab bar       |

---

## 2. Shadow Offset Heights

| File                     | Line | Value       | Context          | Recommendation          |
| ------------------------ | ---- | ----------- | ---------------- | ----------------------- |
| `src/constants/theme.ts` | 53   | `height: 1` | Shadow sm offset | ✅ Centralized in theme |
| `src/constants/theme.ts` | 60   | `height: 2` | Shadow md offset | ✅ Centralized in theme |
| `src/constants/theme.ts` | 67   | `height: 4` | Shadow lg offset | ✅ Centralized in theme |

**Status:** ✅ Properly centralized in theme constants.

---

## 3. Padding Values (Vertical)

### LoginScreen.tsx

| Line | Value               | Context                  | Recommendation       |
| ---- | ------------------- | ------------------------ | -------------------- |
| 129  | `paddingTop: 40`    | Logo area top padding    | ⚠️ Use `spacing[10]` |
| 130  | `paddingBottom: 24` | Logo area bottom padding | ⚠️ Use `spacing[6]`  |
| 123  | `paddingBottom: 32` | Scroll content padding   | ⚠️ Use `spacing[8]`  |

### RegisterScreen.tsx

| Line | Value               | Context                | Recommendation      |
| ---- | ------------------- | ---------------------- | ------------------- |
| 154  | `paddingTop: 16`    | Header top padding     | ⚠️ Use `spacing[4]` |
| 149  | `paddingBottom: 32` | Scroll content padding | ⚠️ Use `spacing[8]` |

### OnboardingScreen.tsx

| Line | Value               | Context             | Recommendation      |
| ---- | ------------------- | ------------------- | ------------------- |
| 137  | `paddingBottom: 32` | Bottom area padding | ⚠️ Use `spacing[8]` |

### Tab Bar

| File                     | Line | Value              | Context         | Recommendation      |
| ------------------------ | ---- | ------------------ | --------------- | ------------------- |
| `app/(tabs)/_layout.tsx` | 22   | `paddingBottom: 8` | Tab bar padding | ⚠️ Use `spacing[2]` |

---

## 4. Margin Values (Vertical)

### OnboardingScreen.tsx

| Line | Value              | Context               | Recommendation      |
| ---- | ------------------ | --------------------- | ------------------- |
| 129  | `marginTop: 24`    | Title margin          | ⚠️ Use `spacing[6]` |
| 133  | `marginTop: 12`    | Subtitle margin       | ⚠️ Use `spacing[3]` |
| 144  | `marginBottom: 24` | Dots container margin | ⚠️ Use `spacing[6]` |

### LoginScreen.tsx

| Line | Value           | Context                   | Recommendation      |
| ---- | --------------- | ------------------------- | ------------------- |
| 136  | `marginTop: 12` | Title margin              | ⚠️ Use `spacing[3]` |
| 141  | `marginTop: 4`  | Subtitle margin           | ⚠️ Use `spacing[1]` |
| 144  | `marginTop: 8`  | Error text margin         | ⚠️ Use `spacing[2]` |
| 147  | `marginTop: 16` | Password container margin | ⚠️ Use `spacing[4]` |
| 152  | `marginTop: 8`  | Error text margin         | ⚠️ Use `spacing[2]` |
| 155  | `marginTop: 24` | Login button margin       | ⚠️ Use `spacing[6]` |
| 161  | `marginTop: 24` | Bottom row margin         | ⚠️ Use `spacing[6]` |

### RegisterScreen.tsx

| Line | Value              | Context                | Recommendation      |
| ---- | ------------------ | ---------------------- | ------------------- |
| 155  | `marginBottom: 24` | Header margin          | ⚠️ Use `spacing[6]` |
| 166  | `marginBottom: 32` | Subtitle margin        | ⚠️ Use `spacing[8]` |
| 169  | `marginTop: 8`     | Error text margin      | ⚠️ Use `spacing[2]` |
| 172  | `marginTop: 16`    | Input spacing margin   | ⚠️ Use `spacing[4]` |
| 177  | `marginTop: 8`     | Error text margin      | ⚠️ Use `spacing[2]` |
| 180  | `marginTop: 24`    | Register button margin | ⚠️ Use `spacing[6]` |
| 186  | `marginTop: 24`    | Bottom row margin      | ⚠️ Use `spacing[6]` |

---

## 5. Recommendations

### High Priority

1. **Create height constants in theme**

   ```ts
   // src/constants/theme.ts
   export const heights = {
     input: 48,
     buttonSm: 36,
     buttonMd: 44,
     buttonLg: 52,
     tabBar: 60,
     dotIndicator: 8
   };
   ```

2. **Use existing spacing constants**
   The `spacing` object already exists in `theme.ts` with values from 4px to 80px. Replace hardcoded margins/padding with these:

   ```ts
   // Instead of:
   marginTop: 24;

   // Use:
   marginTop: spacing[6]; // or reference from theme
   ```

### Medium Priority

3. **Standardize button heights**
   Update `Button.tsx` to use theme constants:

   ```ts
   import { heights } from "@constants/theme";

   const sizeConfig = {
     sm: { containerClass: "", height: heights.buttonSm, fontSize: 13 },
     md: { containerClass: "", height: heights.buttonMd, fontSize: 15 },
     lg: { containerClass: "", height: heights.buttonLg, fontSize: 17 }
   };
   ```

4. **Update NativeWind classes to use config**
   Extend Tailwind config with custom heights:
   ```js
   // tailwind.config.js
   module.exports = {
     theme: {
       extend: {
         height: {
           input: "48px",
           "button-sm": "36px",
           "button-md": "44px",
           "button-lg": "52px"
         }
       }
     }
   };
   ```

### Low Priority

5. **Shadow offsets are fine**
   Already centralized in `theme.ts` - no action needed.

6. **Tab bar height is acceptable**
   Standard mobile tab bar height (60px) - no action needed.

---

## Files Requiring Updates

| Priority | File                                          | Changes Needed              |
| -------- | --------------------------------------------- | --------------------------- |
| High     | `src/constants/theme.ts`                      | Add `heights` constant      |
| High     | `src/screens/Onboarding/OnboardingScreen.tsx` | Replace 6 hardcoded values  |
| High     | `src/screens/Login/LoginScreen.tsx`           | Replace 10 hardcoded values |
| High     | `src/screens/Register/RegisterScreen.tsx`     | Replace 9 hardcoded values  |
| Medium   | `src/components/ui/Button.tsx`                | Use theme heights           |
| Medium   | `src/components/ui/Input.tsx`                 | Use theme height            |
| Medium   | `tailwind.config.js`                          | Add custom height utilities |
| Low      | `app/(tabs)/_layout.tsx`                      | Use spacing constant        |

---

## Existing Theme Constants

The following constants already exist in `src/constants/theme.ts` and should be utilized:

```ts
export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999
};

export const fontSizes = {
  xs: 11,
  sm: 13,
  base: 15,
  lg: 17,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36
};
```

---

## Action Items

- [ ] Add `heights` constant to `src/constants/theme.ts`
- [ ] Update `OnboardingScreen.tsx` to use theme constants
- [ ] Update `LoginScreen.tsx` to use theme constants
- [ ] Update `RegisterScreen.tsx` to use theme constants
- [ ] Update `Button.tsx` component to use theme heights
- [ ] Update `Input.tsx` component to use theme height
- [ ] Extend `tailwind.config.js` with custom height utilities
- [ ] Update `app/(tabs)/_layout.tsx` to use spacing constant
- [ ] Run lint and typecheck after changes

---

**Note:** Not all hardcoded values need to be changed. Values that are truly constant (like icon sizes, standard component dimensions) can remain hardcoded. Focus on values that might need to change based on theme, platform, or design system updates.
