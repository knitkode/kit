import { defineWorkspace } from "vitest/config";

export default defineWorkspace(["**/*/vite.config.{ts,mts}", "**/*/vitest.config.{ts,mts}", {
  extends: "./vite.base.config.ts",
  // test: {
  // },
}]);
