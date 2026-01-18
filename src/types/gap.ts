/**
 * Types and interfaces for the Grade-Adjusted Pace (GAP) Calculator
 */

/** Speed/pace unit options for input and output */
export type PaceUnit = "/mi" | "/km" | "mph" | "km/h" | "m/s";

/** Calculation mode - pace-to-effort or effort-to-pace */
export type CalcMode = "pace" | "effort";

/** Unit system preference */
export type UnitSystem = "metric" | "imperial" | "both";

/** Hill direction */
export type HillDirection = "uphill" | "downhill";

/** Hill direction for UI purposes (includes flat state) */
export type HillDirectionUI = "uphill" | "flat" | "downhill";

/** Hill input mode - how the incline is specified */
export type HillInputMode = "grade" | "angle" | "rise/run" | "vert speed";

/** Rise unit for rise/run mode */
export type RiseUnit = "feet" | "meters";

/** Run unit for rise/run mode */
export type RunUnit = "mi" | "km";

/** Vert speed unit */
export type VertSpeedUnit = "ft/hr" | "m/hr";

/** Black et al 2018 GAM data structure */
export interface BlackGamData {
  speed_m_s: readonly number[];
  energy_j_kg_m: readonly number[];
  energy_j_kg_s: readonly number[];
}

/** Energy column names for lookup */
export type EnergyColumn = "energy_j_kg_m" | "energy_j_kg_s";

/** Pace input state (mm:ss format) */
export interface PaceInput {
  minutes: number;
  tensSeconds: number;
  onesSeconds: number;
}

/** Speed input state (decimal format) */
export interface SpeedInput {
  whole: number;
  decimal: number;
}

/** Grade input state */
export interface GradeInput {
  percent: number;
}

/** Angle input state */
export interface AngleInput {
  degrees: number;
}

/** Rise/Run input state */
export interface RiseRunInput {
  rise: number;
  run: number;
  riseUnit: RiseUnit;
  runUnit: RunUnit;
}

/** Vert speed input state */
export interface VertSpeedInput {
  value: number;
  unit: VertSpeedUnit;
}

/** Calculator state */
export interface GapState {
  // Unit system preference
  unitSystem: UnitSystem;

  // Speed/pace input
  paceInput: PaceInput;
  speedInput: SpeedInput;
  inputUnit: PaceUnit;

  // Calculation mode
  calcMode: CalcMode;

  // Hill settings
  hillDirection: HillDirection;
  hillInputMode: HillInputMode;
  grade: number; // Internal decimal grade (e.g. 0.05 for 5%)
  gradeInput: GradeInput;
  angleInput: AngleInput;
  riseRunInput: RiseRunInput;
  vertSpeedInput: VertSpeedInput;

  // Output settings
  outputUnit: PaceUnit;

  // Section collapse state
  collapsedSections: {
    settings: boolean;
    speed: boolean;
    incline: boolean;
  };
}

/** Result of GAP calculation */
export interface GapResult {
  /** Equivalent flat speed in m/s */
  equivalentSpeed: number;
  /** Formatted output string */
  formattedOutput: string;
  /** Whether the calculation is valid */
  isValid: boolean;
  /** Alert message, if any */
  alertMessage?: string;
  /** Info message, if any */
  infoMessage?: string;
}
