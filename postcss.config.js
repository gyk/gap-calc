export default {
  plugins: {
    "postcss-react-strict-dom": {
      include: ["./src/**/*.{js,jsx,ts,tsx}"],
      babelConfig: {
        parserOpts: {
          plugins: ["typescript", "jsx"],
        },
        presets: [
          [
            "react-strict-dom/babel-preset",
            {
              rootDir: process.cwd(),
              platform: "web",
            },
          ],
        ],
      },
    },
    tailwindcss: {},
    autoprefixer: {},
  },
};
