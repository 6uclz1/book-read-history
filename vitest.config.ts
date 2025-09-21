import { defineConfig } from "vitest/config";
import path from "node:path";

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
      lines: 100,
      functions: 100,
      statements: 100,
      branches: 100,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
