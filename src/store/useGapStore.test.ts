import { beforeEach, describe, expect, it } from "vitest";
import { useGapStore } from "./useGapStore";

describe("useGapStore", () => {
  beforeEach(() => {
    // Reset store state if needed, but Zustand store is persistent in tests
    // For simplicity, we just test the actions
  });

  it("should update speed mode", () => {
    const { setSpeedMode } = useGapStore.getState();
    setSpeedMode("speed");
    expect(useGapStore.getState().speedMode).toBe("speed");
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
    expect(state.inputUnit).toBe("/mi");
    expect(state.outputUnit).toBe("mph");
    expect(state.riseRunInput.riseUnit).toBe("feet");
    expect(state.riseRunInput.runUnit).toBe("mi");
    expect(state.vertSpeedInput.unit).toBe("ft/hr");

    setUnitSystem("metric");
    state = useGapStore.getState();
    expect(state.unitSystem).toBe("metric");
    expect(state.inputUnit).toBe("/km");
    expect(state.outputUnit).toBe("km/h");
    expect(state.riseRunInput.riseUnit).toBe("meters");
    expect(state.riseRunInput.runUnit).toBe("km");
    expect(state.vertSpeedInput.unit).toBe("m/hr");
  });
});
