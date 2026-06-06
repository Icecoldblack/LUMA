import { MOOD_EMOJI, MOOD_LABEL } from '../lib/analysis'
import type { Entry } from './types'

/** A single teammate's summary card: mood, one-line summary, blockers. */
export default function EntryCard({ entry }: { entry: Entry }) {
  const { analysis } = entry
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
        <div className={`mood-badge ${analysis.mood}`}>
          {MOOD_EMOJI[analysis.mood]} {MOOD_LABEL[analysis.mood]}
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
        <summary>Transcript · {entry.source === 'claude' ? 'Claude' : 'local'}</summary>
        <p>“{entry.transcript}”</p>
      </details>
    </div>
  )
}
