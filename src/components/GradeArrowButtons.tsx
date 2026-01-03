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
    gap: "8px",
    padding: "12px",
  },
  button: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    borderWidth: "1px",
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
    color: "#334155",
    fontSize: "1.25rem",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#f3f4f6",
      borderColor: "#9ca3af",
    },
    ":active": {
      backgroundColor: "#e5e7eb",
    },
  },
  display: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px",
    minWidth: "70px",
  },
  label: {
    fontSize: "0.75rem",
    color: "#6b7280",
    fontWeight: "500",
    textTransform: "uppercase",
  },
  value: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#0f172a",
  },
});
