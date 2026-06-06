// Returns: { mood: string, blockers: string[], summary: string }
// mood must be one of: "great" | "good" | "neutral" | "stressed" | "blocked"

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export async function analyzeTranscript(transcript) {
  const response = await fetch(`${API_BASE}/api/analyze-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error ?? `API error: ${response.status}`);
  }

  return response.json();
}
