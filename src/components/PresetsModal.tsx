import { css, html } from "react-strict-dom";
import { PRESETS, type Preset } from "../logic/presets";
import { useGapStore } from "../store/useGapStore";

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PresetsModal({ isOpen, onClose }: PresetsModalProps) {
  const { applyPreset, unitSystem } = useGapStore();

  if (!isOpen) return null;

  const handleSelectPreset = (preset: Preset) => {
    applyPreset(preset.inclinePercent, preset.speedMph);
    onClose();
  };

  return (
    <html.div style={styles.overlay} onClick={onClose}>
      <html.div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <html.div style={styles.header}>
          <html.h2 style={styles.title}>Treadmill Presets</html.h2>
          <html.button style={styles.closeButton} onClick={onClose}>
            ✕
          </html.button>
        </html.div>
        <html.div style={styles.content}>
          {PRESETS.map((preset) => (
            <html.button
              key={preset.id}
              style={styles.presetItem}
              onClick={() => handleSelectPreset(preset)}
            >
              <html.div style={styles.presetInfo}>
                <html.div style={styles.presetName}>{preset.name}</html.div>
                <html.div style={styles.presetDescription}>
                  {unitSystem === "metric"
                    ? `${preset.inclinePercent}% incline, ${(
                        preset.speedMph * 1.609344
                      ).toFixed(1)}\u00A0km/h`
                    : preset.description}
                </html.div>
              </html.div>
            </html.button>
          ))}
        </html.div>
      </html.div>
    </html.div>
  );
}

const styles = css.create({
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 20,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 12,
    width: "100%",
    maxWidth: 500,
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    overflow: "hidden",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderBottomStyle: "solid",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 0,
    color: "#333",
  },
  closeButton: {
    backgroundColor: "transparent",
    borderWidth: 0,
    fontSize: 24,
    cursor: "pointer",
    color: "#999",
    padding: 4,
  },
  content: {
    padding: 8,
    overflowY: "auto",
  },
  presetItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    width: "100%",
    textAlign: "left",
    backgroundColor: "transparent",
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    borderBottomStyle: "solid",
    cursor: "pointer",
    transitionProperty: "background-color",
    transitionDuration: "0.2s",
  },
  presetInfo: {
    flex: 1,
  },
  presetName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007bff",
    marginBottom: 4,
  },
  presetDescription: {
    fontSize: 14,
    color: "#666",
  },
});
