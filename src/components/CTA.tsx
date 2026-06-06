import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { ArrowRight } from './icons'

export default function CTA() {
  return (
    <section className="cta-sec" id="cta">
      <Reveal className="wrap cta-inner">
        <h2>Give your standup a voice.</h2>
        <p>
          No sign-up, no setup — record a 15-second update and watch LUMA pull out the mood,
          the wins, and the blockers in real time.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/standup" className="pill-btn btn-on-green">
            Let's get started
            <ArrowRight />
          </Link>
        </div>
        <p className="cta-note">Runs right in your browser. Your voice never leaves the page.</p>
      </Reveal>
    </section>
  )
}
