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
});
