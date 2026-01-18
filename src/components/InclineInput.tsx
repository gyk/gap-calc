import { css, html } from "react-strict-dom";
import { useIsMobile } from "../hooks/useIsMobile";
import { useGapStore } from "../store/useGapStore";
import type { RiseUnit, RunUnit, VertSpeedUnit } from "../types/gap";
import { getUnitOptions } from "../utils/unitOptions";
import { DigitDial } from "./DigitDial";
import { GradeArrowButtons } from "./GradeArrowButtons";
import { HillIndicator } from "./HillIndicator";
import { UnitSelector } from "./UnitSelector";

export function InclineInput() {
  const isMobile = useIsMobile();
  const {
    unitSystem,
    hillInputMode,
    gradeInput,
    angleInput,
    riseRunInput,
    vertSpeedInput,
    hillDirection,
    setGradeInput,
    setAngleInput,
    setRiseRunInput,
    setVertSpeedInput,
    setHillDirection,
  } = useGapStore();

  const riseUnitOptions = getUnitOptions(unitSystem, ["meters"], ["feet"]);
  const runUnitOptions = getUnitOptions(unitSystem, ["km"], ["mi"]);
  const vertSpeedUnitOptions = getUnitOptions(unitSystem, ["m/hr"], ["ft/hr"]);

  // Determine if uphill based on current input mode
  let isUphill = hillDirection === "uphill";
  if (hillInputMode === "grade") {
    isUphill = gradeInput.percent >= 0;
  } else if (hillInputMode === "angle") {
    isUphill = angleInput.degrees >= 0;
  } else if (hillInputMode === "rise/run") {
    isUphill = riseRunInput.rise >= 0;
  }

  const toggleDirection = () => {
    const newDirection = hillDirection === "uphill" ? "downhill" : "uphill";
    setHillDirection(newDirection);
  };

  const renderGradeInput = () => (
    <html.div style={isMobile ? styles.columnCenter : styles.gradeRow}>
      <HillIndicator isUphill={isUphill} onToggle={toggleDirection} />
      <GradeArrowButtons
        value={gradeInput.percent}
        onSmallIncrement={() => setGradeInput(gradeInput.percent + 1)}
        onSmallDecrement={() => setGradeInput(gradeInput.percent - 1)}
        onLargeIncrement={() => setGradeInput(gradeInput.percent + 3)}
        onLargeDecrement={() => setGradeInput(gradeInput.percent - 3)}
        smallStep={1}
        largeStep={3}
      />
    </html.div>
  );

  const renderAngleInput = () => {
    const degrees = angleInput.degrees;
    const whole = Math.floor(degrees);
    const decimal = Math.round((degrees - whole) * 10);

    const updateDecimal = (newDecimal: number) => {
      const newValue = whole + newDecimal / 10;
      setAngleInput(Number(newValue.toFixed(1)));
    };

    return (
      <html.div style={styles.row}>
        <HillIndicator isUphill={isUphill} onToggle={toggleDirection} />
        <html.div style={styles.dialRow}>
          <DigitDial
            label="Deg"
            value={whole}
            onIncrement={() => setAngleInput(degrees + 1)}
            onDecrement={() => setAngleInput(degrees - 1)}
          />
          <html.div style={styles.separator}>.</html.div>
          <DigitDial
            label=".1"
            value={decimal}
            onIncrement={() => updateDecimal((decimal + 1) % 10)}
            onDecrement={() => updateDecimal((decimal + 9) % 10)}
          />
        </html.div>
      </html.div>
    );
  };

  const renderRiseRunInput = () => {
    const rise = riseRunInput.rise;

    const runVal = riseRunInput.run;
    const runWhole = Math.floor(runVal);
    const runDecimal = Math.round((runVal - runWhole) * 10);

    const updateRun = (newWhole: number, newDecimal: number) => {
      const newRun = newWhole + newDecimal / 10;
      // Prevent run from being 0
      if (newRun === 0) return;
      setRiseRunInput(
        riseRunInput.rise,
        Number(newRun.toFixed(1)),
        riseRunInput.riseUnit,
        riseRunInput.runUnit,
      );
    };

    return (
      <html.div style={styles.column}>
        <html.div style={styles.row}>
          <HillIndicator isUphill={isUphill} onToggle={toggleDirection} />
          <html.div style={styles.riseRunContainer}>
            <html.div style={isMobile ? styles.columnCenter : styles.row}>
              <DigitDial
                label="Rise"
                value={rise}
                onIncrement={() =>
                  setRiseRunInput(
                    rise + 1,
                    riseRunInput.run,
                    riseRunInput.riseUnit,
                    riseRunInput.runUnit,
                  )
                }
                onDecrement={() =>
                  setRiseRunInput(
                    rise - 1,
                    riseRunInput.run,
                    riseRunInput.riseUnit,
                    riseRunInput.runUnit,
                  )
                }
              />
              <UnitSelector<RiseUnit>
                options={riseUnitOptions}
                value={riseRunInput.riseUnit}
                onChange={(unit) =>
                  setRiseRunInput(
                    riseRunInput.rise,
                    riseRunInput.run,
                    unit,
                    riseRunInput.runUnit,
                  )
                }
              />
            </html.div>
            <html.div style={isMobile ? styles.columnCenter : styles.dialRow}>
              <html.div style={styles.dialRow}>
                <DigitDial
                  label="Run"
                  value={runWhole}
                  onIncrement={() => updateRun(runWhole + 1, runDecimal)}
                  onDecrement={() =>
                    updateRun(Math.max(0, runWhole - 1), runDecimal)
                  }
                />
                <html.div style={styles.separator}>.</html.div>
                <DigitDial
                  label=".1"
                  value={runDecimal}
                  onIncrement={() => updateRun(runWhole, (runDecimal + 1) % 10)}
                  onDecrement={() => updateRun(runWhole, (runDecimal + 9) % 10)}
                />
              </html.div>
              <UnitSelector<RunUnit>
                options={runUnitOptions}
                value={riseRunInput.runUnit}
                onChange={(unit) =>
                  setRiseRunInput(
                    riseRunInput.rise,
                    riseRunInput.run,
                    riseRunInput.riseUnit,
                    unit,
                  )
                }
              />
            </html.div>
          </html.div>
        </html.div>
      </html.div>
    );
  };

  const renderVertSpeedInput = () => {
    const value = vertSpeedInput.value;
    const hundreds = Math.floor(value / 100);
    const ones = Math.round(value - hundreds * 100);

    const updateOnes = (newOnes: number) => {
      const newValue = hundreds * 100 + newOnes;
      setVertSpeedInput(newValue, vertSpeedInput.unit);
    };

    return (
      <html.div style={styles.column}>
        <html.div style={styles.row}>
          <HillIndicator isUphill={isUphill} onToggle={toggleDirection} />
          <html.div style={styles.dialRow}>
            <DigitDial
              label="100"
              value={hundreds}
              onIncrement={() =>
                setVertSpeedInput(value + 100, vertSpeedInput.unit)
              }
              onDecrement={() =>
                setVertSpeedInput(value - 100, vertSpeedInput.unit)
              }
            />
            <DigitDial
              label="Vert Speed"
              value={ones.toString().padStart(2, "0")}
              onIncrement={() => updateOnes((ones + 1) % 100)}
              onDecrement={() => updateOnes((ones + 99) % 100)}
            />
          </html.div>
          <UnitSelector<VertSpeedUnit>
            options={vertSpeedUnitOptions}
            value={vertSpeedInput.unit}
            onChange={(unit) => setVertSpeedInput(vertSpeedInput.value, unit)}
          />
        </html.div>
      </html.div>
    );
  };

  return (
    <html.div style={styles.container}>
      {hillInputMode === "grade" && renderGradeInput()}
      {hillInputMode === "angle" && renderAngleInput()}
      {hillInputMode === "rise/run" && renderRiseRunInput()}
      {hillInputMode === "vert speed" && renderVertSpeedInput()}
    </html.div>
  );
}

const styles = css.create({
  container: {
    padding: "16px",
    backgroundColor: "#f0f7ff",
    borderRadius: "12px",
    borderWidth: "1px",
    borderColor: "#bde2ff",
    marginTop: "12px",
    "@media (max-width: 640px)": {
      padding: "8px",
    },
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "8px",
    "@media (max-width: 640px)": {
      gap: "6px",
    },
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  columnCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "8px",
  },
  riseRunContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  gradeRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    marginBottom: "8px",
    "@media (max-width: 640px)": {
      gap: "8px",
    },
  },
  dialRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  separator: {
    fontSize: "1.5rem",
    fontWeight: "800",
    color: "#007bff",
    marginHorizontal: "2px",
    paddingTop: "24px",
  },
});
