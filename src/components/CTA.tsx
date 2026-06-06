import Reveal from './Reveal'
import { ArrowRight } from './icons'

export default function CTA() {
  return (
    <section className="cta-sec" id="cta">
      <Reveal className="wrap cta-inner">
        <h2>Give your standup a voice.</h2>
        <p>
          Set up your team in two minutes. The first 14 days are on us — no card, no live
          meetings required.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#" className="pill-btn btn-on-green">
            Start free
            <ArrowRight />
          </a>
          <a
            href="#"
            className="pill-btn"
            style={{ background: 'rgba(253,252,246,0.14)', color: '#fdfcf6' }}
          >
            Book a demo
          </a>
        </div>
        <p className="cta-note">Works with Slack, Teams, and email. Your team will thank you.</p>
      </Reveal>
    </section>
  )
}
