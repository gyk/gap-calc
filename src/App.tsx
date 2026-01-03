import { css, html } from "react-strict-dom";
import { DigitDial } from "./components/DigitDial";
import { InclineInput } from "./components/InclineInput";
import { OutputDisplay } from "./components/OutputDisplay";
import { UnitSelector } from "./components/UnitSelector";
import { useGapStore } from "./store/useGapStore";
import type {
  CalcMode,
  HillInputMode,
  PaceUnit,
  UnitSystem,
} from "./types/gap";

export default function App() {
  const {
    unitSystem,
    paceInput,
    speedInput,
    inputUnit,
    calcMode,
    hillInputMode,
    outputUnit,
    setPaceInput,
    setSpeedInput,
    setInputUnit,
    setCalcMode,
    setHillInputMode,
    setOutputUnit,
    setUnitSystem,
  } = useGapStore();

  // Determine speedMode based on inputUnit
  const speedMode =
    inputUnit === "mph" || inputUnit === "km/h" ? "speed" : "pace";

  // Get filtered unit options based on unit system
  const getInputUnitOptions = (): PaceUnit[] => {
    if (unitSystem === "metric") return ["/km", "km/h"];
    if (unitSystem === "imperial") return ["/mi", "mph"];
    return ["/mi", "/km", "mph", "km/h"];
  };

  const getOutputUnitOptions = (): PaceUnit[] => {
    if (unitSystem === "metric") return ["/km", "km/h"];
    if (unitSystem === "imperial") return ["/mi", "mph"];
    return ["/mi", "/km", "mph", "km/h"];
  };

  return (
    <html.div style={styles.container}>
      <html.div style={styles.card}>
        <html.h1 style={styles.title}>GAP Calculator</html.h1>

        {/* Unit System Selector */}
        <UnitSelector<UnitSystem>
          label="Unit System"
          options={["metric", "imperial", "both"]}
          value={unitSystem}
          onChange={setUnitSystem}
        />

        {/* Calculation Mode */}
        <UnitSelector<CalcMode>
          label="Calculation Mode"
          options={["pace", "effort"]}
          value={calcMode}
          onChange={setCalcMode}
        />

        {/* Speed/Pace Input Section */}
        <html.div style={styles.section}>
          <html.div style={styles.sectionTitle}>
            {calcMode === "pace"
              ? inputUnit === "mph" || inputUnit === "km/h"
                ? "Flat Speed"
                : "Flat Pace"
              : "Target Effort (Flat)"}
          </html.div>

          <html.div style={styles.inputRow}>
            {speedMode === "pace" ? (
              <>
                <DigitDial
                  label="Min"
                  value={paceInput.minutes}
                  onIncrement={() =>
                    setPaceInput(
                      paceInput.minutes + 1,
                      paceInput.tensSeconds,
                      paceInput.onesSeconds,
                    )
                  }
                  onDecrement={() =>
                    setPaceInput(
                      Math.max(0, paceInput.minutes - 1),
                      paceInput.tensSeconds,
                      paceInput.onesSeconds,
                    )
                  }
                />
                <html.div style={styles.separator}>:</html.div>
                <DigitDial
                  label="10s"
                  value={paceInput.tensSeconds}
                  onIncrement={() =>
                    setPaceInput(
                      paceInput.minutes,
                      (paceInput.tensSeconds + 1) % 6,
                      paceInput.onesSeconds,
                    )
                  }
                  onDecrement={() =>
                    setPaceInput(
                      paceInput.minutes,
                      (paceInput.tensSeconds + 5) % 6,
                      paceInput.onesSeconds,
                    )
                  }
                />
                <DigitDial
                  label="1s"
                  value={paceInput.onesSeconds}
                  onIncrement={() =>
                    setPaceInput(
                      paceInput.minutes,
                      paceInput.tensSeconds,
                      (paceInput.onesSeconds + 1) % 10,
                    )
                  }
                  onDecrement={() =>
                    setPaceInput(
                      paceInput.minutes,
                      paceInput.tensSeconds,
                      (paceInput.onesSeconds + 9) % 10,
                    )
                  }
                />
              </>
            ) : (
              <>
                <DigitDial
                  label="Whole"
                  value={speedInput.whole}
                  onIncrement={() =>
                    setSpeedInput(speedInput.whole + 1, speedInput.decimal)
                  }
                  onDecrement={() =>
                    setSpeedInput(
                      Math.max(0, speedInput.whole - 1),
                      speedInput.decimal,
                    )
                  }
                />
                <html.div style={styles.separator}>.</html.div>
                <DigitDial
                  label="Dec"
                  value={speedInput.decimal}
                  onIncrement={() =>
                    setSpeedInput(
                      speedInput.whole,
                      (speedInput.decimal + 1) % 10,
                    )
                  }
                  onDecrement={() =>
                    setSpeedInput(
                      speedInput.whole,
                      (speedInput.decimal + 9) % 10,
                    )
                  }
                />
              </>
            )}
            <UnitSelector<PaceUnit>
              options={getInputUnitOptions()}
              value={inputUnit}
              onChange={setInputUnit}
            />
          </html.div>
        </html.div>

        {/* Hill Section */}
        <html.div style={styles.section}>
          <html.div style={styles.sectionTitle}>Hill Settings</html.div>

          <UnitSelector<HillInputMode>
            options={["grade", "angle", "rise/run", "vert speed"]}
            value={hillInputMode}
            onChange={setHillInputMode}
          />

          <InclineInput />
        </html.div>

        {/* Output Section */}
        <html.div style={styles.section}>
          <html.div style={styles.sectionHeader}>
            <html.div style={styles.sectionTitle}>Output Unit</html.div>
            <UnitSelector<PaceUnit>
              options={getOutputUnitOptions()}
              value={outputUnit}
              onChange={setOutputUnit}
            />
          </html.div>
          <OutputDisplay />
        </html.div>
      </html.div>
    </html.div>
  );
}

const styles = css.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    padding: "32px",
    width: "100%",
    maxWidth: "500px",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "24px",
    textAlign: "center",
  },
  section: {
    marginTop: "24px",
    paddingTop: "24px",
    borderTopWidth: "1px",
    borderColor: "#f1f5f9",
  },
  sectionHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  sectionTitle: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#334155",
  },
  inputRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  separator: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#64748b",
    paddingTop: "20px",
  },
});
