import { Link } from 'react-router-dom'
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
        </div>
        <div className="nav-cta">
          <Link to="/standup" className="pill-btn btn-primary" style={{ padding: '11px 20px' }}>
            Let's get started
          </Link>
        </div>
      </div>
    </nav>
  )
}
