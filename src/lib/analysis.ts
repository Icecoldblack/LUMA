export type Mood = 'positive' | 'neutral' | 'strained'

export interface Analysis {
  mood: Mood
  summary: string
  blockers: string[]
}

export interface AnalysisOutcome {
  analysis: Analysis
  source: 'backend' | 'local'
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

const BLOCKER_CUES = [
  'blocked', 'blocker', 'stuck', 'waiting on', 'waiting for',
  "can't", 'cannot', "couldn't", 'unable', 'issue', 'problem',
  'bug', 'broken', 'failing', 'need help', 'depends on', 'no access',
]
const NEGATIVE_CUES = [
  'frustrat', 'stressed', 'overwhelmed', 'behind', 'struggl',
  'worried', 'annoyed', 'tired', 'slow', ...BLOCKER_CUES,
]
const POSITIVE_CUES = [
  'shipped', 'done', 'finished', 'wrapped', 'great', 'good',
  'excited', 'happy', 'landed', 'launched', 'progress', 'on track',
  'nailed', 'solved', 'win',
]

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
  const mood: Mood = ['positive', 'neutral', 'strained'].includes(a.mood) ? a.mood : 'neutral'
  return {
    mood,
    summary: (a.summary || '').trim() || 'No update captured.',
    blockers: Array.isArray(a.blockers) ? a.blockers.filter(Boolean) : [],
  }
}

async function analyzeWithBackend(transcript: string): Promise<Analysis> {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`)
  }

  const data = await res.json() as Analysis & { transcript?: string }
  return normalize(data)
}

export async function analyzeStandup(transcript: string): Promise<AnalysisOutcome> {
  try {
    const analysis = await analyzeWithBackend(transcript)
    return { analysis, source: 'backend' }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return {
      analysis: localAnalyze(transcript),
      source: 'local',
      note: `Backend unavailable (${message}). Analyzed locally instead.`,
    }
  }
}
