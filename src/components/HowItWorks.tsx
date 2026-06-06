import Reveal from './Reveal'
import { Connector, LinesIcon, MicIcon, StarIcon } from './icons'
import type { ReactNode } from 'react'

interface Step {
  num: string
  icon: ReactNode
  title: string
  body: string
  connector: boolean
}

const STEPS: Step[] = [
  {
    num: 'STEP 01',
    icon: <MicIcon />,
    title: 'Record',
    body: 'Tap once and talk for fifteen seconds. No template, no pressure — just your honest update in your own voice.',
    connector: true,
  },
  {
    num: 'STEP 02',
    icon: <LinesIcon />,
    title: 'Transcribe',
    body: 'LUMA turns every voice note into clean, searchable text in seconds — names, projects, and dates all caught accurately.',
    connector: true,
  },
  {
    num: 'STEP 03',
    icon: <StarIcon />,
    title: 'Summarize',
    body: "One digest lands in your channel: the team's mood, the wins worth celebrating, and the blockers that need a nudge.",
    connector: false,
  },
]

export default function HowItWorks() {
  return (
    <section className="how" id="how">
      <div className="wrap">
        <Reveal className="sec-head center">
          <span className="eyebrow">How it works</span>
          <h2>Three taps from talking to a team digest.</h2>
          <p>
            No new habits to learn. Talk like you'd talk in the hallway — LUMA handles the
            rest.
          </p>
        </Reveal>
        <div className="steps">
          {STEPS.map((step, i) => (
            <Reveal className="step" key={step.title} delay={Math.min(i, 5) * 0.06}>
              <div className="step-num">{step.num}</div>
              <div className="step-ic">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              {step.connector && <Connector />}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
