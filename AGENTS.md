# gap-calc

This project aims to reimplement _grade-adjusted pace calculator_ from Running Writings Apps in modern tech stack:

- TypeScript (and Zod if needed)
- React and React Strict DOM
- Vite for bundling, Vitest for testing
- Zustand, Immer, etc., if needed
- Tailwind CSS for styling
- pnpm for package management
- Biome for linting and formatting

## Lastest versions of dependencies that can work together, for reference:

```json
"@types/node": "^24.10.1",
"@types/react-dom": "^19.2.3",
"@types/react": "^19.2.5",
"@vitejs/plugin-react": "^5.1.1",
"immer": "^11.1.0",
"react-dom": "^19.2.3",
"react-strict-dom": "0.0.54",
"react": "^19.2.3",
"typescript": "~5.9.3",
"vite-plugin-babel": "^1.3.2",
"vite": "^7.2.4",
"zod": "^4.2.1",
"zustand": "^5.0.9",
```

## Steps to Reimplement gap-app

- Extract self-contained UI components, e.g.,
    ```jsx
    // You would write this once and use it for minutes, seconds, etc.
    function DigitDial({ value, onIncrement, onDecrement }) {
      return (
        <div className="digitbox">
        <button onClick={onIncrement}>expand_less</button>
        <div className="digit">{value}</div>
        <button onClick={onDecrement}>expand_more</button>
        </div>
      );
    }
    ```
- Adapt to the new approach of state management, e.g.,
    ```tsx
    const [hillMode, setHillMode] = useState("grade");
    const [pctInt, setPctInt] = useState(5);
    // The UI updates automatically when you call setPctInt(6)
    ```

## Notes

- The files inside `./gap-app` are the original source code of gap-app. Do not modify them.
- The files inside `./react-strict-dom-vite-app` are React Strict DOM's Vite app example code. Use
  them as a reference, and do not modify them.
- Currently there are some basic type definitions in `./src/types`. Feel free to modify them.
- Use vanilla React instead of UI component libraries, as React Strict DOM currently has none.
- Please use types following good TypeScript practices.
- Add scripts in `package.json` for building, testing, linting, and running the app.
- Write clean, readable, and maintainable code.
