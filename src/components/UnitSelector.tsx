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
    margin: "8px 0",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "4px",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: "8px",
    padding: "2px",
  },
  button: {
    flex: 1,
    padding: "6px 12px",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#4b5563",
    backgroundColor: "transparent",
    borderWidth: 0,
    borderRadius: "6px",
    cursor: "pointer",
    textAlign: "center",
  },
  activeButton: {
    backgroundColor: "#ffffff",
    color: "#111827",
    boxShadow:
      "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  },
});
