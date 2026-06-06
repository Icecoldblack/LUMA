import { useInView } from '../hooks/useInView'

const SEGMENTS = [
  { cls: 'good', w: 64 },
  { cls: 'ok', w: 24 },
  { cls: 'low', w: 12 },
] as const

export default function MoodMeter() {
  // Bars fill from 0 → target the first time the meter scrolls into view.
  const { ref, inView } = useInView<HTMLDivElement>(0.4)

  return (
    <div className="mood-meter" ref={ref}>
      <div className="mm-top">
        <span>Team mood today</span>
        <b>Mostly upbeat 🌿</b>
      </div>
      <div className="mood-bar">
        {SEGMENTS.map((s) => (
          <i key={s.cls} className={s.cls} style={{ width: inView ? `${s.w}%` : 0 }} />
        ))}
      </div>
      <div className="mood-legend">
        <span>
          <i style={{ background: 'var(--sage-soft)' }} />
          Positive 64%
        </span>
        <span>
          <i style={{ background: '#c9b890' }} />
          Neutral 24%
        </span>
        <span>
          <i style={{ background: 'var(--clay)' }} />
          Strained 12%
        </span>
      </div>
    </div>
  )
}
