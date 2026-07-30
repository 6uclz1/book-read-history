import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: [
      "tests/**/*.test.{js,ts,tsx}",
      "tests/**/*.spec.{js,ts,tsx}",
      "src/**/*.{test,spec}.{js,ts,tsx}",
    ],
    exclude: ["tests/e2e/**"],
    coverage: {
      reporter: ["text", "html", "json", "json-summary"],
      provider: "v8",
      reportsDirectory: "coverage",
      include: ["src/utils/**/*.ts"],
      all: true,
      // 閾値は coverage.thresholds に置かないと読まれない。
      // 直下に書いていた間は 100% 未満でも CI が緑になっていた。
      thresholds: {
        lines: 100,
        functions: 100,
        statements: 100,
        branches: 100,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
