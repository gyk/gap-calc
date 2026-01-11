import { ReactNode } from "react";
import { css, html } from "react-strict-dom";

interface CollapsibleSectionProps {
  title: string;
  isCollapsed: boolean;
  onToggle: () => void;
  children: ReactNode;
  rightContent?: ReactNode;
}

export function CollapsibleSection({
  title,
  isCollapsed,
  onToggle,
  children,
  rightContent,
}: CollapsibleSectionProps) {
  return (
    <html.div style={styles.section}>
      <html.div style={styles.headerContainer}>
        <html.button
          style={styles.header}
          onClick={onToggle}
          aria-expanded={!isCollapsed}
        >
          <html.span style={styles.title}>{title}</html.span>
          <html.span style={styles.arrow}>{isCollapsed ? "▷" : "▼"}</html.span>
        </html.button>
        {rightContent && (
          <html.div style={styles.rightContent}>{rightContent}</html.div>
        )}
      </html.div>
      {!isCollapsed && <html.div style={styles.content}>{children}</html.div>}
    </html.div>
  );
}

const styles = css.create({
  section: {
    marginTop: "24px",
    paddingTop: "24px",
    borderTopWidth: "1px",
    borderColor: "#f1f5f9",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "transparent",
    borderWidth: "0px",
    padding: "0px",
    cursor: "pointer",
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#0056b3",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    ":hover": {
      opacity: 0.8,
    },
  },
  arrow: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "20px",
    height: "20px",
    fontSize: "0.8rem",
    transition: "transform 0.2s ease",
  },
  title: {
    flex: 1,
    textAlign: "left",
  },
  rightContent: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  content: {
    marginTop: "16px",
  },
});
