import { css, html } from "react-strict-dom";
import type { HillDirectionUI } from "../types/gap";

interface HillIndicatorProps {
  direction: HillDirectionUI;
  onToggle?: () => void;
}

export function HillIndicator({ direction, onToggle }: HillIndicatorProps) {
  // <svg> element is not currently supported on native.
  // See https://github.com/facebook/react-strict-dom/issues/4
  return (
    <html.div
      style={[styles.container, onToggle && styles.clickable]}
      onClick={onToggle}
    >
      <svg
        viewBox="0 0 100 80"
        style={styles.svg}
        role="img"
        aria-label={
          direction === "uphill"
            ? "Uphill"
            : direction === "downhill"
              ? "Downhill"
              : "Flat"
        }
      >
        <title>
          {direction === "uphill"
            ? "Uphill"
            : direction === "downhill"
              ? "Downhill"
              : "Flat"}
        </title>
        {direction === "uphill" ? (
          // Uphill mountain
          <polyline
            points="10,70 35,30 50,45 70,15 90,60"
            stroke="#0056b3"
            strokeWidth="10"
            fill="none"
          />
        ) : direction === "downhill" ? (
          // Downhill mountain (flipped)
          <polyline
            points="10,15 30,45 45,35 60,60 80,60"
            stroke="#0056b3"
            strokeWidth="8"
            fill="none"
          />
        ) : (
          // Flat line
          <polyline
            points="20,40 80,40"
            stroke="#0056b3"
            strokeWidth="8"
            fill="none"
          />
        )}
      </svg>
      <html.div style={styles.label}>
        {direction === "uphill"
          ? "Uphill"
          : direction === "downhill"
            ? "Downhill"
            : "Flat"}
      </html.div>
    </html.div>
  );
}

const styles = css.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    width: "56px",
    "@media (max-width: 640px)": {
      width: "44px",
    },
  },
  clickable: {
    cursor: "pointer",
  },
  svg: {
    width: "40px",
    height: "40px",
    "@media (max-width: 640px)": {
      width: "32px",
      height: "32px",
    },
  },
  label: {
    width: "100%",
    textAlign: "center",
    fontSize: "0.75rem",
    color: "#0056b3",
    fontWeight: "600",
    textTransform: "uppercase",
    "@media (max-width: 640px)": {
      fontSize: "0.65rem",
    },
  },
});
