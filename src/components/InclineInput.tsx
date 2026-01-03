import { css, html } from "react-strict-dom";
import { useGapStore } from "../store/useGapStore";
import type { RiseUnit, RunUnit, VertSpeedUnit } from "../types/gap";
import { DigitDial } from "./DigitDial";
import { GradeArrowButtons } from "./GradeArrowButtons";
import { HillIndicator } from "./HillIndicator";
import { UnitSelector } from "./UnitSelector";

export function InclineInput() {
  const {
    hillInputMode,
    gradeInput,
    angleInput,
    riseRunInput,
    vertSpeedInput,
    setGradeInput,
    setAngleInput,
    setRiseRunInput,
    setVertSpeedInput,
  } = useGapStore();

  // Determine if uphill based on current input mode
  let isUphill = true;
  if (hillInputMode === "grade") {
    isUphill = gradeInput.percent >= 0;
  } else if (hillInputMode === "angle") {
    isUphill = angleInput.degrees >= 0;
  } else if (hillInputMode === "rise/run") {
    isUphill = riseRunInput.rise >= 0;
  }

  const renderGradeInput = () => (
    <html.div style={styles.gradeRow}>
      <HillIndicator isUphill={isUphill} />
      <GradeArrowButtons
        value={gradeInput.percent}
        onSmallIncrement={() => setGradeInput(gradeInput.percent + 0.1)}
        onSmallDecrement={() => setGradeInput(gradeInput.percent - 0.1)}
        onLargeIncrement={() => setGradeInput(gradeInput.percent + 1)}
        onLargeDecrement={() => setGradeInput(gradeInput.percent - 1)}
        smallStep={0.1}
        largeStep={1}
      />
    </html.div>
  );

  const renderAngleInput = () => (
    <html.div style={styles.row}>
      <HillIndicator isUphill={isUphill} />
      <DigitDial
        label="Degrees"
        value={angleInput.degrees.toFixed(1)}
        onIncrement={() =>
          setAngleInput(Number((angleInput.degrees + 0.1).toFixed(1)))
        }
        onDecrement={() =>
          setAngleInput(Number((angleInput.degrees - 0.1).toFixed(1)))
        }
      />
    </html.div>
  );

  const renderRiseRunInput = () => (
    <html.div style={styles.column}>
      <html.div style={styles.row}>
        <HillIndicator isUphill={isUphill} />
        <html.div style={styles.riseRunContainer}>
          <html.div style={styles.row}>
            <DigitDial
              label="Rise"
              value={riseRunInput.rise}
              onIncrement={() =>
                setRiseRunInput(
                  riseRunInput.rise + 1,
                  riseRunInput.run,
                  riseRunInput.riseUnit,
                  riseRunInput.runUnit,
                )
              }
              onDecrement={() =>
                setRiseRunInput(
                  riseRunInput.rise - 1,
                  riseRunInput.run,
                  riseRunInput.riseUnit,
                  riseRunInput.runUnit,
                )
              }
            />
            <UnitSelector<RiseUnit>
              options={["feet", "meters"]}
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
          <html.div style={styles.row}>
            <DigitDial
              label="Run"
              value={riseRunInput.run}
              onIncrement={() =>
                setRiseRunInput(
                  riseRunInput.rise,
                  riseRunInput.run + 1,
                  riseRunInput.riseUnit,
                  riseRunInput.runUnit,
                )
              }
              onDecrement={() =>
                setRiseRunInput(
                  riseRunInput.rise,
                  riseRunInput.run - 1,
                  riseRunInput.riseUnit,
                  riseRunInput.runUnit,
                )
              }
            />
            <UnitSelector<RunUnit>
              options={["mi", "km"]}
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

  const renderVertSpeedInput = () => (
    <html.div style={styles.column}>
      <html.div style={styles.row}>
        <DigitDial
          label="Vert Speed"
          value={vertSpeedInput.value}
          onIncrement={() =>
            setVertSpeedInput(vertSpeedInput.value + 50, vertSpeedInput.unit)
          }
          onDecrement={() =>
            setVertSpeedInput(vertSpeedInput.value - 50, vertSpeedInput.unit)
          }
        />
      </html.div>
      <UnitSelector<VertSpeedUnit>
        options={["ft/hr", "m/hr"]}
        value={vertSpeedInput.unit}
        onChange={(unit) => setVertSpeedInput(vertSpeedInput.value, unit)}
      />
    </html.div>
  );

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
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "8px",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
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
  },
});
