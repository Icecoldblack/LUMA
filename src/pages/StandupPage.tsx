import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import Recorder from '../components/Recorder'
import EntryCard from '../components/EntryCard'
import TeamMood from '../components/TeamMood'
import { localAnalyze } from '../lib/analysis'
import type { Entry } from '../components/types'

function seedEntries(): Entry[] {
  const maya =
    'Wrapped the onboarding flow and shipped it to staging today. Feeling good, no blockers on my end.'
  const diego =
    "Still blocked on the API keys from the platform team. I can't finish the integration until those land."
  return [
    {
      id: 'seed-maya',
      name: 'Maya Kapoor',
      initials: 'MK',
      avatar: 'linear-gradient(135deg,#3a7d68,#2f5d4f)',
      time: '9:02 AM',
      transcript: maya,
      analysis: localAnalyze(maya),
      source: 'local',
    },
    {
      id: 'seed-diego',
      name: 'Diego Rivas',
      initials: 'DR',
      avatar: 'linear-gradient(135deg,#c2693f,#a8542f)',
      time: '9:08 AM',
      transcript: diego,
      analysis: localAnalyze(diego),
      source: 'local',
    },
  ]
}

export default function StandupPage() {
  const [entries, setEntries] = useState<Entry[]>(seedEntries)

  function addEntry(entry: Entry) {
    setEntries((prev) => [entry, ...prev])
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="wrap app-header-inner">
          <Link to="/" className="logo-link">
            <Logo href="/" />
          </Link>
          <Link to="/" className="back-link">
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="wrap app-main">
        <div className="page-intro">
          <span className="eyebrow">
            <span className="dot" />
            Live standup
          </span>
          <h1>Record your update.</h1>
          <p>
            Hit record and talk for a few seconds. Your browser transcribes it, then it's
            analyzed for mood, blockers, and a one-line summary — each teammate gets a card,
            and the whole team rolls up at the bottom.
          </p>
        </div>

        <Recorder count={entries.length} onAdd={addEntry} />

        <section className="entries-section">
          <h2 className="section-title">Today's updates</h2>
          <div className="entries-grid">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </section>

        <TeamMood entries={entries} />
      </main>
    </div>
  )
}
