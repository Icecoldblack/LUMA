import { useEffect, useRef, useState } from 'react'

/**
 * Fires once when the referenced element first crosses into view.
 * Returns a ref to attach and a boolean that flips true on entry.
 */
export function useInView<T extends Element>(threshold = 0.5) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true)
            io.disconnect()
          }
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return { ref, inView }
}
