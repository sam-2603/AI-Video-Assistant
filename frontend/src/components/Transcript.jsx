export default function Transcript({ transcript }) {
  return (
    <div className="card" style={{ padding: 26 }}>
      <h3 style={{ marginBottom: 14 }}>Full Transcript</h3>
      <div
        className="scroll-panel"
        style={{
          maxHeight: 480,
          whiteSpace: "pre-wrap",
          color: "var(--text-secondary)",
          lineHeight: 1.75,
          fontSize: 14.5,
          paddingRight: 8,
        }}
      >
        {transcript}
      </div>
    </div>
  );
}
