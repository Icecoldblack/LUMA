import MoodMeter from './MoodMeter'
import Reveal from './Reveal'
import { SparkIcon } from './icons'

export default function Digest() {
  return (
    <div id="digest">
      <Reveal className="digest">
        <div className="digest-head">
          <div className="label">
            <span className="spark">
              <SparkIcon />
            </span>
            LUMA Digest
          </div>
          <span className="date">Today · 9:15 AM</span>
        </div>
        <h3>The team's in good shape — one blocker to clear.</h3>

        <MoodMeter />

        <div className="digest-row">
          <div className="ic win">🎉</div>
          <div className="body">
            <b>Wins worth celebrating</b>
            <p>
              <strong>Maya</strong> shipped onboarding to staging, and <strong>Sana</strong>{' '}
              landed three beta signups from customer interviews.
            </p>
          </div>
        </div>
        <div className="digest-divider" />
        <div className="digest-row">
          <div className="ic block">⚑</div>
          <div className="body">
            <b>Needs a nudge</b>
            <p>
              <strong>Diego</strong> is blocked on API keys from the platform team — the
              integration can't move until those arrive.
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
