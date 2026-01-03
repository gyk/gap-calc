import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import tsConfigPaths from "vite-tsconfig-paths";

const webOnlyExtensions = [".web.js", ".web.jsx", ".web.ts", ".web.tsx"];

export default defineConfig(() => ({
  resolve: {
    extensions: [
      ...webOnlyExtensions,
      ".mjs",
      ".js",
      ".mts",
      ".ts",
      ".jsx",
      ".tsx",
      ".json",
    ],
  },
  plugins: [
    tsConfigPaths(),
    react({
      babel: {
        configFile: true,
      },
    }),
    babel(),
  ],
  test: {
    globals: true,
    environment: "jsdom",
  },
}));
