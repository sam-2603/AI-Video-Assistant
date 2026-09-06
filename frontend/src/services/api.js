const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function handleResponse(res) {
  let body = null;
  try {
    body = await res.json();
  } catch {
    // Non-JSON response (e.g. gateway error page) — fall through below.
  }

  if (!res.ok) {
    const message =
      (body && body.detail) ||
      `Request failed with status ${res.status}. Please try again.`;
    throw new Error(message);
  }

  return body;
}

export async function checkHealth() {
  const res = await fetch(`${API_URL}/api/health`);
  return handleResponse(res);
}

export async function processVideoUrl({ source, language }) {
  const res = await fetch(`${API_URL}/api/process`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source, language }),
  });
  return handleResponse(res);
}

export async function processVideoUpload({ file, language }) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("language", language);

  const res = await fetch(`${API_URL}/api/process-upload`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(res);
}

export async function sendChatMessage({ sessionId, question }) {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, question }),
  });
  return handleResponse(res);
}
