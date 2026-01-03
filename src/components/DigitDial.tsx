import { html } from "react-strict-dom";

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

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "0 4px",
  },
  label: {
    fontSize: "0.75rem",
    color: "#6b7280",
    marginBottom: "4px",
    textTransform: "uppercase",
  },
  dialBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    borderWidth: "1px",
    borderColor: "#d1d5db",
    padding: "4px",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  },
  button: {
    backgroundColor: "transparent",
    borderWidth: 0,
    fontSize: "1rem",
    color: "#3b82f6",
    cursor: "pointer",
    padding: "4px 8px",
    transitionProperty: "color",
    transitionDuration: "150ms",
  },
  value: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#111827",
    padding: "4px 0",
    minWidth: "1.5rem",
    textAlign: "center",
  },
} as const;
