import { useEffect, useMemo, useState } from 'react'
import Reveal from './Reveal'
import { ArrowRight, PlayTriangle } from './icons'

const WAVE_BARS = 44

function HeroWave() {
  // Stable random delay/duration per bar, generated once.
  const bars = useMemo(
    () =>
      Array.from({ length: WAVE_BARS }, () => ({
        animationDelay: `${(Math.random() * 1.1).toFixed(2)}s`,
        animationDuration: `${(0.7 + Math.random() * 0.8).toFixed(2)}s`,
      })),
    [],
  )
  return (
    <div className="wave">
      {bars.map((style, i) => (
        <i key={i} style={style} />
      ))}
    </div>
  )
}

function useRecordTimer() {
  // Loops 0:00 → 0:15 the way the original recording demo does.
  const [t, setT] = useState(7)
  useEffect(() => {
    const id = window.setInterval(() => {
      setT((prev) => {
        const next = prev + 0.1
        return next > 15 ? 0 : next
      })
    }, 100)
    return () => window.clearInterval(id)
  }, [])

  const label = `0:${String(Math.floor(t)).padStart(2, '0')}`
  const pct = (t / 15) * 100
  return { label, pct }
}

function scrollToDemo() {
  const target = document.getElementById('demo')
  if (!target) return
  const y = target.getBoundingClientRect().top + window.scrollY - 80
  window.scrollTo({ top: y, behavior: 'smooth' })
}

export default function Hero() {
  const { label, pct } = useRecordTimer()

  return (
    <header className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <Reveal as="span" className="eyebrow">
            <span className="dot" />
            Async standups with personality
          </Reveal>
          <Reveal as="h1" style={{ marginTop: '22px' }}>
            Standups that <span className="accent">sound human.</span>
          </Reveal>
          <Reveal as="p" className="lead">
            Skip the wall of Slack text. Your team drops a 15-second voice note — LUMA
            transcribes every update, then reads the room: mood, wins, and blockers in one
            calm digest.
          </Reveal>
          <Reveal className="hero-cta">
            <a href="#cta" className="pill-btn btn-primary">
              Start free
              <ArrowRight />
            </a>
            <button type="button" className="pill-btn btn-ghost" onClick={scrollToDemo}>
              <PlayTriangle />
              Hear a sample
            </button>
          </Reveal>
          <Reveal className="trust">
            <div className="avatars">
              <i style={{ background: 'linear-gradient(135deg,#3a7d68,#2f5d4f)' }} />
              <i style={{ background: 'linear-gradient(135deg,#c2693f,#a8542f)' }} />
              <i style={{ background: 'linear-gradient(135deg,#6e9384,#4a6b5d)' }} />
              <i style={{ background: 'linear-gradient(135deg,#3a7d68,#235744)' }} />
            </div>
            <span>
              Trusted by <b style={{ color: 'var(--green-darker)' }}>2,400+</b> async teams
            </span>
          </Reveal>
        </div>

        <Reveal className="hero-visual">
          <div className="rec-card">
            <div className="float-tag ft-1">
              <span className="ic" style={{ background: 'rgba(47,93,79,.12)', color: 'var(--green)' }}>
                ✓
              </span>{' '}
              Transcribed instantly
            </div>
            <div className="float-tag ft-2">
              <span className="ic" style={{ background: 'rgba(194,105,63,.14)', color: 'var(--clay)' }}>
                ⚑
              </span>{' '}
              1 blocker flagged
            </div>
            <div className="rec-head">
              <div className="rec-user">
                <div className="av">MK</div>
                <div className="meta">
                  <b>Maya Kapoor</b>
                  <span>Recording today's update…</span>
                </div>
              </div>
              <div className="rec-live">
                <span className="ring" />
                LIVE
              </div>
            </div>
            <HeroWave />
            <div className="rec-foot">
              <div className="rec-timer">
                <span>{label}</span> <span className="max">/ 0:15</span>
              </div>
              <div className="rec-progress">
                <i style={{ width: `${pct}%` }} />
              </div>
              <button className="rec-btn" aria-label="Stop recording">
                <span className="sq" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </header>
  )
}
