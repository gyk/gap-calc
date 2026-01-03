# Project Plan: gap-calc Reimplementation

## Phase 1: Project Initialization and Setup
- [x] Initialize the project structure using Vite, React, and React Strict DOM.
- [x] Configure Tailwind CSS and Biome for styling and linting.
- [x] Set up `pnpm` as the package manager.
- [x] Define scripts in `package.json` for building, testing, and linting.

## Phase 2: Core Logic Porting
- [x] Port `black_gam.js` to TypeScript (`src/logic/blackGam.ts`).
- [x] Port `gap_logic.js` to TypeScript (`src/logic/gapLogic.ts`).
- [x] Ensure all mathematical functions are correctly typed and tested.

## Phase 3: State Management
- [x] Implement a Zustand store (`src/store/useGapStore.ts`) to manage:
    - Input modes (pace vs. speed, grade vs. angle, etc.).
    - Input values (minutes, seconds, grade percentage, etc.).
    - Units (mi, km, mph, km/h, etc.).
    - Calculation results.

## Phase 4: UI Component Development
- [x] Create `DigitDial` component for numeric inputs with increment/decrement buttons.
- [x] Create `UnitSelector` component for switching between different units.
- [x] Create `ModeSwitcher` for toggling between calculation and hill modes.
- [x] Create `InclineInput` for handling various hill input methods.
- [x] Create `OutputDisplay` to show the calculated GAP or equivalent effort.

## Phase 5: Application Assembly and Integration
- [x] Build the main `App.tsx` layout.
- [x] Integrate UI components with the Zustand store.
- [x] Connect the GAP logic to the state updates for real-time calculations.

## Phase 6: Styling and Polish
- [x] Apply modern, responsive styling using Tailwind CSS and React Strict DOM.
- [x] Ensure accessibility and a clean user interface.

## Phase 7: Testing and Validation
- [x] Port existing tests from `gap-app/tests.mjs` to Vitest.
- [x] Add unit tests for new components and state management logic.

## Phase 8: Final Review
- [x] Run Biome for linting and formatting.
- [x] Perform a final walkthrough of the application to ensure all features are implemented correctly.
