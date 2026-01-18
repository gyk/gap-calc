import type { UnitSystem } from "../types/gap";

export const getUnitOptions = <T extends string>(
  unitSystem: UnitSystem,
  metricOptions: readonly T[],
  imperialOptions: readonly T[],
): T[] => {
  if (unitSystem === "metric") return [...metricOptions];
  if (unitSystem === "imperial") return [...imperialOptions];
  // Both
  return [...metricOptions, ...imperialOptions];
};
