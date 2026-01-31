import { beforeEach, describe, expect, it } from "vitest";
import { useGapStore } from "./useGapStore";

describe("useGapStore", () => {
  beforeEach(() => {
    useGapStore.getState().reset();
  });

  it("should update pace input", () => {
    const { setPaceInput } = useGapStore.getState();
    setPaceInput(7, 3, 0);
    expect(useGapStore.getState().paceInput).toEqual({
      minutes: 7,
      tensSeconds: 3,
      onesSeconds: 0,
    });
  });

  it("should update grade input", () => {
    const { setGradeInput } = useGapStore.getState();
    setGradeInput(10);
    expect(useGapStore.getState().gradeInput.percent).toBe(10);
  });

  it("should update unit system and related units", () => {
    const { setUnitSystem } = useGapStore.getState();

    setUnitSystem("imperial");
    let state = useGapStore.getState();
    expect(state.unitSystem).toBe("imperial");
    expect(state.inputUnit).toBe("mph");
    expect(state.outputUnit).toBe("/mi");
    expect(state.riseRunInput.riseUnit).toBe("feet");
    expect(state.riseRunInput.runUnit).toBe("mi");
    expect(state.vertSpeedInput.unit).toBe("ft/hr");

    setUnitSystem("metric");
    state = useGapStore.getState();
    expect(state.unitSystem).toBe("metric");
    expect(state.inputUnit).toBe("km/h");
    expect(state.outputUnit).toBe("/km");
    expect(state.riseRunInput.riseUnit).toBe("meters");
    expect(state.riseRunInput.runUnit).toBe("km");
    expect(state.vertSpeedInput.unit).toBe("m/hr");
  });

  it("should convert pace when switching units", () => {
    const { setPaceInput, setInputUnit } = useGapStore.getState();

    // Set to 8:00 /km
    setInputUnit("/km");
    setPaceInput(8, 0, 0);

    // Switch to /mi
    setInputUnit("/mi");
    const state = useGapStore.getState();
    // 8:00 /km is 12:52 /mi (8 * 1.609344 = 12.874752 min = 12:52.48)
    expect(state.paceInput.minutes).toBe(12);
    expect(state.paceInput.tensSeconds).toBe(5);
    expect(state.paceInput.onesSeconds).toBe(2);
  });

  it("should preserve pace when switching units back", () => {
    const { setPaceInput, setInputUnit } = useGapStore.getState();

    setInputUnit("/km");
    setPaceInput(15, 1, 0);

    setInputUnit("km/h");
    setInputUnit("/km");

    const state = useGapStore.getState();
    expect(state.paceInput.minutes).toBe(15);
    expect(state.paceInput.tensSeconds).toBe(1);
    expect(state.paceInput.onesSeconds).toBe(0);
  });

  it("should cap grade at 50%", () => {
    const { setGradeInput } = useGapStore.getState();
    setGradeInput(60);
    expect(useGapStore.getState().gradeInput.percent).toBe(50);
    expect(useGapStore.getState().grade).toBe(0.5);

    setGradeInput(-70);
    expect(useGapStore.getState().gradeInput.percent).toBe(-50);
    expect(useGapStore.getState().grade).toBe(-0.5);
  });

  it("should sync angle and rise/run when grade changes", () => {
    const { setGradeInput } = useGapStore.getState();
    setGradeInput(10);
    const state = useGapStore.getState();
    expect(state.angleInput.degrees).toBe(5.71); // atan(0.1) * 180 / PI
    expect(state.riseRunInput.rise).toBe(100); // 10% of 1km is 100m
  });

  it("should sync vertical speed when grade changes", () => {
    const { setGradeInput, setSpeedInput, setInputUnit } =
      useGapStore.getState();

    // Set speed to 10 km/h (2.777... m/s)
    setInputUnit("km/h");
    setSpeedInput(10, 0);

    // Set grade to 10%
    setGradeInput(10);

    const state = useGapStore.getState();
    // Vvert = Vtotal * sin(atan(0.1))
    // Vvert = 2.777... * 0.0995... = 0.276... m/s
    // Vvert (m/hr) = 0.276... * 3600 = 995.0...
    expect(state.vertSpeedInput.value).toBeCloseTo(995, -1);
  });

  it("should sync grade when vertical speed changes", () => {
    const { setVertSpeedInput, setSpeedInput, setInputUnit } =
      useGapStore.getState();

    // Set speed to 10 km/h (2.777... m/s)
    setInputUnit("km/h");
    setSpeedInput(10, 0);

    // Set vert speed to 1000 m/hr (0.2777... m/s)
    setVertSpeedInput(1000, "m/hr");

    const state = useGapStore.getState();
    // sin(theta) = Vvert / Vtotal = 0.2777... / 2.777... = 0.1
    // theta = asin(0.1) = 5.739... degrees
    // grade = tan(theta) = 0.1005...
    expect(state.grade).toBeCloseTo(0.1005, 3);
    expect(state.gradeInput.percent).toBeCloseTo(10.05, 1);
  });

  it("should cap vertical speed when it exceeds 50% grade", () => {
    const { setVertSpeedInput, setSpeedInput, setInputUnit } =
      useGapStore.getState();

    // Set speed to 10 km/h (2.777... m/s)
    setInputUnit("km/h");
    setSpeedInput(10, 0);

    // Max vert speed at 10km/h and 50% grade:
    // grade = 0.5 -> theta = atan(0.5) = 26.565... degrees
    // Vvert = Vtotal * sin(theta) = 2.777... * sin(26.565...) = 2.777... * 0.4472... = 1.2422... m/s
    // Vvert (m/hr) = 1.2422... * 3600 = 4472.13... m/hr

    // Set vert speed to 6000 m/hr (which is > 4472)
    setVertSpeedInput(6000, "m/hr");

    const state = useGapStore.getState();
    expect(state.grade).toBe(0.5);
    expect(state.gradeInput.percent).toBe(50);
    expect(state.vertSpeedInput.value).toBeCloseTo(4472, -1);
  });

  it("should respect hill direction when setting vertical speed", () => {
    const { setVertSpeedInput, setSpeedInput, setInputUnit, setHillDirection } =
      useGapStore.getState();

    setInputUnit("km/h");
    setSpeedInput(10, 0);

    // Set to downhill
    setHillDirection("downhill");

    // Set vert speed to 1000 m/hr
    setVertSpeedInput(1000, "m/hr");

    const state = useGapStore.getState();
    // Since it's downhill, grade should be negative
    expect(state.grade).toBeLessThan(0);
    expect(state.gradeInput.percent).toBeCloseTo(-10.05, 1);
    expect(state.hillDirection).toBe("downhill");
  });

  it("should correctly convert speed from mph to km/h without decimal overflow", () => {
    const { setUnitSystem, setSpeedInput, setInputUnit } =
      useGapStore.getState();

    // Set to imperial and 3.7 mph
    setUnitSystem("imperial");
    setInputUnit("mph");
    setSpeedInput(3, 7);

    // Switch to metric
    setUnitSystem("metric");
    const state = useGapStore.getState();

    // 3.7 mph = 5.9545728 km/h -> should be 6.0 km/h
    expect(state.speedInput.whole).toBe(6);
    expect(state.speedInput.decimal).toBe(0);
    expect(state.speedInput.decimal).toBeLessThanOrEqual(9);
  });
});
