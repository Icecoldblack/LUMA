import type { Analysis } from '../lib/analysis'

/** One teammate's standup card. */
export interface Entry {
  id: string
  name: string
  initials: string
  avatar: string
  time: string
  transcript: string
  analysis: Analysis
  source: 'backend' | 'local'
}
