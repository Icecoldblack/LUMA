import { useEffect, useRef, useState } from 'react'
import { useInView } from '../hooks/useInView'

interface CounterProps {
  to: number
  suffix?: string
  duration?: number
}

/** Counts up from 0 to `to` with an ease-out curve the first time it scrolls into view. */
export default function Counter({ to, suffix = '', duration = 1400 }: CounterProps) {
  const { ref, inView } = useInView<HTMLElement>(0.5)
  const [display, setDisplay] = useState('0')
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!inView) return

    const format = (n: number) =>
      to >= 1000 ? Math.floor(n).toLocaleString() : String(Math.floor(n))

    const start = performance.now()
    const frame = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      if (p < 1) {
        setDisplay(format(to * eased) + suffix)
        rafRef.current = requestAnimationFrame(frame)
      } else {
        setDisplay((to >= 1000 ? to.toLocaleString() : to) + suffix)
      }
    }
    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
  }, [inView, to, suffix, duration])

  return <b ref={ref}>{display}</b>
}
