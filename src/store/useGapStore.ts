import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import {
  calculateGradeFromRiseRun,
  convertMSToPace,
  convertMSToSpeed,
  convertPaceToMS,
  convertSpeedToMS,
} from "../logic/gapLogic";
import { DEFAULT_GRADE, DEFAULT_SPEED_KMH } from "../logic/presets";
import { KM_PER_MILE } from "../constants";
import type {
  CalcMode,
  GapState,
  HillDirection,
  HillDirectionUI,
  HillInputMode,
  PaceUnit,
  RiseUnit,
  RunUnit,
  UnitSystem,
  VertSpeedUnit,
} from "../types/gap";

interface GapActions {
  setUnitSystem: (system: UnitSystem) => void;
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
  applyPreset: (inclinePercent: number, speedMph: number) => void;
  toggleSectionCollapse: (section: "settings" | "speed" | "incline") => void;
  reset: () => void;
  getHillDirectionUI: () => HillDirectionUI;
}

const MAX_GRADE = 0.5;

const createInitialState = (): GapState => {
  const INITIAL_SPEED_KMH = DEFAULT_SPEED_KMH;
  const INITIAL_GRADE = DEFAULT_GRADE;
  const INITIAL_UNIT_SYSTEM: UnitSystem = "metric";

  const initialSpeedMS = convertSpeedToMS(INITIAL_SPEED_KMH, "km/h");
  const initialPace = convertMSToPace(initialSpeedMS, "/km");
  const initialAngle = (Math.atan(INITIAL_GRADE) * 180) / Math.PI;

  const initialRun = 1;
  const initialRunUnit: RunUnit = "km";
  const initialRiseUnit: RiseUnit = "meters";
  const runMeters = 1000;
  const initialRise = Math.round(runMeters * INITIAL_GRADE);

  const initialVertSpeedMS =
    initialSpeedMS * Math.sin(Math.atan(INITIAL_GRADE));
  const initialVertSpeedMhr = Math.round(initialVertSpeedMS * 3600);

  return {
    unitSystem: INITIAL_UNIT_SYSTEM,
    paceInput: {
      minutes: initialPace.minutes,
      tensSeconds: Math.floor(initialPace.seconds / 10),
      onesSeconds: initialPace.seconds % 10,
    },
    speedInput: {
      whole: Math.floor(Math.round(INITIAL_SPEED_KMH * 10) / 10),
      decimal: Math.round(INITIAL_SPEED_KMH * 10) % 10,
    },
    inputUnit: "km/h",
    calcMode: "pace",
    hillDirection: "uphill",
    hillInputMode: "grade",
    grade: INITIAL_GRADE,
    gradeInput: { percent: Number((INITIAL_GRADE * 100).toFixed(2)) },
    angleInput: { degrees: Number(initialAngle.toFixed(2)) },
    riseRunInput: {
      rise: initialRise,
      run: initialRun,
      riseUnit: initialRiseUnit,
      runUnit: initialRunUnit,
    },
    vertSpeedInput: { value: initialVertSpeedMhr, unit: "m/hr" },
    outputUnit: "/km",
    collapsedSections: {
      settings: false,
      speed: false,
      incline: false,
    },
  };
};

const initialState: GapState = createInitialState();

const getCurrentSpeedMS = (state: GapState) => {
  if (state.inputUnit === "/km" || state.inputUnit === "/mi") {
    return convertPaceToMS(
      state.paceInput.minutes,
      state.paceInput.tensSeconds * 10 + state.paceInput.onesSeconds,
      state.inputUnit,
    );
  }
  const speed = state.speedInput.whole + state.speedInput.decimal / 10;
  return convertSpeedToMS(speed, state.inputUnit);
};

const syncVertSpeedFromGrade = (state: GapState) => {
  const speedMS = getCurrentSpeedMS(state);
  const vertSpeedMS = speedMS * Math.sin(Math.atan(state.grade));
  state.vertSpeedInput.value =
    state.vertSpeedInput.unit === "m/hr"
      ? Math.round(Math.abs(vertSpeedMS) * 3600)
      : Math.round((Math.abs(vertSpeedMS) * 3600) / 0.3048);
};

const updateHillInputsFromGrade = (state: GapState) => {
  const grade = state.grade;
  state.gradeInput.percent = Number((grade * 100).toFixed(2));
  state.angleInput.degrees = Number(
    ((Math.atan(grade) * 180) / Math.PI).toFixed(2),
  );

  const runMeters =
    state.riseRunInput.runUnit === "mi"
      ? state.riseRunInput.run * 1609.344
      : state.riseRunInput.run * 1000;
  const riseMeters = runMeters * grade;
  state.riseRunInput.rise =
    state.riseRunInput.riseUnit === "feet"
      ? Math.round(riseMeters / 0.3048)
      : Math.round(riseMeters);

  state.hillDirection = grade >= 0 ? "uphill" : "downhill";
  syncVertSpeedFromGrade(state);
};

