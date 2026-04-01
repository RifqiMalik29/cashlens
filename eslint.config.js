const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const simpleImportSort = require("eslint-plugin-simple-import-sort");
const prettierConfig = require("eslint-config-prettier");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*", "node_modules/*", ".expo/*"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }],
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/consistent-type-imports": ["error", {
        prefer: "type-imports",
        fixStyle: "inline-type-imports"
      }],
      "no-console": "warn",
      "max-lines": ["error", {
        max: 200,
        skipBlankLines: true,
        skipComments: true
      }],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "import/no-unresolved": "off"
    }
  },
  prettierConfig
]);
