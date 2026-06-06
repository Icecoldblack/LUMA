import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import StandupPage from './pages/StandupPage'

/**
 * Two pages:
 *   /          → LandingPage  — marketing site, "Let's get started" → /standup
 *   /standup   → StandupPage  — the working app: record → transcribe → analyze
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/standup" element={<StandupPage />} />
    </Routes>
  )
}
