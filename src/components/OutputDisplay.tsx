import { css, html } from "react-strict-dom";
import {
  calculateGradeFromRiseRun,
  calculateMainResult,
  convertDict,
  convertPaceToMS,
  convertSpeedToMS,
  convertVertSpeedToMS,
} from "../logic/gapLogic";
import { useGapStore } from "../store/useGapStore";
import type { PaceUnit } from "../types/gap";

export function OutputDisplay() {
  const state = useGapStore();

  // 1. Convert inputs to standard units (m/s and decimal grade)
  let inputMS = 0;
  if (state.speedMode === "pace") {
    inputMS = convertPaceToMS(
      state.paceInput.minutes,
      state.paceInput.tensSeconds * 10 + state.paceInput.onesSeconds,
      state.inputUnit,
    );
  } else {
    inputMS = convertSpeedToMS(
      state.speedInput.whole + state.speedInput.decimal / 10,
      state.inputUnit,
    );
  }

  let inputGrade = 0;
  let vertSpeedMS = 0;

  if (state.hillInputMode === "grade") {
    inputGrade = state.gradeInput.percent / 100;
  } else if (state.hillInputMode === "angle") {
    inputGrade = Math.tan((state.angleInput.degrees * Math.PI) / 180);
  } else if (state.hillInputMode === "rise/run") {
    inputGrade = calculateGradeFromRiseRun(
      state.riseRunInput.rise,
      state.riseRunInput.run,
      state.riseRunInput.riseUnit,
      state.riseRunInput.runUnit,
    );
  } else if (state.hillInputMode === "vert speed") {
    vertSpeedMS = convertVertSpeedToMS(
      state.vertSpeedInput.value,
      state.vertSpeedInput.unit,
    );
    // Grade is solved iteratively in calculateMainResult for vert speed mode
  }

  // Adjust grade for direction
  if (
    state.hillDirection === "downhill" &&
    state.hillInputMode !== "vert speed"
  ) {
    inputGrade = -Math.abs(inputGrade);
  } else if (
    state.hillDirection === "uphill" &&
    state.hillInputMode !== "vert speed"
  ) {
    inputGrade = Math.abs(inputGrade);
  }

  // 2. Calculate result
  const { speed: resultSpeed, grade: resultGrade } = calculateMainResult({
    calcMode: state.calcMode,
    hillMode: state.hillInputMode,
    inputMS,
    inputGrade,
    vertSpeedMS,
    hillDirection: state.hillDirection,
  });

  const formattedOutput = !Number.isNaN(resultSpeed)
    ? convertDict[state.outputUnit](resultSpeed)
    : "---";

  const displayGrade = (resultGrade * 100).toFixed(1);

  return (
    <html.div style={styles.wrapper}>
      <html.div style={styles.container}>
        <html.div style={styles.label}>
          {state.calcMode === "pace"
            ? "Grade-Adjusted Pace"
            : "Equivalent Hill Pace"}
        </html.div>
        <html.div style={styles.value}>
          {formattedOutput}
          <html.span style={styles.unit}>{state.outputUnit}</html.span>
        </html.div>
        <html.div style={styles.subtext}>at {displayGrade}% grade</html.div>
      </html.div>
    </html.div>
  );
}

const styles = css.create({
  wrapper: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "24px",
    backgroundColor: "#1e293b",
    borderRadius: "16px",
    marginTop: "24px",
    width: "100%",
    maxWidth: "400px",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "8px",
  },
  value: {
    fontSize: "3.5rem",
    fontWeight: "800",
    color: "#ffffff",
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
  },
  unit: {
    fontSize: "1.25rem",
    fontWeight: "500",
    color: "#64748b",
  },
  subtext: {
    fontSize: "1rem",
    color: "#94a3b8",
    marginTop: "8px",
  },
});
