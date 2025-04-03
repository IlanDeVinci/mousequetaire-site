import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    // Only ignore node_modules and other common ignored directories
    // but allow linting of project files
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "public/**",
      "**/*.d.ts",
      "**/*.config.js",
      "**/*.config.mjs",
    ],
  },
];

export default eslintConfig;
