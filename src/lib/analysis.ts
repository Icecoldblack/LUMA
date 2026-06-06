// Import from the client subpath (not the index barrel) — the barrel pulls in
// the Node-only agent-toolset, which can't bundle for the browser.
import { Anthropic } from '@anthropic-ai/sdk/client'

export type Mood = 'positive' | 'neutral' | 'strained'

export interface Analysis {
  mood: Mood
  /** One-line summary of the update. */
  summary: string
  /** Zero or more blockers the person mentioned. */
  blockers: string[]
}

export interface AnalysisOutcome {
  analysis: Analysis
  /** Which engine produced it. */
  source: 'claude' | 'local'
  /** Present when Claude was requested but fell back to local. */
  note?: string
}

export const MOOD_EMOJI: Record<Mood, string> = {
  positive: '🌿',
  neutral: '🙂',
  strained: '😬',
}

export const MOOD_LABEL: Record<Mood, string> = {
  positive: 'Positive',
  neutral: 'Neutral',
  strained: 'Strained',
}

const ANALYSIS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    mood: {
      type: 'string',
      enum: ['positive', 'neutral', 'strained'],
      description: "The speaker's overall mood in this update.",
    },
    summary: {
      type: 'string',
      description: 'A single concise sentence summarizing the update.',
    },
    blockers: {
      type: 'array',
      items: { type: 'string' },
      description: 'Each distinct blocker mentioned, phrased briefly. Empty if none.',
    },
  },
  required: ['mood', 'summary', 'blockers'],
}

const SYSTEM_PROMPT =
  'You read a single teammate\'s spoken standup update and extract structured signal. ' +
  'Return the speaker\'s mood, a one-line summary in their voice, and any blockers they mention. ' +
  'A blocker is anything stopping or slowing their progress (waiting on someone, a bug, missing access). ' +
  'If there are no blockers, return an empty list. Keep the summary to one sentence.'

/** Real Claude call. Runs in the browser with the user's own key. */
async function analyzeWithClaude(transcript: string, apiKey: string): Promise<Analysis> {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Here is the standup update:\n\n"${transcript}"`,
      },
    ],
    output_config: {
      format: { type: 'json_schema', schema: ANALYSIS_SCHEMA },
    },
  })

  const text = response.content.find((b) => b.type === 'text')
  if (!text || text.type !== 'text') {
    throw new Error('No text returned from Claude')
  }
  const parsed = JSON.parse(text.text) as Analysis
  return normalize(parsed)
}

const BLOCKER_CUES = [
  'blocked',
  'blocker',
  'stuck',
  'waiting on',
  'waiting for',
  "can't",
  'cannot',
  "couldn't",
  'unable',
  'issue',
  'problem',
  'bug',
  'broken',
  'failing',
  'need help',
  'depends on',
  'no access',
]

const NEGATIVE_CUES = [
  'frustrat',
  'stressed',
  'overwhelmed',
  'behind',
  'struggl',
  'worried',
  'annoyed',
  'tired',
  'slow',
  ...BLOCKER_CUES,
]

const POSITIVE_CUES = [
  'shipped',
  'done',
  'finished',
  'wrapped',
  'great',
  'good',
  'excited',
  'happy',
  'landed',
  'launched',
  'progress',
  'on track',
  'nailed',
  'solved',
  'win',
]

/** Heuristic fallback so the app works with zero setup. */
export function localAnalyze(transcript: string): Analysis {
  const text = transcript.toLowerCase()
  const sentences = transcript
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)

  const blockers = sentences.filter((s) =>
    BLOCKER_CUES.some((cue) => s.toLowerCase().includes(cue)),
  )

  const positives = POSITIVE_CUES.filter((c) => text.includes(c)).length
  const negatives = NEGATIVE_CUES.filter((c) => text.includes(c)).length

  let mood: Mood = 'neutral'
  if (blockers.length > 0 || negatives > positives) mood = 'strained'
  else if (positives > 0) mood = 'positive'

  const summary = sentences[0]
    ? sentences[0].slice(0, 140)
    : transcript.slice(0, 140) || 'No update captured.'

  return { mood, summary, blockers: blockers.slice(0, 3) }
}

function normalize(a: Analysis): Analysis {
  const mood: Mood = ['positive', 'neutral', 'strained'].includes(a.mood)
    ? a.mood
    : 'neutral'
  return {
    mood,
    summary: (a.summary || '').trim() || 'No update captured.',
    blockers: Array.isArray(a.blockers) ? a.blockers.filter(Boolean) : [],
  }
}

/**
 * Analyze a transcript. Uses Claude when an API key is provided, otherwise the
 * local heuristic. Never throws — on a Claude error it falls back to local and
 * reports why via `note`.
 */
export async function analyzeStandup(
  transcript: string,
  apiKey?: string,
): Promise<AnalysisOutcome> {
  if (apiKey) {
    try {
      return { analysis: await analyzeWithClaude(transcript, apiKey), source: 'claude' }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return {
        analysis: localAnalyze(transcript),
        source: 'local',
        note: `Claude request failed (${message}). Analyzed locally instead.`,
      }
    }
  }
  return { analysis: localAnalyze(transcript), source: 'local' }
}
