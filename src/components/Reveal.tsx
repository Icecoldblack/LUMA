import {
  createElement,
  useEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from 'react'

interface RevealProps {
  /** Tag to render. Defaults to a <div>. */
  as?: ElementType
  className?: string
  /** Stagger delay in seconds, matching the original min(i,5)*0.06 cadence. */
  delay?: number
  children?: ReactNode
  [prop: string]: unknown
}

/**
 * Scroll-reveal wrapper. Adds the `in` class when the element enters the
 * viewport (IntersectionObserver, threshold 0.12), then locks it to its final
 * visible state so it never flickers back out.
 */
export default function Reveal({
  as = 'div',
  className = '',
  delay = 0,
  children,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const show = () => {
      if (el.dataset.shown) return
      el.dataset.shown = '1'
      el.classList.add('in')
      io.disconnect()
      window.setTimeout(() => {
        el.style.transition = 'none'
        el.style.opacity = '1'
        el.style.transform = 'none'
      }, 1100)
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) show()
      },
      { threshold: 0.12 },
    )
    io.observe(el)

    // Reveal anything already in view on mount.
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.95 && r.bottom > 0) show()

    return () => io.disconnect()
  }, [])

  return createElement(
    as,
    {
      ref,
      className: `reveal ${className}`.trim(),
      style: { transitionDelay: `${delay}s` },
      ...rest,
    },
    children,
  )
}
