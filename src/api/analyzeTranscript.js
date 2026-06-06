// Person 3 owns the prompt tuning — this is the integration contract.
// Returns: { mood: string, blockers: string[], summary: string }
// mood must be one of: "great" | "good" | "neutral" | "stressed" | "blocked"

export async function analyzeTranscript(transcript) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: `Analyze this team standup transcript and return JSON only.

Transcript: "${transcript}"

Return this exact JSON shape:
{
  "mood": "great" | "good" | "neutral" | "stressed" | "blocked",
  "blockers": ["blocker 1", "blocker 2"],
  "summary": "one sentence summary"
}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content[0].text.trim();

  return JSON.parse(text);
}
