import { css, html } from "react-strict-dom";

interface HillIndicatorProps {
  isUphill: boolean;
}

export function HillIndicator({ isUphill }: HillIndicatorProps) {
  return (
    <html.div style={styles.container}>
      <svg
        viewBox="0 0 100 80"
        style={styles.svg}
        aria-label={isUphill ? "Uphill" : "Downhill"}
      >
        {isUphill ? (
          // Uphill mountain
          <polyline
            points="10,70 35,30 50,45 70,15 90,70"
            stroke="#0056b3"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ) : (
          // Downhill mountain (flipped)
          <polyline
            points="10,15 30,45 45,30 70,70 90,70"
            stroke="#0056b3"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        )}
      </svg>
      <html.div style={styles.label}>
        {isUphill ? "Uphill" : "Downhill"}
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
  },
  svg: {
    width: "48px",
    height: "40px",
  },
  label: {
    fontSize: "0.75rem",
    color: "#0056b3",
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
