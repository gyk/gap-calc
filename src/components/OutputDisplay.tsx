import { css, html } from "react-strict-dom";
import { useIsMobile } from "../hooks/useIsMobile";
import {
  calculateMainResult,
  convertDict,
  convertVertSpeedToMS,
} from "../logic/gapLogic";
import {
  getCurrentGrade,
  getCurrentSpeedMS,
  useGapStore,
} from "../store/useGapStore";
import type { PaceUnit } from "../types/gap";

export function OutputDisplay() {
  const state = useGapStore();
  const isMobile = useIsMobile();

  // 1. Convert inputs to standard units (m/s and decimal grade)
  const inputMS = getCurrentSpeedMS(state);

  const inputGrade = getCurrentGrade(state);
  let vertSpeedMS = 0;

  if (state.hillInputMode === "vert speed") {
    vertSpeedMS = convertVertSpeedToMS(
      state.vertSpeedInput.value,
      state.vertSpeedInput.unit,
    );
    // Grade is solved iteratively in calculateMainResult for vert speed mode
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

  const formattedOutput =
    !Number.isNaN(resultSpeed) &&
    Number.isFinite(resultSpeed) &&
    resultSpeed > 0
      ? convertDict[state.outputUnit](resultSpeed)
      : "🤔";

  const displayGrade = (resultGrade * 100).toFixed(0);

  return (
    <html.div style={styles.wrapper}>
      <html.div style={[styles.container, isMobile && styles.containerMobile]}>
        <html.div style={styles.label}>Equivalent pace</html.div>
        <html.div style={[styles.value, isMobile && styles.valueMobile]}>
          {formattedOutput}
          {formattedOutput !== "🤔" && (
            <html.span style={styles.unit}>{state.outputUnit}</html.span>
          )}
        </html.div>
        <html.div style={styles.subtext}>
          {state.calcMode === "pace"
            ? "on flat ground"
            : `at ${displayGrade}% grade`}
        </html.div>
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
    width: "100%",
    maxWidth: "440px",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  containerMobile: {
    padding: "16px",
    marginTop: "16px",
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
  valueMobile: {
    fontSize: "2.5rem",
  },
  unit: {
    fontSize: "1.25rem",
    fontWeight: "500",
    color: "#64748b",
    whiteSpace: "nowrap",
  },
  subtext: {
    fontSize: "1rem",
    color: "#94a3b8",
    marginTop: "8px",
  },
});
