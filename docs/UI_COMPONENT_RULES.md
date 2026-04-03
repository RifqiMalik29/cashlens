# UI Component Creation Rules

## Overview

This document defines the **mandatory rules and best practices** for creating UI components in CashLens. Following these rules ensures consistency, maintainability, and a professional design system across the entire application.

---

## Table of Contents

1. [Design System Fundamentals](#1-design-system-fundamentals)
2. [Component Architecture](#2-component-architecture)
3. [File Structure & Naming](#3-file-structure--naming)
4. [TypeScript Patterns](#4-typescript-patterns)
5. [Styling Rules](#5-styling-rules)
6. [Props API Design](#6-props-api-design)
7. [Variant Implementation](#7-variant-implementation)
8. [Component Templates](#8-component-templates)
9. [Common Patterns](#9-common-patterns)
10. [Anti-Patterns (What NOT to Do)](#10-anti-patterns-what-not-to-do)
11. [Testing Checklist](#11-testing-checklist)

---

## 1. Design System Fundamentals

### 1.1 Design Tokens

**ALL values MUST use design tokens from `@constants/theme`.**

```typescript
// ✅ CORRECT - Using tokens
import { colors, spacing, borderRadius, fontSizes } from "@constants/theme";

const myStyle = {
  backgroundColor: colors.primary,
  padding: spacing[4],
  borderRadius: borderRadius.md
};

// ❌ WRONG - Hardcoded values
const myStyle = {
  backgroundColor: "#4CAF82",
  padding: 16,
  borderRadius: 10
};
```

### 1.2 Token Reference

| Token          | Usage                  | Example                               |
| -------------- | ---------------------- | ------------------------------------- |
| `colors`       | All color values       | `colors.primary`, `colors.background` |
| `spacing`      | Padding, margins, gaps | `spacing[4]` = 16px                   |
| `fontSizes`    | Text sizes             | `fontSizes.base` = 15                 |
| `borderRadius` | Corner radius          | `borderRadius.md` = 10                |
| `heights`      | Fixed heights          | `heights.buttonMd` = 44               |
| `shadows`      | Shadow presets         | `shadows.md`                          |

### 1.3 Color Palette

```typescript
colors = {
  background: "#F7FAF8", // App background
  primary: "#4CAF82", // Primary green (brand)
  primaryLight: "#E8F5EE", // Light green (tints)
  white: "#FFFFFF",
  textPrimary: "#1A1A2E", // Main text
  textSecondary: "#6B7280", // Muted text
  border: "#E5E7EB", // Borders
  error: "#EF4444", // Errors/danger
  warning: "#F59E0B", // Warnings
  success: "#10B981", // Success states
  surface: "#FFFFFF", // Card backgrounds
  surfaceSecondary: "#F3F4F6", // Secondary surfaces
  overlay: "rgba(0,0,0,0.5)" // Modal overlays
};
```

### 1.4 Typography Scale

| Variant     | Size | Usage               |
| ----------- | ---- | ------------------- |
| `h1`        | 30px | Page titles         |
| `h2`        | 24px | Section headers     |
| `h3`        | 20px | Modal titles        |
| `h4`        | 17px | Subsections         |
| `bodyLarge` | 15px | Important body text |
| `body`      | 13px | Default text        |
| `caption`   | 11px | Helper text, labels |
| `label`     | 11px | Uppercase labels    |

### 1.5 Spacing Scale

**4px base unit system:**

| Token        | Value | Usage           |
| ------------ | ----- | --------------- |
| `spacing[1]` | 4px   | Tight gaps      |
| `spacing[2]` | 8px   | Icon gaps       |
| `spacing[3]` | 12px  | Small gaps      |
| `spacing[4]` | 16px  | Default padding |
| `spacing[5]` | 20px  | Medium gaps     |
| `spacing[6]` | 24px  | Section gaps    |
| `spacing[8]` | 32px  | Large gaps      |

---

## 2. Component Architecture

### 2.1 STRICT Separation of Concerns

**This is the MOST IMPORTANT rule in this project.**

| File Extension    | Responsibility     | What's Allowed                                                                 |
| ----------------- | ------------------ | ------------------------------------------------------------------------------ |
| **`.tsx`**        | ONLY JSX rendering | JSX elements, hook destructuring, ternary operators for conditional rendering  |
| **`.ts` (hooks)** | ALL logic          | Functions, state, variables, data initialization, business logic, calculations |

### 2.2 What Goes Where

#### ✅ In `.tsx` Files (Screen/Component):

```typescript
// ✅ CORRECT - Pure rendering logic only
export default function MyScreen() {
  // 1. ONLY hook destructuring
  const { data, handlers, state } = useMyScreen();

  // 2. ONLY JSX return
  return (
    <View>
      {state.isLoading ? <LoadingSpinner /> : <Content data={data} />}
    </View>
  );
}
```

**Allowed in `.tsx`:**

- ✅ Hook destructuring: `const { data } = useMyScreen()`
- ✅ JSX elements: `<View>...</View>`
- ✅ Conditional rendering: `{isLoading ? <A /> : <B />}`
- ✅ List rendering: `{items.map(item => <Item key={item.id} {...item} />)}`
- ✅ Simple ternary in JSX: `{isActive ? "active" : "inactive"}`

**NOT Allowed in `.tsx`:**

- ❌ Function declarations: `const handleClick = () => { ... }`
- ❌ Variable initialization: `const themes = [...]`
- ❌ Data transformations: `const filtered = items.filter(...)`
- ❌ Calculations: `const total = items.reduce(...)`
- ❌ State declarations: `const [count, setCount] = useState(0)`
- ❌ Effects: `useEffect(() => { ... }, [])`
- ❌ Complex logic: `if/else` blocks outside JSX

#### ✅ In `.ts` Files (Custom Hooks):

```typescript
// ✅ CORRECT - All logic in hook
export function useMyScreen() {
  // 1. State initialization
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Item[]>([]);

  // 2. Data initialization
  const items = useMemo(
    () => [
      { id: 1, label: "Item 1" },
      { id: 2, label: "Item 2" }
    ],
    []
  );

  // 3. Functions
  const handlePress = async (id: number) => {
    setIsLoading(true);
    await doSomething(id);
    setIsLoading(false);
  };

  // 4. Data transformations
  const filteredItems = useMemo(
    () => items.filter((item) => item.active),
    [items]
  );

  // 5. Effects
  useEffect(() => {
    fetchData();
  }, []);

  // 6. Return everything
  return {
    data: filteredItems,
    isLoading,
    handlePress
  };
}
```

**Must be in hooks (`.ts`):**

- ✅ All `useState`, `useMemo`, `useCallback`, `useEffect`
- ✅ All function declarations
- ✅ All data initialization
- ✅ All calculations and transformations
- ✅ All business logic
- ✅ All API calls
- ✅ All navigation logic

### 2.3 Example: Correct Separation

#### Hook File (`useMyScreen.ts`):

```typescript
import { useState, useMemo, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";

export function useMyScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  // Data initialization - MUST be here, NOT in .tsx
  const categories = useMemo(
    () => [
      { id: "food", label: "Food & Drink", icon: "utensils" },
      { id: "transport", label: "Transport", icon: "car" },
      { id: "shopping", label: "Shopping", icon: "bag" }
    ],
    []
  );

  // Function - MUST be here, NOT in .tsx
  const handleCategoryPress = useCallback(
    (categoryId: string) => {
      navigation.navigate("category-detail", { id: categoryId });
    },
    [navigation]
  );

  // Derived data - MUST be here, NOT in .tsx
  const activeCategories = useMemo(
    () => categories.filter((cat) => cat.active),
    [categories]
  );

  return {
    categories: activeCategories,
    isLoading,
    handleCategoryPress
  };
}
```

#### Screen File (`MyScreen.tsx`):

```typescript
import { View, FlatList } from "react-native";
import { CategoryCard } from "@components/category";
import { useMyScreen } from "./useMyScreen";

export default function MyScreen() {
  // ONLY hook destructuring
  const { categories, isLoading, handleCategoryPress } = useMyScreen();

  // ONLY JSX return
  return (
    <View className="flex-1 bg-background">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              onPress={() => handleCategoryPress(item.id)}
            />
          )}
        />
      )}
    </View>
  );
}
```

### 2.4 Component Location

```
src/components/
├── ui/                    # Generic reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── ...
├── transaction/           # Domain-specific components
├── scanner/               # Scanner-related components
└── settings/              # Settings components
```

**Rules:**

- ✅ Generic components → `src/components/ui/`
- ✅ Domain-specific → `src/components/<domain>/`
- ✅ Screen-specific → `src/screens/<ScreenName>/components/`

### 2.5 Component Hierarchy

```
Screen (src/screens/)
  └─ Layout Components (src/components/<domain>/)
       └─ UI Primitives (src/components/ui/)
```

**Example:**

```
ScannerScreen
  └─ ScannerControls
       ├─ Button (ui)
       └─ Typography (ui)
```

### 2.6 Component Responsibilities

| Layer                 | Responsibility                     | Example           |
| --------------------- | ---------------------------------- | ----------------- |
| **Screen (.tsx)**     | ONLY rendering, hook destructuring | `MyScreen.tsx`    |
| **Screen Hook (.ts)** | ALL logic, state, functions        | `useMyScreen.ts`  |
| **Layout**            | Composition, domain logic          | `ScannerControls` |
| **UI**                | Rendering, user interaction        | `Button`, `Input` |

---

## 3. File Structure & Naming

### 3.1 File Naming

```
✅ PascalCase.tsx          # Component files
✅ PascalCase.ts           # Hook files
✅ index.ts                # Barrel exports
✅ camelCase.ts            # Utility files

❌ button.tsx              # Lowercase
❌ button_component.tsx    # Snake case
❌ ButtonComponent.tsx     # Redundant suffix
```

### 3.2 Single Component Per File

**Each file exports ONE component:**

```typescript
// ✅ CORRECT
export function Button({ ... }: ButtonProps) { ... }

// ❌ WRONG - Multiple components
export function Button() { ... }
export function ButtonGroup() { ... }
```

### 3.3 Barrel Exports

**All UI components MUST be exported from `src/components/ui/index.ts`:**

```typescript
// src/components/ui/index.ts
export { Button } from "./Button";
export { Card } from "./Card";
export { Input } from "./Input";
export { Typography } from "./Typography";
export { Badge } from "./Badge";
// ... add new components here
```

**Consumers import from barrel:**

```typescript
// ✅ CORRECT
import { Button, Card, Input } from "@components/ui";

// ❌ WRONG - Direct imports
import Button from "@components/ui/Button";
```

### 3.4 Multi-File Components

**Use subdirectory with index barrel:**

```
src/components/ui/DatePicker/
├── index.tsx              # Barrel + default export
├── DatePickerContent.tsx
├── DatePickerDay.tsx
├── DatePickerGrid.tsx
└── DatePickerModal.tsx
```

```typescript
// DatePicker/index.tsx
export { DatePickerModal as default } from "./DatePickerModal";
export { DatePickerContent } from "./DatePickerContent";
export { DatePickerDay } from "./DatePickerDay";
```

---

## 4. TypeScript Patterns

### 4.1 Props Interface

**ALWAYS define explicit props interface:**

```typescript
// ✅ CORRECT
interface ButtonProps {
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  className?: string;
  children: React.ReactNode;
}

export function Button({ ... }: ButtonProps) { ... }

// ❌ WRONG - Inline props
export function Button({ onPress, variant = "primary" }: {
  onPress: () => void;
  variant?: string;
}) { ... }
```

### 4.2 Props Interface Naming

```typescript
interface {ComponentName}Props { ... }

// Examples:
interface ButtonProps { ... }
interface CardProps { ... }
interface InputProps { ... }
```

### 4.3 Required vs Optional Props

```typescript
interface ComponentProps {
  // REQUIRED - No default, consumer MUST provide
  onPress: () => void;
  value: string;
  children: React.ReactNode;

  // OPTIONAL - Has sensible default
  variant?: "primary" | "secondary"; // defaults to "primary"
  disabled?: boolean; // defaults to false
  size?: "sm" | "md" | "lg"; // defaults to "md"
}
```

### 4.4 Type Variants with Records

```typescript
// ✅ CORRECT - Type-safe variant system
type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variantConfig: Record<
  ButtonVariant,
  {
    containerClass: string;
    textColor: string;
  }
> = {
  primary: { containerClass: "bg-primary", textColor: colors.white },
  secondary: { containerClass: "bg-primary-light", textColor: colors.primary },
  ghost: { containerClass: "bg-transparent", textColor: colors.textPrimary },
  danger: { containerClass: "bg-red-100", textColor: colors.error }
};

// ❌ WRONG - Switch statements
const getVariantStyle = (variant: string) => {
  switch (variant) {
    case "primary":
      return { bg: "bg-primary" };
    case "secondary":
      return { bg: "bg-primary-light" };
    // ...
  }
};
```

### 4.5 Import Order

```typescript
// 1. React & React Native
import { useState } from "react";
import { View, TouchableOpacity } from "react-native";

// 2. Third-party libraries
import { ActivityIndicator } from "react-native";
import Animated from "react-native-reanimated";

// 3. Internal imports (aliased)
import { Typography } from "@components/ui";
import { colors, spacing } from "@constants/theme";

// 4. Local types
import type { ButtonProps } from "./types";
```

---

## 5. Styling Rules

### 5.1 Primary: NativeWind (className)

**Use `className` for 90% of styling:**

```typescript
// ✅ CORRECT
<View className="flex-row items-center justify-between bg-white rounded-lg p-4">
  <Typography variant="body">Label</Typography>
</View>
```

### 5.2 When to Use StyleSheet

**ONLY use `StyleSheet.create` for:**

1. **Absolute positioning:**

```typescript
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject
  }
});
```

2. **Dynamic values from props:**

```typescript
const styles = StyleSheet.create({
  container: {
    height: props.customHeight
  }
});
```

3. **Complex animations:**

```typescript
const styles = StyleSheet.create({
  animatedBox: {
    transform: [{ translateY: translateY.value }]
  }
});
```

### 5.3 When to Use Inline Style

**ONLY use inline `style` prop for:**

1. **Theme token injection:**

```typescript
<View style={{ backgroundColor: colors.primary }}>
```

2. **Dynamic runtime values:**

```typescript
<Text style={{ color: isActive ? colors.primary : colors.textSecondary }}>
```

3. **Escape hatch for NativeWind limitations:**

```typescript
<View style={{ zIndex: 10 }}>  {/* NativeWind doesn't support z-index well */}
```

### 5.4 Combining Styles

```typescript
// ✅ CORRECT - Order: StyleSheet, then inline overrides
<View
  className="flex-1 rounded-lg p-4"
  style={[styles.container, { backgroundColor: customColor }]}
>

// ❌ WRONG - Conflicting styles
<View
  className="bg-white"
  style={{ backgroundColor: colors.primary }}  // Conflicts!
>
```

### 5.5 NativeWind Class Order

**Follow this order for readability:**

```
Layout → Spacing → Sizing → Typography → Colors → Effects
```

**Example:**

```typescript
className =
  "flex-row items-center justify-between gap-2 px-4 py-3 h-12 text-base font-medium text-primary bg-white rounded-lg shadow";
```

---

## 6. Props API Design

### 6.1 Sensible Defaults

**ALWAYS provide defaults for optional props:**

```typescript
export function Button({
  variant = "primary", // ✅ Default provided
  size = "md", // ✅ Default provided
  disabled = false, // ✅ Default provided
  loading = false, // ✅ Default provided
  fullWidth = false, // ✅ Default provided
  onPress,
  style,
  children
}: ButtonProps) {
  // ...
}
```

### 6.2 Destructuring Order

```typescript
export function Component({
  // 1. Required props
  onPress,
  value,

  // 2. Optional props with defaults
  variant = "primary",
  size = "md",
  disabled = false,

  // 3. Style props
  style,
  className,

  // 4. Children
  children
}: ComponentProps) {
  // ...
}
```

### 6.3 Style Props Pattern

**Support both `className` and `style`:**

```typescript
interface Props {
  className?: string;    // NativeWind classes
  style?: ViewStyle;     // RN style object (escape hatch)
}

// Usage:
<View className={cn("base-classes", className)} style={style}>
```

### 6.4 Children Placement

**ALWAYS place `children` last in destructuring:**

```typescript
export function Card({
  className,
  style,
  shadow = "md",
  children                    // ✅ Last
}: CardProps) {
  return <View className={...}>{children}</View>;
}
```

### 6.5 Callback Props

**Use `on<EventName}` naming:**

```typescript
interface Props {
  onPress: () => void;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmit?: (data: FormData) => void;
}
```

---

## 7. Variant Implementation

### 7.1 Variant Lookup Tables

**ALWAYS use Record lookup tables for variants:**

```typescript
// ✅ CORRECT - Lookup table
type Variant = "sm" | "md" | "lg";

const sizeConfig: Record<Variant, {
  height: number;
  fontSize: number;
  paddingClass: string;
}> = {
  sm: { height: 36, fontSize: 13, paddingClass: "px-3" },
  md: { height: 44, fontSize: 15, paddingClass: "px-4" },
  lg: { height: 52, fontSize: 17, paddingClass: "px-6" }
};

// Usage:
const config = sizeConfig[size];
<View style={{ height: config.height }}>
```

### 7.2 Combining Multiple Variants

```typescript
export function Badge({
  variant = "default",
  size = "md",
  label
}: BadgeProps) {
  const variantClasses = {
    default: "bg-surface-secondary",
    success: "bg-green-100",
    warning: "bg-yellow-100",
    error: "bg-red-100"
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  const classes = cn(
    "rounded-full",
    variantClasses[variant],
    sizeClasses[size]
  );

  return <View className={classes}><Text>{label}</Text></View>;
}
```

### 7.3 Dynamic Variant Styles

**When variants need both className AND inline styles:**

```typescript
const variantConfig: Record<ButtonVariant, {
  classes: string;
  styles: ViewStyle;
}> = {
  primary: {
    classes: "bg-primary",
    styles: { backgroundColor: colors.primary }
  },
  ghost: {
    classes: "bg-transparent",
    styles: { backgroundColor: "transparent" }
  }
};

const config = variantConfig[variant];
<View className={cn("base", config.classes)} style={config.styles}>
```

---

## 8. Component Templates

### 8.1 Basic UI Component Template

```typescript
import { TouchableOpacity, type TouchableOpacityProps } from "react-native";
import { Typography } from "@components/ui";
import { colors, spacing } from "@constants/theme";

interface MyComponentProps {
  onPress: () => void;
  label: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  className?: string;
  style?: TouchableOpacityProps["style"];
}

export function MyComponent({
  onPress,
  label,
  variant = "primary",
  disabled = false,
  className,
  style
}: MyComponentProps) {
  const variantClasses = {
    primary: "bg-primary",
    secondary: "bg-primary-light"
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={cn(
        "flex-row items-center justify-center rounded-lg px-4 py-3",
        variantClasses[variant],
        disabled && "opacity-50",
        className
      )}
      style={style}
      activeOpacity={0.7}
    >
      <Typography
        variant="body"
        weight="medium"
        color={variant === "primary" ? colors.white : colors.primary}
      >
        {label}
      </Typography>
    </TouchableOpacity>
  );
}
```

### 8.2 Container Component Template

```typescript
import { View, type ViewProps } from "react-native";
import { cn } from "@utils/cn";  // If you have a class merge utility

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewProps["style"];
  padding?: keyof typeof spacing;
}

export function Container({
  children,
  className,
  style,
  padding = 4
}: ContainerProps) {
  return (
    <View
      className={cn("flex-1 bg-background", `p-${padding}`, className)}
      style={style}
    >
      {children}
    </View>
  );
}
```

### 8.3 Modal/Dialog Component Template

```typescript
import { useEffect } from "react";
import { Modal, View, TouchableOpacity } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Typography, Button } from "@components/ui";
import { colors, spacing } from "@constants/theme";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function MyModal({
  visible,
  onClose,
  title,
  children
}: ModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 items-center justify-center">
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          className="bg-white rounded-xl mx-6 p-6 max-h-[80%]"
        >
          <Typography variant="h3" weight="bold" style={{ marginBottom: spacing[4] }}>
            {title}
          </Typography>

          <View className="flex-1">{children}</View>

          <Button onPress={onClose} className="mt-4">
            Close
          </Button>
        </Animated.View>
      </View>
    </Modal>
  );
}
```

---

## 9. Common Patterns

### 9.1 Loading State

```typescript
interface ButtonProps {
  loading?: boolean;
  // ...
}

export function Button({ loading = false, ... }: ButtonProps) {
  return (
    <TouchableOpacity disabled={loading}>
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Typography>Label</Typography>
      )}
    </TouchableOpacity>
  );
}
```

### 9.2 Disabled State

```typescript
// Always combine disabled with opacity
<TouchableOpacity
  disabled={disabled}
  className={cn(disabled && "opacity-50")}
>
```

### 9.3 Error State

```typescript
interface InputProps {
  error?: string;
  // ...
}

export function Input({ error, ... }: InputProps) {
  return (
    <View>
      <TextInput
        className={cn(
          "border rounded-lg px-4 py-3",
          error ? "border-error" : "border-border"
        )}
      />
      {error && (
        <Typography variant="caption" color={colors.error} className="mt-1">
          {error}
        </Typography>
      )}
    </View>
  );
}
```

### 9.4 Focus State

```typescript
export function Input({ ... }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <TextInput
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={cn(
        "border rounded-lg px-4 py-3",
        focused ? "border-primary" : "border-border"
      )}
    />
  );
}
```

### 9.5 Icon + Label Pattern

```typescript
<View className="flex-row items-center gap-2">
  <IconComponent size={20} color={colors.primary} />
  <Typography variant="body" weight="medium">
    Label Text
  </Typography>
</View>
```

### 9.6 List Item Pattern

```typescript
<TouchableOpacity className="flex-row items-center bg-white px-4 py-3 border-b border-border">
  <View className="mr-3">{icon}</View>
  <View className="flex-1">
    <Typography variant="body" weight="medium">{label}</Typography>
    {description && (
      <Typography variant="caption" color={colors.textSecondary}>
        {description}
      </Typography>
    )}
  </View>
  <ChevronRight size={20} color={colors.textSecondary} />
</TouchableOpacity>
```

---

## 10. Anti-Patterns (What NOT to Do)

### ❌ 1. Logic in `.tsx` Files (CRITICAL VIOLATION)

**This is the MOST COMMON mistake. NEVER put logic in `.tsx` files.**

```typescript
// ❌ WRONG - Data initialization in .tsx
export default function ThemeScreen() {
  const { t, currentTheme, handleThemeSelect } = useThemeScreen();

  // ❌ VIOLATION - This is data initialization, belongs in hook!
  const themes = [
    { id: "light", label: t("settings.light"), icon: <Sun size={20} color={colors.primary} /> },
    { id: "dark", label: t("settings.dark"), icon: <Moon size={20} color={colors.primary} /> }
  ];

  return <View>{themes.map(...)}</View>;
}

// ✅ CORRECT - Data in hook
// useThemeScreen.ts
export function useThemeScreen() {
  const { t } = useTranslation();

  const themes = useMemo(() => [
    { id: "light", label: t("settings.light"), icon: "sun" },
    { id: "dark", label: t("settings.dark"), icon: "moon" }
  ], [t]);

  return { themes, currentTheme, handleThemeSelect };
}

// ThemeScreen.tsx
export default function ThemeScreen() {
  const { themes, currentTheme, handleThemeSelect } = useThemeScreen();

  return <View>{themes.map(...)}</View>;  // ONLY JSX
}
```

```typescript
// ❌ WRONG - Function declaration in .tsx
export default function MyScreen() {
  const { data } = useMyScreen();

  // ❌ VIOLATION - Function belongs in hook!
  const handlePress = (id: string) => {
    console.log("Pressed:", id);
  };

  return <Button onPress={handlePress} />;
}

// ✅ CORRECT
// useMyScreen.ts
export function useMyScreen() {
  const handlePress = useCallback((id: string) => {
    console.log("Pressed:", id);
  }, []);

  return { data, handlePress };
}

// MyScreen.tsx
export default function MyScreen() {
  const { data, handlePress } = useMyScreen();
  return <Button onPress={handlePress} />;  // ONLY JSX
}
```

```typescript
// ❌ WRONG - State/effect in .tsx
export default function MyScreen() {
  // ❌ VIOLATION - State belongs in hook!
  const [count, setCount] = useState(0);

  // ❌ VIOLATION - Effect belongs in hook!
  useEffect(() => {
    fetchData();
  }, []);

  return <Text>{count}</Text>;
}

// ✅ CORRECT
// useMyScreen.ts
export function useMyScreen() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  return { count };
}

// MyScreen.tsx
export default function MyScreen() {
  const { count } = useMyScreen();
  return <Text>{count}</Text>;  // ONLY JSX
}
```

### ❌ 2. Hardcoded Colors

```typescript
// ❌ WRONG
<View style={{ backgroundColor: "#4CAF82" }}>

// ✅ CORRECT
<View style={{ backgroundColor: colors.primary }}>
```

### ❌ 2. Magic Numbers

```typescript
// ❌ WRONG
<View style={{ padding: 17, marginTop: 23 }}>

// ✅ CORRECT
<View style={{ padding: spacing[4], marginTop: spacing[5] }}>
```

### ❌ 3. Inline Switch Statements

```typescript
// ❌ WRONG
const getColor = (variant: string) => {
  switch (variant) {
    case "primary":
      return "#4CAF82";
    case "secondary":
      return "#E8F5EE";
    // ...
  }
};

// ✅ CORRECT
const variantConfig: Record<Variant, { color: string }> = {
  primary: { color: colors.primary },
  secondary: { color: colors.primaryLight }
};
```

### ❌ 4. Multiple Components Per File

```typescript
// ❌ WRONG
export function Button() { ... }
export function ButtonGroup() { ... }
export function ButtonContainer() { ... }

// ✅ CORRECT - One component per file
export function Button() { ... }
```

### ❌ 5. Direct Deep Imports

```typescript
// ❌ WRONG
import Button from "../../../components/ui/Button";

// ✅ CORRECT
import { Button } from "@components/ui";
```

### ❌ 6. Missing Props Interface

```typescript
// ❌ WRONG
export function Card({ children, className }: any) { ... }

// ✅ CORRECT
interface CardProps {
  children: React.ReactNode;
  className?: string;
}
export function Card({ children, className }: CardProps) { ... }
```

### ❌ 7. Mixing StyleSheet and NativeWind Conflictingly

```typescript
// ❌ WRONG - Conflicting
<View className="bg-white" style={{ backgroundColor: "red" }}>

// ✅ CORRECT - Complementary
<View className="flex-1 rounded-lg" style={{ backgroundColor: colors.primary }}>
```

### ❌ 8. Not Providing Defaults

```typescript
// ❌ WRONG
export function Button({ variant, size = "md" }: ButtonProps) {
  // variant is undefined if not provided!
}

// ✅ CORRECT
export function Button({ variant = "primary", size = "md" }: ButtonProps) {
  // Both have sensible defaults
}
```

### ❌ 9. Using StyleSheet for Static Styles

```typescript
// ❌ WRONG - Static styles should use NativeWind
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16
  }
});
<View style={styles.container}>

// ✅ CORRECT - Use NativeWind
<View className="flex-row items-center p-4">
```

### ❌ 10. Forgetting Barrel Export

```typescript
// ❌ WRONG - Component not exported from barrel
// src/components/ui/NewComponent.tsx exists but...
// src/components/ui/index.ts doesn't export it

// ✅ CORRECT - Add to barrel
// src/components/ui/index.ts
export { NewComponent } from "./NewComponent";
```

---

## 11. Testing Checklist

Before committing a new UI component, verify:

### STRICT Separation (CRITICAL)

- [ ] `.tsx` file contains ONLY JSX rendering
- [ ] `.tsx` file has NO function declarations
- [ ] `.tsx` file has NO variable initialization (except hook destructuring)
- [ ] `.tsx` file has NO `useState`, `useEffect`, `useMemo`, `useCallback`
- [ ] `.tsx` file has NO data transformations or calculations
- [ ] `.ts` hook contains ALL logic, functions, state, and data
- [ ] All data arrays are initialized in hook with `useMemo`
- [ ] All handlers are defined in hook with `useCallback`
- [ ] All effects are defined in hook with `useEffect`

### Code Quality

- [ ] Component has explicit props interface
- [ ] All optional props have sensible defaults
- [ ] Variants use Record lookup tables (not switch/if)
- [ ] No hardcoded colors or magic numbers
- [ ] Uses design tokens from `@constants/theme`
- [ ] Follows file naming conventions (PascalCase.tsx)
- [ ] Exported from barrel (`src/components/ui/index.ts`)

### Styling

- [ ] 90%+ styling uses NativeWind (`className`)
- [ ] `StyleSheet` only used for absolute/dynamic/animation cases
- [ ] Inline `style` only used for theme tokens or dynamic values
- [ ] No conflicting className + style properties
- [ ] Responsive layout tested (different screen sizes)

### Accessibility

- [ ] Touch targets minimum 44x44 (use `heights.buttonMd`)
- [ ] Disabled state has visual feedback (opacity)
- [ ] Loading state provided (if applicable)
- [ ] Error state handled gracefully
- [ ] Text contrast meets WCAG AA (4.5:1 ratio)

### TypeScript

- [ ] No `any` types used
- [ ] Props interface explicitly typed
- [ ] Variant types are union types (not strings)
- [ ] `tsc --noEmit` passes with no errors

### Documentation

- [ ] Component added to barrel export
- [ ] Props interface self-documenting (clear names)
- [ ] Complex variants documented with JSDoc (if needed)

### Integration

- [ ] Component works with NativeWind
- [ ] Component respects theme tokens
- [ ] Can be customized via `className` and `style` props
- [ ] No hardcoded text (use i18n if user-facing)

---

## Quick Reference

### Screen Creation Checklist

```
1. Create hook: src/screens/ScreenName/useScreenName.ts
   - All state (useState)
   - All functions (useCallback)
   - All data initialization (useMemo)
   - All effects (useEffect)
   - All calculations/transformations
   - Return: { data, handlers, state }

2. Create screen: src/screens/ScreenName/ScreenName.tsx
   - ONLY import hook
   - ONLY destructure hook return
   - ONLY return JSX

3. Create route: app/(group)/screen-name.tsx
   - ONLY: export { default } from "@screens/ScreenName/ScreenName"

4. Export from barrel (if UI component)
5. Run: pnpm typecheck && pnpm lint
6. Test on different screen sizes
```

### `.tsx` File Template

```typescript
// ScreenName.tsx - ONLY JSX
import { View, ScrollView } from "react-native";
import { Typography, Button } from "@components/ui";
import { useScreenName } from "./useScreenName";

export default function ScreenName() {
  // ONLY hook destructuring
  const { data, isLoading, handlers } = useScreenName();

  // ONLY JSX return
  return (
    <View className="flex-1 bg-background">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ScrollView>
          {data.map((item) => (
            <Item key={item.id} {...item} onPress={handlers.handlePress} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
```

### `.ts` Hook Template

```typescript
// useScreenName.ts - ALL logic
import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

export function useScreenName() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Item[]>([]);

  // Data initialization
  const items = useMemo(
    () => [
      { id: 1, label: "Item 1" },
      { id: 2, label: "Item 2" }
    ],
    []
  );

  // Functions
  const handlePress = useCallback(
    (id: number) => {
      navigation.navigate("detail", { id });
    },
    [navigation]
  );

  // Effects
  useEffect(() => {
    fetchData();
  }, []);

  return {
    data: items,
    isLoading,
    handlePress
  };
}
```

### Import Template

```typescript
// 1. React & RN
import { useState } from "react";
import { View, TouchableOpacity } from "react-native";

// 2. Third-party
import Animated from "react-native-reanimated";

// 3. Internal (aliased)
import { Typography } from "@components/ui";
import { colors, spacing, borderRadius } from "@constants/theme";

// 4. Types
import type { ComponentProps } from "./types";
```

---

## Need Help?

- **Design tokens:** Check `src/constants/theme.ts`
- **Existing components:** Browse `src/components/ui/`
- **Color palette:** See Section 1.3
- **Typography scale:** See Section 1.4
- **Spacing guide:** See Section 1.5

---

**Last Updated:** April 4, 2026  
**Maintained By:** Senior React Native Developer  
**Version:** 1.0
