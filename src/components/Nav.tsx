import { useScrolled } from '../hooks/useScrolled'
import Logo from './Logo'

export default function Nav() {
  const scrolled = useScrolled(20)

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <div className="wrap nav-inner">
        <Logo href="#" />
        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#demo">The feed</a>
          <a href="#digest">AI digest</a>
          <a href="#">Pricing</a>
        </div>
        <div className="nav-cta">
          <a
            href="#"
            className="nav-links"
            style={{ display: 'flex', fontWeight: 500, color: 'var(--ink-soft)' }}
          >
            Log in
          </a>
          <a href="#cta" className="pill-btn btn-primary" style={{ padding: '11px 20px' }}>
            Start free
          </a>
        </div>
      </div>
    </nav>
  )
}
