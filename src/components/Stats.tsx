import Counter from './Counter'
import Reveal from './Reveal'

const STATS = [
  { to: 15, suffix: 's', label: "Per update — that's the whole standup" },
  { to: 92, suffix: '%', label: 'Skip the live meeting entirely' },
  { to: 4, suffix: 'h', label: 'Saved per person, every week' },
  { to: 2400, suffix: '+', label: 'Teams talking instead of typing' },
]

export default function Stats() {
  return (
    <div className="stats">
      <div className="wrap stats-grid">
        {STATS.map((s) => (
          <Reveal className="stat" key={s.label}>
            <Counter to={s.to} suffix={s.suffix} />
            <span>{s.label}</span>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
