# Fix: Standardize Path Aliases & Auto-Imports

## Role

Senior React Native / TypeScript Developer

## Issue

1.  **Alias Conflict:** The `@/*` catch-all alias in `tsconfig.json` is overriding more specific aliases (like `@components/*`), causing VS Code to struggle with resolving the correct path alias for auto-imports.
2.  **Relative Path Preference:** The `.vscode/settings.json` is configured to prefer relative imports, leading to `../../ui/Typography` instead of `@components/ui/Typography`.

## Goal

Standardize the alias configuration and editor settings to ensure auto-imports always use the most specific alias available.

## Instructions

1.  **Refactor TSConfig Aliases:**
    - Open `tsconfig.json`.
    - **Remove** or **Comment out** the catch-all `@/*`: `["./src/*"]` alias.
    - This ensures that when an import matches `@components/*`, TypeScript uses that specific mapping instead of falling back to the generic `@/*` mapping (which would result in `@/components/...`).

2.  **Update VS Code Settings:**
    - Open `.vscode/settings.json`.
    - Change `"typescript.preferences.importModuleSpecifier"` from `"relative"` to `"non-relative"`.
    - Set `"typescript.preferences.importModuleSpecifierEnding"` to `"minimal"` to ensure clean imports.

3.  **Sync Babel Configuration:**
    - Ensure `babel.config.js` matches the `tsconfig.json` changes.
    - Remove the `@` alias if you removed it from `tsconfig.json` to maintain consistency across the build pipeline.

4.  **Bulk Fix Imports (Surgical):**
    - Search for all instances of `@/components/`, `@/hooks/`, etc., and replace them with `@components/`, `@hooks/`.
    - Ensure no imports are left using the `@/` prefix for folders that have their own dedicated alias.

## Expected Output

- `tsconfig.json` and `babel.config.js` are clean and synchronized.
- `.vscode/settings.json` correctly prioritizes non-relative alias imports.
- Auto-imports in the editor suggest `@components/` correctly.

## Step-by-Step Testing

1.  **Component Test:** Open a screen and try to auto-import `Typography` or `Button`. Confirm the suggestion is `@components/ui/...`.
2.  **Type Check:** Run `tsc --noEmit` to verify all paths resolve correctly.
3.  **Clean Cache:** Run `npx expo start --clear` to ensure the Babel changes are picked up by the packager.
