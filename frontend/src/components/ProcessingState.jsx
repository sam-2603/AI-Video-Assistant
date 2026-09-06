import { useEffect, useState } from "react";

const STAGES = [
  "Preparing audio...",
  "Transcribing...",
  "Generating summary...",
  "Extracting insights...",
  "Building AI knowledge base...",
];

export default function ProcessingState() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((i) => (i + 1 < STAGES.length ? i + 1 : i));
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card" style={styles.card}>
      <div style={styles.spinner} aria-hidden="true" />
      <h3 style={{ marginTop: 18 }}>{STAGES[stageIndex]}</h3>
      <p style={{ marginTop: 8, textAlign: "center" }}>
        This can take a few minutes depending on video length. Don't close this tab.
      </p>
      <ul style={styles.stageList}>
        {STAGES.map((stage, i) => (
          <li
            key={stage}
            style={{
              ...styles.stageItem,
              color: i <= stageIndex ? "var(--text-primary)" : "var(--text-muted)",
            }}
          >
            <span
              style={{
                ...styles.dot,
                background: i < stageIndex ? "var(--success)" : i === stageIndex ? "var(--accent)" : "var(--border)",
              }}
            />
            {stage}
          </li>
        ))}
      </ul>
      <style>{`
        @keyframes vspin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const styles = {
  card: {
    padding: 40,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: 460,
    margin: "0 auto",
  },
  spinner: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    border: "3px solid var(--border)",
    borderTopColor: "var(--accent)",
    animation: "vspin 0.9s linear infinite",
  },
  stageList: {
    listStyle: "none",
    padding: 0,
    margin: "24px 0 0",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: "100%",
  },
  stageItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 14,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    flexShrink: 0,
  },
};
