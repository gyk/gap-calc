import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import { VitePWA } from "vite-plugin-pwa";
import tsConfigPaths from "vite-tsconfig-paths";

const webOnlyExtensions = [".web.js", ".web.jsx", ".web.ts", ".web.tsx"];

export default defineConfig(() => {
  const isGithubPages = process.env.GITHUB_PAGES === "1";
  const base = isGithubPages ? "/gap-calc/" : "/";

  return {
    base,
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
      VitePWA({
        registerType: "prompt",
        includeAssets: ["icon.svg"],
        devOptions: {
          enabled: true,
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          navigateFallback: "index.html",
        },
        manifest: {
          name: "GAP Calculator",
          short_name: "GAP Calc",
          description: "Grade Adjusted Pace Calculator",
          theme_color: "#007bff",
          background_color: "#ffffff",
          display: "standalone",
          start_url: base,
          scope: base,
          icons: [
            {
              src: "icon.svg",
              sizes: "192x192 512x512",
              type: "image/svg+xml",
              purpose: "any maskable",
            },
          ],
        },
      }),
    ],
    test: {
      globals: true,
      environment: "jsdom",
    },
  };
});
