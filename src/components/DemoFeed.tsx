import Digest from './Digest'
import Note, { type NoteData } from './Note'
import Reveal from './Reveal'

const NOTES: NoteData[] = [
  {
    initials: 'MK',
    avatar: 'linear-gradient(135deg,#3a7d68,#2f5d4f)',
    name: 'Maya Kapoor',
    role: 'Design · 9:02 AM',
    mood: '🌿',
    duration: '0:14',
    text: [
      { t: 'Wrapped the onboarding flow — ' },
      { t: 'shipping it to staging today.', bold: true },
      { t: ' Feeling good, no blockers on my end.' },
    ],
  },
  {
    initials: 'DR',
    avatar: 'linear-gradient(135deg,#c2693f,#a8542f)',
    name: 'Diego Rivas',
    role: 'Engineering · 9:08 AM',
    mood: '😬',
    duration: '0:15',
    text: [
      { t: 'Still ' },
      { t: 'blocked on the API keys', bold: true },
      { t: " from the platform team — can't finish the integration until those land." },
    ],
  },
  {
    initials: 'SL',
    avatar: 'linear-gradient(135deg,#6e9384,#4a6b5d)',
    name: 'Sana Lund',
    role: 'Product · 9:11 AM',
    mood: '🙂',
    duration: '0:12',
    text: [
      { t: 'Customer interviews went great — ' },
      { t: 'three signups want the beta.', bold: true },
      { t: ' Writing up notes this afternoon.' },
    ],
  },
]

export default function DemoFeed() {
  return (
    <section id="demo">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="eyebrow">Today on the team</span>
          <h2>A standup you can hear, read, and skim.</h2>
          <p>
            Every voice note sits in one calm feed — play it, read the transcript, or let
            the digest catch you up.
          </p>
        </Reveal>
        <div className="demo-grid">
          <div className="feed">
            {NOTES.map((note) => (
              <Reveal key={note.name}>
                <Note data={note} />
              </Reveal>
            ))}
          </div>
          <Digest />
        </div>
      </div>
    </section>
  )
}
