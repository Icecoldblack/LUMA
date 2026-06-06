import Logo from './Logo'

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <Logo href="#" />
          <div className="foot-links">
            <a href="#how">How it works</a>
            <a href="#demo">The feed</a>
            <a href="#digest">AI digest</a>
            <a href="#">Pricing</a>
            <a href="#">Privacy</a>
          </div>
        </div>
        <div className="foot-copy">© 2026 LUMA. Standups that sound human.</div>
      </div>
    </footer>
  )
}
