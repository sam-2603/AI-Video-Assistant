import { useRef, useState } from "react";

export default function VideoInput({ onSubmit, disabled }) {
  const [mode, setMode] = useState("url"); // "url" | "upload"
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("english");
  const [localError, setLocalError] = useState("");
  const fileInputRef = useRef(null);

  function handleFileChange(e) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setLocalError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLocalError("");

    if (mode === "url") {
      const trimmed = url.trim();
      if (!trimmed) {
        setLocalError("Enter a YouTube URL to continue.");
        return;
      }
      if (!/^https?:\/\/.+/i.test(trimmed)) {
        setLocalError("That doesn't look like a valid URL. It should start with http:// or https://");
        return;
      }
      onSubmit({ type: "url", source: trimmed, language });
      return;
    }

    if (!file) {
      setLocalError("Choose an audio or video file to upload.");
      return;
    }
    onSubmit({ type: "upload", file, language });
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={styles.card}>
      <div style={styles.modeRow}>
        <button
          type="button"
          onClick={() => setMode("url")}
          style={{ ...styles.modeBtn, ...(mode === "url" ? styles.modeBtnActive : {}) }}
        >
          YouTube URL
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          style={{ ...styles.modeBtn, ...(mode === "upload" ? styles.modeBtnActive : {}) }}
        >
          Upload file
        </button>
      </div>

      {mode === "url" ? (
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          disabled={disabled}
          style={styles.input}
        />
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          style={styles.dropzone}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,audio/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
            disabled={disabled}
          />
          {file ? (
            <span style={{ color: "var(--text-primary)" }}>{file.name}</span>
          ) : (
            <span>Click to choose an audio or video file</span>
          )}
        </button>
      )}

      <div style={styles.langRow}>
        <span style={styles.langLabel}>Language</span>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { id: "english", label: "English" },
            { id: "hinglish", label: "Hinglish" },
          ].map((opt) => (
            <button
              type="button"
              key={opt.id}
              onClick={() => setLanguage(opt.id)}
              disabled={disabled}
              style={{
                ...styles.langBtn,
                ...(language === opt.id ? styles.langBtnActive : {}),
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {localError && <p style={styles.error}>{localError}</p>}

      <button type="submit" className="btn-primary" disabled={disabled} style={{ width: "100%" }}>
        Analyze Video
      </button>
    </form>
  );
}

const styles = {
  card: {
    padding: 26,
    display: "flex",
    flexDirection: "column",
    gap: 18,
    boxShadow: "var(--shadow-1)",
  },
  modeRow: {
    display: "flex",
    gap: 6,
    background: "var(--surface-raised)",
    padding: 4,
    borderRadius: 10,
  },
  modeBtn: {
    flex: 1,
    padding: "9px 12px",
    borderRadius: 8,
    border: "none",
    background: "transparent",
    color: "var(--text-secondary)",
    fontWeight: 500,
    fontSize: 14,
  },
  modeBtnActive: {
    background: "var(--surface-hover)",
    color: "var(--text-primary)",
  },
  input: {
    padding: "13px 14px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border)",
    background: "var(--surface-raised)",
    color: "var(--text-primary)",
    fontSize: 15,
  },
  dropzone: {
    padding: "22px 14px",
    borderRadius: "var(--radius-sm)",
    border: "1px dashed var(--border)",
    background: "var(--surface-raised)",
    color: "var(--text-secondary)",
    fontSize: 14,
    textAlign: "center",
  },
  langRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  langLabel: {
    fontSize: 13,
    color: "var(--text-secondary)",
  },
  langBtn: {
    padding: "7px 14px",
    borderRadius: 999,
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--text-secondary)",
    fontSize: 13,
    fontWeight: 500,
  },
  langBtnActive: {
    borderColor: "var(--accent-soft-border)",
    background: "var(--accent-soft)",
    color: "var(--accent-strong)",
  },
  error: {
    color: "var(--danger)",
    fontSize: 13,
    margin: 0,
  },
};
