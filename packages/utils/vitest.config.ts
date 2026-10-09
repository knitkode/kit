import { defineConfig, mergeConfig } from "vitest/config";
import shared from "../../vitest.shared";

export default mergeConfig(
  shared,
  defineConfig({
    test: {
      coverage: {
        // CI fails below these: raise them as coverage grows (CONTRIBUTING.md)
        thresholds: {
          statements: 98,
          branches: 96,
          functions: 99,
          lines: 98,
        },
      },
    },
  }),
);
