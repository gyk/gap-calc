import { css, html } from "react-strict-dom";

interface DigitDialProps {
  value: number | string;
  onIncrement: () => void;
  onDecrement: () => void;
  label?: string;
}

export function DigitDial({
  value,
  onIncrement,
  onDecrement,
  label,
}: DigitDialProps) {
  return (
    <html.div style={styles.container}>
      {label && <html.div style={styles.label}>{label}</html.div>}
      <html.div style={styles.dialBox}>
        <html.button
          onClick={onIncrement}
          style={styles.button}
          aria-label="Increment"
        >
          ▲
        </html.button>
        <html.div style={styles.value}>{value}</html.div>
        <html.button
          onClick={onDecrement}
          style={styles.button}
          aria-label="Decrement"
        >
          ▼
        </html.button>
      </html.div>
    </html.div>
  );
}

const styles = css.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "0 4px",
  },
  label: {
    fontSize: "0.75rem",
    color: "#0056b3",
    marginBottom: "4px",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  dialBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    borderWidth: "2px",
    borderColor: "#007bff",
    padding: "8px",
    boxShadow: "0 2px 8px rgba(0, 123, 255, 0.2)",
  },
  button: {
    backgroundColor: "transparent",
    borderWidth: 0,
    fontSize: "1.2rem",
    color: "#0056b3",
    cursor: "pointer",
    padding: "4px 8px",
    transitionProperty: "color",
    transitionDuration: "150ms",
    fontWeight: "600",
    ":hover": {
      color: "#007bff",
    },
  },
  value: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#0056b3",
    padding: "6px 0",
    minWidth: "1.5rem",
    textAlign: "center",
  },
});
