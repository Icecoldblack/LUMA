import type { Entry } from './types'
import type { Mood } from '../lib/analysis'

const SEGMENTS: { mood: Mood; cls: string; label: string }[] = [
  { mood: 'positive', cls: 'good', label: 'Positive' },
  { mood: 'neutral', cls: 'ok', label: 'Neutral' },
  { mood: 'strained', cls: 'low', label: 'Strained' },
]

/** Aggregates every card into one team-wide mood snapshot. */
export default function TeamMood({ entries }: { entries: Entry[] }) {
  const total = entries.length
  const counts: Record<Mood, number> = { positive: 0, neutral: 0, strained: 0 }
  for (const e of entries) counts[e.analysis.mood]++
  const blockerCount = entries.reduce((n, e) => n + e.analysis.blockers.length, 0)

  const pct = (mood: Mood) => (total ? Math.round((counts[mood] / total) * 100) : 0)

  const headline =
    total === 0
      ? 'No updates yet'
      : counts.strained > counts.positive
        ? 'The team is feeling the strain'
        : counts.positive >= total / 2
          ? 'The team is in good shape'
          : 'A mixed day across the team'

  return (
    <div className="team-snapshot">
      <div className="snap-head">
        <span className="label">Team mood snapshot</span>
        <span className="count">
          {total} update{total === 1 ? '' : 's'}
        </span>
      </div>
      <h3>
        {headline}
        {total > 0 && (blockerCount > 0 ? ` · ${blockerCount} blocker${blockerCount === 1 ? '' : 's'} to clear` : ' · no blockers')}
      </h3>

      <div className="mood-bar">
        {SEGMENTS.map((s) => (
          <i key={s.cls} className={s.cls} style={{ width: `${pct(s.mood)}%` }} />
        ))}
      </div>
      <div className="mood-legend">
        {SEGMENTS.map((s) => (
          <span key={s.cls}>
            <i className={`swatch ${s.cls}`} />
            {s.label} {pct(s.mood)}%
          </span>
        ))}
      </div>
    </div>
  )
}
