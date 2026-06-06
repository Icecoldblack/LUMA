const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Takes a transcript string, returns { mood, blockers, summary }
// mood: "great" | "good" | "neutral" | "stressed" | "blocked"
async function analyzeText(transcript) {
  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 512,
    system: 'You are a standup transcript analyzer. Respond with valid JSON only — no markdown, no prose, no code fences.',
    messages: [{
      role: 'user',
      content: `Analyze this standup transcript and return JSON matching this shape exactly:
{
  "mood": "great" | "good" | "neutral" | "stressed" | "blocked",
  "blockers": ["<items explicitly blocking progress>"],
  "summary": "<one sentence describing what was accomplished or is in progress>"
}

Mood guide:
- great: high energy, explicit wins, no concerns
- good: positive progress, minor or no concerns
- neutral: routine updates, mixed or unclear sentiment
- stressed: pressure or uncertainty — but no explicit blocker
- blocked: something is explicitly preventing progress

Rules:
- blockers: only list items explicitly called out as blocking. If none, return [].
- summary: one sentence, max 20 words, factual.

Transcript:
---
${transcript}
---`,
    }],
  });

  const raw = message.content[0].text
    .trim()
    .replace(/^```(?:json)?\n?/, '')
    .replace(/\n?```$/, '');

  return JSON.parse(raw);
}

module.exports = { analyzeText };
