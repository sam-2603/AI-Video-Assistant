// export default function SummaryCard({ summary }) {
//   return (
//     <div className="card" style={{ padding: 26 }}>
//       <h3 style={{ marginBottom: 14 }}>Summary</h3>
//       <div style={{ whiteSpace: "pre-wrap", color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15 }}>
//         {summary}
//       </div>
//     </div>
//   );
// }
import ReactMarkdown from "react-markdown";

export default function SummaryCard({ summary }) {
  return (
    <div className="card" style={{ padding: 26 }}>
      <h3 style={{ marginBottom: 14 }}>Summary</h3>

      <div
        className="markdown-content"
        style={{
          color: "var(--text-secondary)",
          lineHeight: 1.7,
          fontSize: 15,
        }}
      >
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>
    </div>
  );
}