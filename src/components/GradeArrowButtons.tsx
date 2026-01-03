import { css, html } from "react-strict-dom";

interface GradeArrowButtonsProps {
  value: number;
  onSmallIncrement: () => void;
  onSmallDecrement: () => void;
  onLargeIncrement: () => void;
  onLargeDecrement: () => void;
  smallStep?: number;
  largeStep?: number;
}

export function GradeArrowButtons({
  value,
  onSmallIncrement,
  onSmallDecrement,
  onLargeIncrement,
  onLargeDecrement,
  smallStep = 0.1,
  largeStep = 1,
}: GradeArrowButtonsProps) {
  return (
    <html.div style={styles.container}>
      <html.button
        onClick={onLargeDecrement}
        style={styles.button}
        aria-label={`Decrease grade by ${largeStep}`}
      >
        ≪
      </html.button>
      <html.button
        onClick={onSmallDecrement}
        style={styles.button}
        aria-label={`Decrease grade by ${smallStep}`}
      >
        ‹
      </html.button>
      <html.div style={styles.display}>
        <html.div style={styles.label}>Grade</html.div>
        <html.div style={styles.value}>{value.toFixed(1)}%</html.div>
      </html.div>
      <html.button
        onClick={onSmallIncrement}
        style={styles.button}
        aria-label={`Increase grade by ${smallStep}`}
      >
        ›
      </html.button>
      <html.button
        onClick={onLargeIncrement}
        style={styles.button}
        aria-label={`Increase grade by ${largeStep}`}
      >
        ≫
      </html.button>
    </html.div>
  );
}

const styles = css.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "16px",
    backgroundColor: "#f0f7ff",
    borderRadius: "12px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#bde2ff",
  },
  button: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    borderWidth: "2px",
    borderColor: "#0056b3",
    backgroundColor: "#ffffff",
    color: "#0056b3",
    fontSize: "1.5rem",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#bde2ff",
      borderColor: "#0056b3",
      transform: "scale(1.08)",
    },
    ":active": {
      backgroundColor: "#2196F3",
      color: "#ffffff",
      transform: "scale(0.95)",
    },
  },
  display: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    minWidth: "90px",
    padding: "8px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#007bff",
  },
  label: {
    fontSize: "0.75rem",
    color: "#0056b3",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  value: {
    fontSize: "1.75rem",
    fontWeight: "700",
    color: "#0056b3",
  },
});
