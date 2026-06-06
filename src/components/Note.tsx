import { useMemo, useRef, type MouseEvent } from 'react'
import { PlaySmall } from './icons'

const WAVE_BARS = 32

export interface NoteData {
  initials: string
  avatar: string
  name: string
  role: string
  mood: string
  duration: string
  text: ReactNodeText[]
}

/** Transcript runs — plain strings render normally, bolded ones get <b>. */
export type ReactNodeText = { t: string; bold?: boolean }

const baseHeight = (idx: number) =>
  Math.min(100, 20 + Math.abs(Math.sin(idx * 0.7)) * 80 + Math.random() * 15)

export default function Note({ data }: { data: NoteData }) {
  // Fixed base heights so the resting waveform is stable across renders.
  const base = useMemo(
    () => Array.from({ length: WAVE_BARS }, (_, i) => baseHeight(i)),
    [],
  )
  const barsRef = useRef<HTMLSpanElement>(null)
  const playingRef = useRef(false)
  const rafRef = useRef<number>(0)

  const bars = () =>
    barsRef.current ? Array.from(barsRef.current.children) as HTMLElement[] : []

  const play = () => {
    if (playingRef.current) return
    playingRef.current = true
    let f = 0
    const loop = () => {
      f++
      bars().forEach((b, idx) => {
        const h = 20 + Math.abs(Math.sin((idx + f * 0.5) * 0.6)) * 75
        b.style.height = `${h}%`
      })
      if (playingRef.current) rafRef.current = requestAnimationFrame(loop)
    }
    loop()
  }

  const stop = () => {
    playingRef.current = false
    cancelAnimationFrame(rafRef.current)
    bars().forEach((b, idx) => {
      b.style.height = `${Math.min(100, 20 + Math.abs(Math.sin(idx * 0.7)) * 80)}%`
    })
  }

  const toggle = (e: MouseEvent) => {
    e.stopPropagation()
    playingRef.current ? stop() : play()
  }

  return (
    <div className="note" onMouseEnter={play} onMouseLeave={stop}>
      <div className="note-top">
        <div className="av" style={{ background: data.avatar }}>
          {data.initials}
        </div>
        <div className="who">
          <b>{data.name}</b>
          <span>{data.role}</span>
        </div>
        <div className="mood">{data.mood}</div>
      </div>
      <div className="note-play">
        <button className="play-btn" aria-label="Play" onClick={toggle}>
          <PlaySmall />
        </button>
        <span className="mini-wave" ref={barsRef}>
          {base.map((h, i) => (
            <i key={i} style={{ height: `${h}%` }} />
          ))}
        </span>
        <span className="dur">{data.duration}</span>
      </div>
      <p className="note-txt">
        “
        {data.text.map((run, i) =>
          run.bold ? <b key={i}>{run.t}</b> : <span key={i}>{run.t}</span>,
        )}
        ”
      </p>
    </div>
  )
}
