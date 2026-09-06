import { useState } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Results from "./pages/Results";
import { processVideoUrl, processVideoUpload } from "./services/api";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // { session_id, title, summary, transcript, action_items, key_decisions, open_questions }

  async function handleSubmit(input) {
    setError("");
    setLoading(true);
    try {
      const data =
        input.type === "url"
          ? await processVideoUrl({ source: input.source, language: input.language })
          : await processVideoUpload({ file: input.file, language: input.language });
      setResult(data);
    } catch (err) {
      setError(err.message || "Video processing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleHome() {
    setResult(null);
    setError("");
  }

  return (
    <>
      <Header onHome={handleHome} hasResult={!!result} />
      {result ? (
        <Results result={result} />
      ) : (
        <Home onSubmit={handleSubmit} loading={loading} error={error} />
      )}
    </>
  );
}
