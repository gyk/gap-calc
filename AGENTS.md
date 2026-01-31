# gap-calc

This project aims to reimplement _grade-adjusted pace calculator_ from Running Writings Apps in modern tech stack:

- TypeScript (and Zod if needed)
- React and React Strict DOM
- Vite for bundling, Vitest for testing
- Zustand, Immer for state management
- pnpm for package management
- Biome for linting and formatting

## Notes for tools

- We use `pnpm`, not `npm`.
- Use ripgrep (`rg`) when you need to search text.
- If you have edited a lot of code, please run `pnpm format` to keep code style consistent.

## Notes

- The files inside `./gap-app` are the original source code of gap-app. Do not modify them.
- The files inside `./react-strict-dom-vite-app` are React Strict DOM's Vite app example code. Use
  them as a reference, and do not modify them.
- Use vanilla React instead of UI component libraries, as React Strict DOM currently has none.
- Please use types following good TypeScript practices.
- Use scripts in `package.json` for building, testing, linting, and running the app.
- Write clean, readable, and maintainable code.
