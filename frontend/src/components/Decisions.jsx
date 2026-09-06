// export default function Decisions({ decisions }) {
//   return (
//     <div className="card" style={{ padding: 26 }}>
//       <h3 style={{ marginBottom: 14 }}>Key Decisions</h3>
//       <div style={{ whiteSpace: "pre-wrap", color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15 }}>
//         {decisions}
//       </div>
//     </div>
//   );
// }
import ReactMarkdown from "react-markdown";

export default function Decisions({ decisions }) {
  return (
    <div className="card" style={{ padding: 26 }}>
      <h3 style={{ marginBottom: 14 }}>Key Decisions</h3>

      <div
        className="markdown-content"
        style={{
          color: "var(--text-secondary)",
          lineHeight: 1.7,
          fontSize: 15,
        }}
      >
        <ReactMarkdown>{decisions}</ReactMarkdown>
      </div>
    </div>
  );
}