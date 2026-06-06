import { useCallback, useEffect, useRef, useState } from 'react'
import { MOOD_EMOJI, MOOD_LABEL } from '../lib/analysis'
import type { Entry } from './types'

function SpeakButton({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false)
  const uttRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Clean up if the card unmounts mid-speech
  useEffect(() => () => { window.speechSynthesis.cancel() }, [])

  const toggle = useCallback(() => {
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }

    const utt = new SpeechSynthesisUtterance(text)
    utt.rate = 0.95
    utt.pitch = 1
    utt.onend = () => setSpeaking(false)
    utt.onerror = () => setSpeaking(false)
    uttRef.current = utt
    window.speechSynthesis.speak(utt)
    setSpeaking(true)
  }, [speaking, text])

  if (!('speechSynthesis' in window)) return null

  return (
    <button
      type="button"
      className={`speak-btn ${speaking ? 'speaking' : ''}`}
      onClick={toggle}
      aria-label={speaking ? 'Stop speaking' : 'Read summary aloud'}
      title={speaking ? 'Stop' : 'Read aloud'}
    >
      {speaking ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <rect x="5" y="4" width="4" height="16" rx="1" />
          <rect x="15" y="4" width="4" height="16" rx="1" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  )
}

export default function EntryCard({ entry }: { entry: Entry }) {
  const { analysis } = entry

  const speakText = [
    analysis.summary,
    analysis.blockers.length > 0
      ? 'Blockers: ' + analysis.blockers.join('. ')
      : '',
  ].filter(Boolean).join('. ')

  return (
    <div className="entry-card">
      <div className="entry-top">
        <div className="av" style={{ background: entry.avatar }}>
          {entry.initials}
        </div>
        <div className="who">
          <b>{entry.name}</b>
          <span>{entry.time}</span>
        </div>
        <div className="entry-top-right">
          <SpeakButton text={speakText} />
          <div className={`mood-badge ${analysis.mood}`}>
            {MOOD_EMOJI[analysis.mood]} {MOOD_LABEL[analysis.mood]}
          </div>
        </div>
      </div>

      <p className="entry-summary">{analysis.summary}</p>

      {analysis.blockers.length > 0 && (
        <div className="entry-blockers">
          <span className="blockers-label">⚑ Blockers</span>
          <ul>
            {analysis.blockers.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      )}

      <details className="entry-transcript">
        <summary>Transcript · {entry.source === 'backend' ? 'Luma' : 'local'}</summary>
        <p>"{entry.transcript}"</p>
      </details>
    </div>
  )
}
