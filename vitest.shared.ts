import { defineConfig } from "vitest/config";

/**
 * Vitest config shared by every package, each `packages/<name>/vitest.config.ts`
 * re-exports it (or merges overrides into it) so the packages are tested in
 * isolation by `turbo run test`.
 */
export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**"],
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      reporter: ["text-summary", "json-summary", "lcov"],
      include: ["**/*.{ts,tsx}"],
      exclude: [
        "**/*.{test,spec}.{ts,tsx}",
        "**/*.d.ts",
        "**/*.config.ts",
        "**/dist/**",
        "**/index.ts",
      ],
    },
  },
});
