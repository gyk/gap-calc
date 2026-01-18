import type { EnergyColumn, HillDirection, PaceUnit } from "../types/gap";
import { blackGam } from "./blackGam";
import { METERS_PER_MILE, METERS_PER_FOOT, MPS_PER_MPH } from "../constants";

/**
 * Linear interpolation between two points.
 */
const interpolate = (
  x: number,
  x0: number,
  x1: number,
  y0: number,
  y1: number,
): number => y0 + (y1 - y0) * ((x - x0) / (x1 - x0));

/**
 * Finds the index i such that value is between array[i] and array[i+1].
 * Assumes array is sorted.
 */
const findIntervalIndex = (value: number, array: readonly number[]): number => {
  for (let i = 0; i < array.length - 1; i++) {
    if (value >= array[i] && value <= array[i + 1]) {
      return i;
    }
  }
  return -1;
};

/**
 * Minetti 2002 quintic polynomial for (change in) energy cost
 * @param grade Gradient in decimal (0.10 for 10% grade, can be negative)
 * @returns Cr - *added* cost of running, above level ground intensity, in J/kg/m
 */
export function calculateDeltaEnergyCost(grade: number): number {
  const deltaCr =
    155.4 * grade ** 5 -
    30.4 * grade ** 4 -
    43.3 * grade ** 3 +
    46.3 * grade ** 2 +
    19.5 * grade;
  return deltaCr;
}

/**
 * Get f(x_speed) for either J/kg/m or J/kg/s (=W/kg) in Black data
 * @param speedValue Speed in m/s
 * @param columnName Energy column name
 * @returns Energy value or NaN
 */
export function lookupSpeed(
  speedValue: number,
  columnName: EnergyColumn,
): number {
  const speeds = blackGam.speed_m_s;
  const energyValues = blackGam[columnName];

  if (speedValue < speeds[0] || speedValue > speeds[speeds.length - 1]) {
    return Number.NaN;
  }

  const i = findIntervalIndex(speedValue, speeds);
  if (i === -1) return Number.NaN;

  return interpolate(
    speedValue,
    speeds[i],
    speeds[i + 1],
    energyValues[i],
    energyValues[i + 1],
  );
}

/**
 * Use blackGam to find what flat-ground speed has the metabolic power closest to a given metabolic power
 * @param metabolicPower Metabolic power in W/kg
 * @returns Equivalent flat speed in m/s or NaN
 */
export function getEquivalentFlatSpeed(metabolicPower: number): number {
  const speeds = blackGam.speed_m_s;
  const metabolicPowers = blackGam.energy_j_kg_s;

  if (
    metabolicPower < metabolicPowers[0] ||
    metabolicPower > metabolicPowers[metabolicPowers.length - 1]
  ) {
    return Number.NaN;
  }

  const i = findIntervalIndex(metabolicPower, metabolicPowers);
  if (i === -1) return Number.NaN;

  return interpolate(
    metabolicPower,
    metabolicPowers[i],
    metabolicPowers[i + 1],
    speeds[i],
    speeds[i + 1],
  );
}

/**
 * Convert decimal pace to string format (mm:ss)
 */
