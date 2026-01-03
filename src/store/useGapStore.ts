import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
  CalcMode,
  GapState,
  HillDirection,
  HillInputMode,
  PaceUnit,
  RiseUnit,
  RunUnit,
  SpeedMode,
  UnitSystem,
  VertSpeedUnit,
} from "../types/gap";

interface GapActions {
  setUnitSystem: (system: UnitSystem) => void;
  setSpeedMode: (mode: SpeedMode) => void;
  setPaceInput: (minutes: number, tens: number, ones: number) => void;
  setSpeedInput: (whole: number, decimal: number) => void;
  setInputUnit: (unit: PaceUnit) => void;
  setCalcMode: (mode: CalcMode) => void;
  setHillDirection: (direction: HillDirection) => void;
  setHillInputMode: (mode: HillInputMode) => void;
  setGradeInput: (percent: number) => void;
  setAngleInput: (degrees: number) => void;
  setRiseRunInput: (
    rise: number,
    run: number,
    riseUnit: RiseUnit,
    runUnit: RunUnit,
  ) => void;
  setVertSpeedInput: (value: number, unit: VertSpeedUnit) => void;
  setOutputUnit: (unit: PaceUnit) => void;
}

const initialState: GapState = {
  unitSystem: "metric",
  speedMode: "pace",
  paceInput: { minutes: 8, tensSeconds: 0, onesSeconds: 0 },
  speedInput: { whole: 7, decimal: 5 },
  inputUnit: "/km",
  calcMode: "pace",
  hillDirection: "uphill",
  hillInputMode: "grade",
  gradeInput: { percent: 5 },
  angleInput: { degrees: 2.86 },
  riseRunInput: { rise: 264, run: 1, riseUnit: "feet", runUnit: "mi" },
  vertSpeedInput: { value: 1000, unit: "ft/hr" },
  outputUnit: "km/h",
};

export const useGapStore = create<GapState & GapActions>()(
  immer((set) => ({
    ...initialState,

    setUnitSystem: (system) =>
      set((state) => {
        state.unitSystem = system;
        // Update input and output units based on selected system
        if (system === "metric") {
          state.inputUnit = "/km";
          state.outputUnit = "km/h";
          state.riseRunInput.riseUnit = "meters";
          state.riseRunInput.runUnit = "km";
          state.vertSpeedInput.unit = "m/hr";
        } else if (system === "imperial") {
          state.inputUnit = "/mi";
          state.outputUnit = "mph";
          state.riseRunInput.riseUnit = "feet";
          state.riseRunInput.runUnit = "mi";
          state.vertSpeedInput.unit = "ft/hr";
        }
        // For "both", we keep the current units but allow both options
      }),
    setSpeedMode: (mode) =>
      set((state) => {
        state.speedMode = mode;
      }),
    setPaceInput: (minutes, tens, ones) =>
      set((state) => {
        state.paceInput.minutes = minutes;
        state.paceInput.tensSeconds = tens;
        state.paceInput.onesSeconds = ones;
      }),
    setSpeedInput: (whole, decimal) =>
      set((state) => {
        state.speedInput.whole = whole;
        state.speedInput.decimal = decimal;
      }),
    setInputUnit: (unit) =>
      set((state) => {
        state.inputUnit = unit;
      }),
    setCalcMode: (mode) =>
      set((state) => {
        state.calcMode = mode;
      }),
    setHillDirection: (direction) =>
      set((state) => {
        state.hillDirection = direction;
      }),
    setHillInputMode: (mode) =>
      set((state) => {
        state.hillInputMode = mode;
      }),
    setGradeInput: (percent) =>
      set((state) => {
        state.gradeInput.percent = percent;
      }),
    setAngleInput: (degrees) =>
      set((state) => {
        state.angleInput.degrees = degrees;
      }),
    setRiseRunInput: (rise, run, riseUnit, runUnit) =>
      set((state) => {
        state.riseRunInput.rise = rise;
        state.riseRunInput.run = run;
        state.riseRunInput.riseUnit = riseUnit;
        state.riseRunInput.runUnit = runUnit;
      }),
    setVertSpeedInput: (value, unit) =>
      set((state) => {
        state.vertSpeedInput.value = value;
        state.vertSpeedInput.unit = unit;
      }),
    setOutputUnit: (unit) =>
      set((state) => {
        state.outputUnit = unit;
      }),
  })),
);
