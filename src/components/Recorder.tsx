import { useState } from 'react'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { analyzeStandup } from '../lib/analysis'
import type { Entry } from './types'

const AVATARS = [
  'linear-gradient(135deg,#3a7d68,#2f5d4f)',
  'linear-gradient(135deg,#c2693f,#a8542f)',
  'linear-gradient(135deg,#6e9384,#4a6b5d)',
  'linear-gradient(135deg,#3a7d68,#235744)',
]

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'YOU'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

interface RecorderProps {
  count: number
  onAdd: (entry: Entry) => void
}

export default function Recorder({ count, onAdd }: RecorderProps) {
  const { supported, listening, transcript, setTranscript, start, stop, reset, error } =
    useSpeechRecognition()
  const [name, setName] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [note, setNote] = useState<string | null>(null)

  const canSubmit = transcript.trim().length > 0 && !analyzing

  async function handleSubmit() {
    if (!canSubmit) return
    if (listening) stop()
    setAnalyzing(true)
    setNote(null)

    const text = transcript.trim()
    const outcome = await analyzeStandup(text)
    const displayName = name.trim() || 'You'

    const entry: Entry = {
      id: crypto.randomUUID(),
      name: displayName,
      initials: initialsOf(displayName),
      avatar: AVATARS[count % AVATARS.length],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      transcript: text,
      analysis: outcome.analysis,
      source: outcome.source,
    }

    onAdd(entry)

    // Persist to backend (fire-and-forget — failure is non-blocking)
    fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teammateId: entry.id,
        transcript: entry.transcript,
        mood: entry.analysis.mood,
        summary: entry.analysis.summary,
        blockers: entry.analysis.blockers,
      }),
    }).catch(() => {})

    if (outcome.note) setNote(outcome.note)
    reset()
    setAnalyzing(false)
  }

  return (
    <div className="recorder">
      <div className="recorder-row">
        <input
          className="name-input"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Your name"
        />
        <span className="engine-tag on">Luma analysis</span>
      </div>

      <div className="record-stage">
        <button
          type="button"
          className={`record-toggle ${listening ? 'live' : ''}`}
          onClick={listening ? stop : start}
          disabled={!supported || analyzing}
          aria-pressed={listening}
        >
          {listening ? (
            <span className="sq" />
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4" />
            </svg>
          )}
        </button>
        <div className="record-label">
          {listening ? (
            <span className="rec-on">
              <span className="ring" /> Listening… tap to stop
            </span>
          ) : supported ? (
            'Tap to record your update'
          ) : (
            'Voice capture is unavailable in this browser — type your update below'
          )}
        </div>
      </div>

      <textarea
        className="transcript-box"
        placeholder="Your words appear here as you speak. You can also type or edit."
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        rows={4}
      />

      {error && <p className="recorder-msg err">Mic error: {error}</p>}
      {note && <p className="recorder-msg warn">{note}</p>}

      <button
        type="button"
        className="pill-btn btn-primary submit-btn"
        onClick={handleSubmit}
        disabled={!canSubmit}
      >
        {analyzing ? 'Analyzing…' : 'Add to standup'}
      </button>
    </div>
  )
}
