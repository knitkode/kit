import { defineConfig, mergeConfig } from "vitest/config";
import shared from "../../vitest.shared";

export default mergeConfig(
  shared,
  defineConfig({
    test: {
      environment: "node",
      coverage: {
        // CI fails below these: raise them as coverage grows (CONTRIBUTING.md)
        thresholds: {
          statements: 95,
          branches: 92,
          functions: 99,
          lines: 95,
        },
      },
    },
  }),
);
