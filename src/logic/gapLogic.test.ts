import { describe, expect, it } from "vitest";
import {
  calculateDeltaEnergyCost,
  calculateGAP,
  decimalPaceToString,
  getEquivalentFlatSpeed,
  lookupSpeed,
} from "./gapLogic";

describe("gapLogic unit tests", () => {
  it("decimalPaceToString", () => {
    expect(decimalPaceToString(7.5)).toBe("7:30");
    expect(decimalPaceToString(10)).toBe("10:00");
    expect(decimalPaceToString(3.999)).toBe("4:00");
  });

  it("calculateDeltaEnergyCost", () => {
    expect(calculateDeltaEnergyCost(0)).toBeCloseTo(0, 10);
    const expected_01 =
      155.4 * 0.1 ** 5 -
      30.4 * 0.1 ** 4 -
      43.3 * 0.1 ** 3 +
      46.3 * 0.1 ** 2 +
      19.5 * 0.1;
    expect(calculateDeltaEnergyCost(0.1)).toBeCloseTo(expected_01, 10);
  });

  it("lookupSpeed", () => {
    expect(lookupSpeed(0, "energy_j_kg_m")).toBe(6.0976);
    expect(lookupSpeed(0.025, "energy_j_kg_m")).toBeCloseTo(6.0784, 10);
    expect(Number.isNaN(lookupSpeed(-1, "energy_j_kg_m"))).toBe(true);
    expect(Number.isNaN(lookupSpeed(11, "energy_j_kg_m"))).toBe(true);
  });

  it("getEquivalentFlatSpeed", () => {
    expect(getEquivalentFlatSpeed(0)).toBe(0);
    expect(getEquivalentFlatSpeed(0.1515)).toBeCloseTo(0.025, 10);
  });
});

describe("GAP integration tests", () => {
  const gapTests = [
    { speed: 6, grade: 9, expected: "5:39" },
    { speed: 6, grade: 12, expected: "4:53" },
    { speed: 5, grade: 12, expected: "6:03" },
    { speed: 4.8, grade: 12, expected: "6:26" },
    { speed: 4, grade: 15, expected: "7:07" },
    { speed: 4, grade: 20, expected: "5:26" },
    { speed: 3, grade: 20, expected: "8:26" },
  ];

  for (const test of gapTests) {
    it(`${test.speed} km/h at ${test.grade}% == ${test.expected}`, () => {
      expect(calculateGAP(test.speed, test.grade)).toBe(test.expected);
    });
  }
});
