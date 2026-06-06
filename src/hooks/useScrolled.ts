import { useEffect, useState } from 'react'

/** True once the page has scrolled past `threshold` px. Drives the nav border. */
export function useScrolled(threshold = 20): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}