const convertInputValues = (
  state: any,
  oldUnit: PaceUnit,
  newUnit: PaceUnit,
) => {
  if (oldUnit === newUnit) return;

  // Get current speed in m/s
  let speedMS = 0;
  if (oldUnit === "/km" || oldUnit === "/mi") {
    speedMS = convertPaceToMS(
      state.paceInput.minutes,
      state.paceInput.tensSeconds * 10 + state.paceInput.onesSeconds,
      oldUnit,
    );
  } else {
    const speed = state.speedInput.whole + state.speedInput.decimal / 10;
    speedMS = convertSpeedToMS(speed, oldUnit);
  }

  state.inputUnit = newUnit;

  // Convert m/s to new unit and update inputs
  if (newUnit === "/km" || newUnit === "/mi") {
    const { minutes, seconds } = convertMSToPace(speedMS, newUnit);
    state.paceInput.minutes = minutes;
    state.paceInput.tensSeconds = Math.floor(seconds / 10);
    state.paceInput.onesSeconds = seconds % 10;
  } else {
    const speed = convertMSToSpeed(speedMS, newUnit);
    const totalTenths = Math.round(speed * 10);
    state.speedInput.whole = Math.floor(totalTenths / 10);
    state.speedInput.decimal = totalTenths % 10;
  }
};