export function decimalPaceToString(paceDecimal: number): string {
  if (!Number.isFinite(paceDecimal) || paceDecimal <= 0) {
    return "--:--";
  }
  const totalSeconds = Math.round(paceDecimal * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Conversion functions from speed (m/s) to various units
 */
export const convertDict: Record<PaceUnit, (speed: number) => string> = {
  "/mi": (speed) => {
    const convDec = METERS_PER_MILE / (speed * 60);
    return decimalPaceToString(convDec);
  },
  "/km": (speed) => {
    const convDec = 1000 / (speed * 60);
    return decimalPaceToString(convDec);
  },
  mph: (speed) => (speed * 2.23694).toFixed(1),
  "km/h": (speed) => (speed * 3.6).toFixed(1),
  "m/s": (speed) => speed.toFixed(2),
};

/**
 * Utility for the grade gridsearch
 */
function calcWTrial(gradeI: number, vy: number): [number, number] {
  if (gradeI === 0) throw new Error("grade should not be 0");
  const vx = vy / gradeI;
  const vAct = Math.sqrt(vx ** 2 + vy ** 2);

  const crI =
    lookupSpeed(vAct, "energy_j_kg_m") + calculateDeltaEnergyCost(gradeI);
  let wI = crI * vAct;
  if (Number.isNaN(wI)) wI = Number.POSITIVE_INFINITY;
  return [vAct, wI];
}

/**
 * Solving effort-based vert speed
 */
export function solveVertSpeed(
  inputMS: number,
  vertSpd: number,
  hillDirection: HillDirection,
): { speed: number; grade: number } {
  const targetWkg = lookupSpeed(inputMS, "energy_j_kg_s");

  const wResults: number[] = [];
  const gradeTrials: number[] = [];
  const vactResults: number[] = [];

  if (hillDirection === "uphill") {
    for (let gradeI = 0.005; gradeI <= 0.5; gradeI += 0.005) {
      const [vActRes, wiRes] = calcWTrial(gradeI, vertSpd);
      wResults.push(wiRes);
      vactResults.push(vActRes);
      gradeTrials.push(gradeI);
    }
  } else if (hillDirection === "downhill") {
    for (let gradeI = -0.005; gradeI >= -0.5; gradeI -= 0.005) {
      const [vActRes, wiRes] = calcWTrial(gradeI, vertSpd);
      wResults.push(wiRes);
      vactResults.push(vActRes);
      gradeTrials.push(gradeI);
    }
  }

  let closestIndex = 0;
  let smallestDifference = Number.POSITIVE_INFINITY;

  for (let i = 0; i < wResults.length; i++) {
    const difference = Math.abs(wResults[i] - targetWkg);
    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestIndex = i;
    }
  }

  const closestGrade = gradeTrials[closestIndex];
  let closestV = vactResults[closestIndex];
  const pctDiff = Math.abs(smallestDifference / targetWkg);

  if (pctDiff > 0.05) {
    closestV = Number.NaN;
  }

  return { speed: closestV, grade: closestGrade };
}

interface MainResultParams {
  calcMode: "pace" | "effort";
  hillMode: string;
  inputMS: number;
  inputGrade: number;
  vertSpeedMS: number;
  hillDirection: HillDirection;
}

export function calculateMainResult(params: MainResultParams): {
  speed: number;
  grade: number;
} {
  const {
    calcMode,
    hillMode,
    inputMS,
    inputGrade,
    vertSpeedMS,
    hillDirection,
  } = params;

  const flatCr = lookupSpeed(inputMS, "energy_j_kg_m");
  const deltaCr = calculateDeltaEnergyCost(inputGrade);
  const totalCr = flatCr + deltaCr;

  let resultSpeed = Number.NaN;
  let resultGrade = inputGrade;

  if (calcMode === "pace") {
    const totalCrWkg = totalCr * inputMS;
    resultSpeed = getEquivalentFlatSpeed(totalCrWkg);
  } else if (calcMode === "effort" && hillMode === "vert speed") {
    const res = solveVertSpeed(inputMS, vertSpeedMS, hillDirection);
    resultSpeed = res.speed;
    resultGrade = res.grade;
  } else {
    // REVERSE MODE (effort-to-pace)
    const targetWkg = lookupSpeed(inputMS, "energy_j_kg_s");

    // Iteratively solve for the hill speed
    let vGuess = targetWkg / totalCr; // Initial guess using flat speed economy
    for (let i = 0; i < 10; i++) {
      const crAtGuess = lookupSpeed(vGuess, "energy_j_kg_m");
      if (Number.isNaN(crAtGuess)) break;
      const totalCrCorrect = crAtGuess + deltaCr;
      vGuess = targetWkg / totalCrCorrect;
    }
    resultSpeed = vGuess;
  }

  return { speed: resultSpeed, grade: resultGrade };
}

export function convertPaceToMS(
  minutes: number,
  seconds: number,
  units: PaceUnit,
): number {
  const decMinutes = minutes + seconds / 60;
  if (decMinutes === 0) return 0;
  if (units === "/mi") {
    return METERS_PER_MILE / (60 * decMinutes);
  }
  if (units === "/km") {
    return 1000 / (60 * decMinutes);
  }
  // Fallback for speed units if called incorrectly
  if (units === "mph") return (1 / decMinutes) * MPS_PER_MPH * 60; // This is weird but let's just handle it
  return 0;
}

export function convertSpeedToMS(speed: number, units: PaceUnit): number {
  if (units === "mph") {
    return (speed * METERS_PER_MILE) / 3600;
  }
  if (units === "km/h") {
    return (speed * 1000) / 3600;
  }
  if (units === "m/s") {
    return speed;
  }
  // Fallback for pace units if called incorrectly
  if (units === "/km") return 1000 / (speed * 60);
  if (units === "/mi") return METERS_PER_MILE / (speed * 60);
  return 0;
}

export function convertMSToPace(
  speedMS: number,
  unit: PaceUnit,
): { minutes: number; seconds: number } {
  if (speedMS <= 0) return { minutes: 0, seconds: 0 };
  let paceDecimal = 0;
  if (unit === "/mi") {
    paceDecimal = METERS_PER_MILE / (speedMS * 60);
  } else if (unit === "/km") {
    paceDecimal = 1000 / (speedMS * 60);
  } else {
    return { minutes: 0, seconds: 0 };
  }

  const totalSeconds = Math.round(paceDecimal * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return { minutes, seconds };
}

export function convertMSToSpeed(speedMS: number, unit: PaceUnit): number {
  if (unit === "mph") {
    return speedMS / MPS_PER_MPH;
  }
  if (unit === "km/h") {
    return speedMS * 3.6;
  }
  if (unit === "m/s") {
    return speedMS;
  }
  return 0;
}

export function convertVertSpeedToMS(vertSpeed: number, units: string): number {
  if (units === "feet per hour" || units === "ft/hr") {
    return (vertSpeed * METERS_PER_FOOT) / 3600;
  }
  if (units === "meters per hour" || units === "m/hr") {
    return vertSpeed / 3600;
  }
  return 0;
}

export function calculateGradeFromRiseRun(
  rise: number,
  run: number,
  riseUnit: string,
  runUnit: string,
): number {
  const riseMeters =
    riseUnit === "feet" || riseUnit === "ft" ? rise * METERS_PER_FOOT : rise;
  const runMeters =
    runUnit === "miles" || runUnit === "mi"
      ? run * METERS_PER_MILE
      : run * 1000;
  return riseMeters / runMeters;
}

/**
 * Calculate GAP for a given speed and grade (legacy function for testing)
 */
export function calculateGAP(speedKmh: number, gradePct: number): string {
  const inputSpeedMs = speedKmh / 3.6;
  const inputGrade = gradePct / 100;
  const flatCr = lookupSpeed(inputSpeedMs, "energy_j_kg_m");
  const deltaCr = calculateDeltaEnergyCost(inputGrade);
  const totalCr = flatCr + deltaCr;
  const totalCrMetabolicPower = totalCr * inputSpeedMs;
  const equivalentFlatSpeed = getEquivalentFlatSpeed(totalCrMetabolicPower);
  return convertDict["/km"](equivalentFlatSpeed);
}
