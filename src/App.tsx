import { useEffect, useState } from "react";
import { css, html } from "react-strict-dom";
import { CollapsibleSection } from "./components/CollapsibleSection";
import { DigitDial } from "./components/DigitDial";
import { InclineInput } from "./components/InclineInput";
import { OutputDisplay } from "./components/OutputDisplay";
import { PresetsModal } from "./components/PresetsModal";
import { UnitSelector } from "./components/UnitSelector";
import { useIsMobile } from "./hooks/useIsMobile";
import { useGapStore } from "./store/useGapStore";
import type {
  CalcMode,
  HillInputMode,
  PaceUnit,
  UnitSystem,
} from "./types/gap";
import { getUnitOptions } from "./utils/unitOptions";

const HelpLink = ({
  href,
  label = "?",
  style,
}: { href: string; label?: string; style?: any }) => (
  <html.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={[styles.helpLink, style]}
    aria-label="Learn more"
  >
    {label}
  </html.a>
);

export default function App() {
  const {
    unitSystem,
    paceInput,
    speedInput,
    inputUnit,
    calcMode,
    hillInputMode,
    outputUnit,
    grade,
    collapsedSections,
    setPaceInput,
    setSpeedInput,
    setInputUnit,
    setCalcMode,
    setHillInputMode,
    setOutputUnit,
    setUnitSystem,
    toggleSectionCollapse,
  } = useGapStore();

  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const isMobile = useIsMobile();

  // If on mobile and unit system is "both", switch to "metric"
  useEffect(() => {
    if (isMobile && unitSystem === "both") {
      setUnitSystem("metric");
    }
  }, [isMobile, unitSystem, setUnitSystem]);

  // Determine speedMode based on inputUnit
  const speedMode =
    inputUnit === "mph" || inputUnit === "km/h" || inputUnit === "m/s"
      ? "speed"
      : "pace";

  const inputUnitOptions = getUnitOptions(
    unitSystem,
    ["/km", "km/h"],
    ["/mi", "mph"],
  );
  const outputUnitOptions = getUnitOptions(
    unitSystem,
    ["/km", "km/h"],
    ["/mi", "mph"],
  );

  const alerts = [];
  if (grade < -0.08) {
    alerts.push({
      text: "This downhill might be too steep to gain the full energetic benefit",
      link: "https://apps.runningwritings.com/gap-calculator/#steep-downhills",
      label: "i",
      color: "#007bff",
    });
  } else if (grade > 0.25) {
    alerts.push({
      text: "This uphill might be steep enough that walking would be more energetically efficient",
      link: "https://apps.runningwritings.com/gap-calculator/#walk-vs-run",
      label: "i",
      color: "#007bff",
    });
  }

  if (calcMode === "effort" && hillInputMode === "vert speed") {
    alerts.push({
      text: "Effort-based GAP using vert speed can behave unpredictably!",
      link: "https://apps.runningwritings.com/gap-calculator/#vert-speed-effort",
      label: "!",
      color: "#dc3545",
    });
  }

  return (
    <html.div style={styles.container}>
      <html.div style={styles.card}>
        <html.h1 style={styles.title}>
          <html.img src="icon.svg" style={styles.logo} alt="App Icon" />
          <html.div style={styles.titleText}>
            <html.div>
              <html.span style={styles.titleGrade}>Grade-adjusted</html.span>
            </html.div>
            <html.div>pace calculator ↗️↘️↗️</html.div>
          </html.div>
        </html.h1>
        {/* Settings */}
        <CollapsibleSection
          title="Settings"
          isCollapsed={collapsedSections.settings}
          onToggle={() => toggleSectionCollapse("settings")}
          rightContent={
            <html.button
              style={styles.presetButton}
              onClick={() => setIsPresetsOpen(true)}
            >
              📋 Presets
            </html.button>
          }
        >
          {/* Unit System Selector */}
          <UnitSelector<UnitSystem>
            label="Unit System"
            options={
              isMobile ? ["metric", "imperial"] : ["metric", "imperial", "both"]
            }
            value={unitSystem}
            onChange={setUnitSystem}
          />

          {/* Calculation Mode */}
          <UnitSelector<CalcMode>
            label="Calculation Mode"
            options={["pace", "effort"]}
            value={calcMode}
            onChange={setCalcMode}
            renderOption={(opt) =>
              opt === "pace" ? "Incline → Flat" : "Flat → Incline"
            }
          />
        </CollapsibleSection>

        {/* Speed/Pace Input Section */}
        <html.div style={styles.section}>
          <html.div style={styles.sectionHeader}>
            <html.div style={styles.sectionTitle}>
              {calcMode === "pace"
                ? inputUnit === "mph" || inputUnit === "km/h"
                  ? "Speed"
                  : "Pace"
                : inputUnit === "mph" || inputUnit === "km/h"
                  ? "Speed (Effort)"
                  : "Pace (Effort)"}
            </html.div>
            <HelpLink href="https://apps.runningwritings.com/gap-calculator/#pace-vs-effort" />
          </html.div>

          <html.div style={isMobile ? styles.inputColumn : styles.inputRow}>
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
                    label={inputUnit}
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
                    label=".1"
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
            </html.div>
            {!collapsedSections.settings && (
              <UnitSelector<PaceUnit>
                options={inputUnitOptions}
                value={inputUnit}
                onChange={setInputUnit}
              />
            )}
          </html.div>
        </html.div>

        {/* Hill Section */}
        <html.div style={styles.section}>
          <html.div style={styles.sectionTitle}>Incline</html.div>
          {!collapsedSections.settings && (
            <UnitSelector<HillInputMode>
              options={["grade", "angle", "rise/run", "vert speed"]}
              value={hillInputMode}
              onChange={setHillInputMode}
              nowrap={false}
              renderOption={(opt) => {
                if (isMobile) {
                  if (opt === "rise/run") return "rise";
                  if (opt === "vert speed") return "v.spd";
                }
                return opt;
              }}
            />
          )}

          <InclineInput />

          {alerts.map((alert, index) => (
            <html.div key={index} style={styles.alertBox}>
              <HelpLink
                href={alert.link}
                label={alert.label}
                style={{ backgroundColor: alert.color }}
              />
              <html.span style={styles.alertText}>{alert.text}</html.span>
            </html.div>
          ))}
        </html.div>

        {/* Output Section */}
        <html.div style={styles.section}>
          {!collapsedSections.settings && (
            <html.div style={styles.sectionHeader}>
              <html.div style={styles.sectionTitle}>Output Unit</html.div>
              <UnitSelector<PaceUnit>
                options={outputUnitOptions}
                value={outputUnit}
                onChange={setOutputUnit}
              />
            </html.div>
          )}
          <OutputDisplay />
        </html.div>
      </html.div>

      <html.footer style={styles.footer}>
        <html.p style={styles.footerText}>
          Based on the original{" "}
          <html.a
            href="https://apps.runningwritings.com/gap-calculator/"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            Grade-adjusted pace calculator
          </html.a>{" "}
          from Running Writings.
        </html.p>
      </html.footer>

      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
      />
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
    maxWidth: "540px",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "@media (max-width: 640px)": {
      padding: "16px",
      borderRadius: "16px",
    },
  },
  title: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    fontSize: "2rem",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "24px",
    textAlign: "center",
    "@media (max-width: 640px)": {
      fontSize: "1.5rem",
      marginBottom: "16px",
      gap: "8px",
    },
  },
  logo: {
    width: "128px",
    height: "128px",
    "@media (max-width: 640px)": {
      width: "96px",
      height: "96px",
    },
  },
  titleGrade: {
    transform: "rotate(-3deg)",
    textDecoration: "underline",
    textDecorationColor: "#5f5f5f",
    textDecorationStyle: "double",
    display: "inline-block",
  },
  titleText: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "left",
  },
  topButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    marginTop: "24px",
    paddingLeft: "3px",
  },
  presetButton: {
    backgroundColor: "#f1f5f9",
    borderWidth: "1px",
    borderColor: "#e2e8f0",
    borderRadius: "12px",
    padding: "7px 14px",
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#475569",
    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "8px",
  },
  helpLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "20px",
    height: "20px",
    borderRadius: "10px",
    backgroundColor: "#007bff",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "bold",
    textDecorationLine: "none",
  },
  modeHelp: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "8px",
    marginTop: "8px",
    justifyContent: "center",
  },
  helpText: {
    fontSize: "0.8rem",
    color: "#64748b",
  },
  alertBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "12px",
    marginTop: "16px",
    padding: "12px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    borderWidth: "1px",
    borderColor: "#e2e8f0",
  },
  alertText: {
    fontSize: "0.85rem",
    color: "#475569",
    flex: 1,
  },
  section: {
    marginTop: "20px",
    paddingTop: "20px",
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
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#0056b3",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  inputRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    "@media (max-width: 640px)": {
      gap: "6px",
    },
  },
  inputColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  },
  separator: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#007bff",
    paddingTop: "20px",
    "@media (max-width: 640px)": {
      fontSize: "1.2rem",
      paddingTop: "16px",
    },
  },
  footer: {
    marginTop: "32px",
    paddingBottom: "24px",
    textAlign: "center",
  },
  footerText: {
    fontSize: "0.875rem",
    color: "#64748b",
  },
  link: {
    color: "#0056b3",
    textDecorationLine: "underline",
  },
});