export const useGapStore = create<GapState & GapActions>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      setUnitSystem: (system) =>
        set((state) => {
          const oldSystem = state.unitSystem;
          state.unitSystem = system;

          if (system === "metric" && oldSystem !== "metric") {
            // Convert rise/run
            state.riseRunInput.riseUnit = "meters";
            state.riseRunInput.runUnit = "km";
            state.riseRunInput.run = 1;
            state.riseRunInput.rise = Math.round(1000 * state.grade);

            // Convert vert speed
            if (state.vertSpeedInput.unit === "ft/hr") {
              state.vertSpeedInput.value = Math.round(
                state.vertSpeedInput.value * 0.3048,
              );
              state.vertSpeedInput.unit = "m/hr";
            }
            // Update default units if they were imperial
            if (state.inputUnit === "/mi")
              convertInputValues(state, "/mi", "/km");
            else if (state.inputUnit === "mph")
              convertInputValues(state, "mph", "km/h");

            if (state.outputUnit === "/mi") state.outputUnit = "/km";
            else if (state.outputUnit === "mph") state.outputUnit = "km/h";
          } else if (system === "imperial" && oldSystem !== "imperial") {
            // Convert rise/run
            state.riseRunInput.riseUnit = "feet";
            state.riseRunInput.runUnit = "mi";
            state.riseRunInput.run = 1;
            state.riseRunInput.rise = Math.round(5280 * state.grade);

            // Convert vert speed
            if (state.vertSpeedInput.unit === "m/hr") {
              state.vertSpeedInput.value = Math.round(
                state.vertSpeedInput.value / 0.3048,
              );
              state.vertSpeedInput.unit = "ft/hr";
            }
            // Update default units if they were metric
            if (state.inputUnit === "/km")
              convertInputValues(state, "/km", "/mi");
            else if (state.inputUnit === "km/h")
              convertInputValues(state, "km/h", "mph");

            if (state.outputUnit === "/km") state.outputUnit = "/mi";
            else if (state.outputUnit === "km/h") state.outputUnit = "mph";
          }
        }),
      setPaceInput: (minutes, tens, ones) =>
        set((state) => {
          const totalSeconds = minutes * 60 + tens * 10 + ones;
          state.paceInput.minutes = Math.floor(totalSeconds / 60);
          const remainingSeconds = totalSeconds % 60;
          state.paceInput.tensSeconds = Math.floor(remainingSeconds / 10);
          state.paceInput.onesSeconds = remainingSeconds % 10;
          syncVertSpeedFromGrade(state);
        }),
      setSpeedInput: (whole, decimal) =>
        set((state) => {
          const totalTenths = whole * 10 + decimal;
          state.speedInput.whole = Math.floor(totalTenths / 10);
          state.speedInput.decimal = totalTenths % 10;
          syncVertSpeedFromGrade(state);
        }),
      setInputUnit: (unit) =>
        set((state) => {
          convertInputValues(state, state.inputUnit, unit);
          syncVertSpeedFromGrade(state);
        }),
      setCalcMode: (mode) =>
        set((state) => {
          state.calcMode = mode;
        }),
      setHillDirection: (direction) =>
        set((state) => {
          if (state.hillDirection === direction) return;
          state.hillDirection = direction;

          // Negate values to match new direction
          state.grade = -state.grade;
          updateHillInputsFromGrade(state);
        }),
      setHillInputMode: (mode) =>
        set((state) => {
          state.hillInputMode = mode;
        }),
      setGradeInput: (percent) =>
        set((state) => {
          const absGrade = Math.min(Math.abs(percent) / 100, MAX_GRADE);
          const grade = percent < 0 ? -absGrade : absGrade;
          state.grade = grade;
          updateHillInputsFromGrade(state);
        }),
      setAngleInput: (degrees) =>
        set((state) => {
          const rad = (degrees * Math.PI) / 180;
          let grade = Math.tan(rad);
          if (Math.abs(grade) > MAX_GRADE) {
            grade = grade < 0 ? -MAX_GRADE : MAX_GRADE;
          }
          state.grade = grade;
          updateHillInputsFromGrade(state);
        }),
      setRiseRunInput: (rise, run, riseUnit, runUnit) =>
        set((state) => {
          let newRise = rise;
          let newRun = run;

          // If units changed, convert values to keep grade the same
          if (state.riseRunInput.riseUnit !== riseUnit) {
            if (riseUnit === "feet") newRise = Math.round(rise / 0.3048);
            else newRise = Math.round(rise * 0.3048);
          }
          if (state.riseRunInput.runUnit !== runUnit) {
            if (runUnit === "mi")
              newRun = Number((run / KM_PER_MILE).toFixed(2));
            else newRun = Number((run * KM_PER_MILE).toFixed(2));
          }

          let grade = calculateGradeFromRiseRun(
            newRise,
            newRun,
            riseUnit,
            runUnit,
          );
          if (Math.abs(grade) > MAX_GRADE) {
            grade = grade < 0 ? -MAX_GRADE : MAX_GRADE;
            // Adjust rise to match MAX_GRADE
            const runMeters =
              runUnit === "mi" ? newRun * 1609.344 : newRun * 1000;
            const maxRiseMeters = runMeters * grade;
            newRise =
              riseUnit === "feet"
                ? Math.round(maxRiseMeters / 0.3048)
                : Math.round(maxRiseMeters);
          }

          state.riseRunInput.rise = newRise;
          state.riseRunInput.run = newRun;
          state.riseRunInput.riseUnit = riseUnit;
          state.riseRunInput.runUnit = runUnit;

          state.grade = grade;
          updateHillInputsFromGrade(state);
        }),
      setVertSpeedInput: (value, unit) =>
        set((state) => {
          let newValue = Math.abs(value);
          if (state.vertSpeedInput.unit !== unit) {
            if (unit === "ft/hr") newValue = Math.round(newValue / 0.3048);
            else newValue = Math.round(newValue * 0.3048);
          }
          state.vertSpeedInput.unit = unit;

          const speedMS = getCurrentSpeedMS(state);
          let vertSpeedMS =
            unit === "m/hr" ? newValue / 3600 : (newValue * 0.3048) / 3600;

          // Vertical speed should reflect the hill direction
          if (state.hillDirection === "downhill") {
            vertSpeedMS = -vertSpeedMS;
          }

          if (speedMS > 0) {
            if (Math.abs(vertSpeedMS) < speedMS) {
              const angleRad = Math.asin(vertSpeedMS / speedMS);
              let grade = Math.tan(angleRad);
              if (Math.abs(grade) > MAX_GRADE) {
                grade = grade < 0 ? -MAX_GRADE : MAX_GRADE;
              }
              state.grade = grade;
            } else {
              state.grade = vertSpeedMS >= 0 ? MAX_GRADE : -MAX_GRADE;
            }
          }

          updateHillInputsFromGrade(state);
        }),
      setOutputUnit: (unit) =>
        set((state) => {
          state.outputUnit = unit;
        }),
      applyPreset: (inclinePercent, speedMph) =>
        set((state) => {
          // Set grade
          const grade = inclinePercent / 100;
          state.grade = grade;
          updateHillInputsFromGrade(state);

          // Set speed
          // If current unit system is metric, convert speedMph to km/h
          let targetSpeed = speedMph;
          let targetUnit: PaceUnit = "mph";

          if (state.unitSystem === "metric") {
            targetSpeed = speedMph * KM_PER_MILE;
            targetUnit = "km/h";
          }

          // Update input unit to speed-based if it wasn't
          state.inputUnit = targetUnit;

          const totalTenths = Math.round(targetSpeed * 10);
          state.speedInput.whole = Math.floor(totalTenths / 10);
          state.speedInput.decimal = totalTenths % 10;

          syncVertSpeedFromGrade(state);
        }),
      toggleSectionCollapse: (section) =>
        set((state) => {
          state.collapsedSections[section] = !state.collapsedSections[section];
        }),
      reset: () =>
        set((state) => {
          Object.assign(state, createInitialState());
        }),
      getHillDirectionUI: () => {
        const state = get();
        // If grade is exactly 0, show "flat"
        if (state.grade === 0) {
          return "flat";
        }
        return state.hillDirection;
      },
    })),
    {
      name: "gap-calc-storage",
    },
  ),
);
