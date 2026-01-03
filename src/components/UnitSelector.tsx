import { css, html } from "react-strict-dom";

interface UnitSelectorProps<T extends string> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
}

export function UnitSelector<T extends string>({
  options,
  value,
  onChange,
  label,
}: UnitSelectorProps<T>) {
  return (
    <html.div style={styles.container}>
      {label && <html.div style={styles.label}>{label}</html.div>}
      <html.div style={styles.buttonGroup}>
        {options.map((option) => (
          <html.button
            key={option}
            onClick={() => onChange(option)}
            style={[styles.button, value === option && styles.activeButton]}
          >
            {option}
          </html.button>
        ))}
      </html.div>
    </html.div>
  );
}

const styles = css.create({
  container: {
    display: "flex",
    flexDirection: "column",
    margin: "12px 0",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: "700",
    color: "#0056b3",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "row",
    gap: "4px",
    backgroundColor: "#f0f7ff",
    borderRadius: "10px",
    padding: "4px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#bde2ff",
  },
  button: {
    flex: 1,
    padding: "10px 16px",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#0056b3",
    backgroundColor: "transparent",
    borderWidth: 0,
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.2s ease",
    minWidth: "50px",
  },
  activeButton: {
    backgroundColor: "#007bff",
    color: "#ffffff",
    boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)",
  },
});
