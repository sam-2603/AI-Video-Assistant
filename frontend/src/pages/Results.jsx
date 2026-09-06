import { useState } from "react";
import SummaryCard from "../components/SummaryCard";
import ActionItems from "../components/ActionItems";
import Decisions from "../components/Decisions";
import Questions from "../components/Questions";
import Transcript from "../components/Transcript";
import Chat from "../components/Chat";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "transcript", label: "Transcript" },
  { id: "actions", label: "Action Items" },
  { id: "decisions", label: "Decisions" },
  { id: "questions", label: "Questions" },
  { id: "chat", label: "AI Chat" },
];

export default function Results({ result }) {
  const [tab, setTab] = useState("overview");

  return (
    <div style={styles.wrap}>
      <div style={styles.titleRow}>
        <span style={styles.eyebrow}>Ready</span>
        <h2 style={styles.title}>{result.title}</h2>
      </div>

      <div style={styles.tabRow}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              ...styles.tabBtn,
              ...(tab === t.id ? styles.tabBtnActive : {}),
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={styles.panel}>
        {tab === "overview" && (
          <div style={styles.stack}>
            <SummaryCard summary={result.summary} />
            <ActionItems actionItems={result.action_items} />
            <Decisions decisions={result.key_decisions} />
            <Questions questions={result.open_questions} />
          </div>
        )}
        {tab === "transcript" && <Transcript transcript={result.transcript} />}
        {tab === "actions" && <ActionItems actionItems={result.action_items} />}
        {tab === "decisions" && <Decisions decisions={result.key_decisions} />}
        {tab === "questions" && <Questions questions={result.open_questions} />}
        {tab === "chat" && <Chat sessionId={result.session_id} />}
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    flex: 1,
    maxWidth: 900,
    width: "100%",
    margin: "0 auto",
    padding: "40px 24px 100px",
  },
  titleRow: {
    marginBottom: 26,
  },
  eyebrow: {
    fontSize: 12,
    color: "var(--success)",
    fontWeight: 500,
  },
  title: {
    fontSize: 28,
    marginTop: 6,
  },
  tabRow: {
    display: "flex",
    gap: 6,
    overflowX: "auto",
    borderBottom: "1px solid var(--border-soft)",
    marginBottom: 24,
    paddingBottom: 2,
  },
  tabBtn: {
    padding: "10px 4px",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    color: "var(--text-secondary)",
    fontSize: 14.5,
    fontWeight: 500,
    whiteSpace: "nowrap",
    marginRight: 18,
  },
  tabBtnActive: {
    color: "var(--text-primary)",
    borderBottomColor: "var(--accent)",
  },
  panel: {
    minHeight: 200,
  },
  stack: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
};
