import { useEffect, useRef, useState } from "react";
import { sendChatMessage } from "../services/api";
import ReactMarkdown from "react-markdown";

export default function Chat({ sessionId }) {
  const [messages, setMessages] = useState([]); // { role: 'user'|'assistant', text }
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    const question = input.trim();
    if (!question || loading) return;

    setError("");
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendChatMessage({ sessionId, question });
      setMessages((prev) => [...prev, { role: "assistant", text: res.answer }]);
    } catch (err) {
      setError(err.message || "Chat request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", height: 560 }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-soft)" }}>
        <h3>Chat with your video</h3>
        <p style={{ marginTop: 4, fontSize: 13.5 }}>
          Ask questions about the content of this video.
        </p>
      </div>

      <div ref={scrollRef} className="scroll-panel" style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        {messages.length === 0 && (
          <div style={{ margin: "auto", textAlign: "center", color: "var(--text-muted)", maxWidth: 280 }}>
            <p>No questions yet. Try asking "What were the main decisions?" or "Summarize the second half."</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "78%",
              background: m.role === "user" ? "var(--accent-soft)" : "var(--surface-raised)",
              border: `1px solid ${m.role === "user" ? "var(--accent-soft-border)" : "var(--border)"}`,
              borderRadius: 14,
              padding: "10px 14px",
              fontSize: 14.5,
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
              color: "var(--text-primary)",
            }}
          >
            {/* {m.text} */}
            <ReactMarkdown>{m.text}</ReactMarkdown>
          </div>
        ))}

        {loading && (
          <div
            style={{
              alignSelf: "flex-start",
              background: "var(--surface-raised)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: "10px 14px",
              color: "var(--text-secondary)",
              fontSize: 14,
            }}
          >
            Thinking...
          </div>
        )}
      </div>

      {error && (
        <div style={{ padding: "0 24px 8px", color: "var(--danger)", fontSize: 13 }}>{error}</div>
      )}

      <div style={{ display: "flex", gap: 10, padding: 16, borderTop: "1px solid var(--border-soft)" }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder="Ask something about the video..."
          rows={1}
          style={{
            flex: 1,
            resize: "none",
            padding: "11px 14px",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--surface-raised)",
            color: "var(--text-primary)",
            fontSize: 14.5,
          }}
        />
        <button className="btn-primary" onClick={handleSend} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}
