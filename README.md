# LUMA

Make collaboration feel human again.

LUMA lets teammates do a quick voice check-in and surfaces how everyone is feeling — mood, blockers, and a team-wide snapshot — so your team stays connected without another meeting.

## How it works

1. Hit record → Browser captures your voice via Web Speech API
2. Transcript is sent to Claude (Anthropic API) → extracts mood, blockers, and a one-line summary
3. Each teammate gets a summary card showing their current state
4. A team-wide mood snapshot aggregates everyone at the bottom

## Tech stack

- **Frontend**: React, scaffolded with Lovable
- **AI**: Anthropic API (Claude) — mood + blocker extraction from transcript text
- **Speech**: Web Speech API (`SpeechRecognition`) — no library needed
- **Storage**: React state (in-memory, no backend)

## Project structure

```
src/
  api/analyzeTranscript.js   # Anthropic API call → { mood, blockers, summary }
  hooks/useTeamState.js      # App-wide teammate state + update functions
  state/teammates.js         # Hardcoded fake teammates for demo
  utils/aggregateMood.js     # Rolls up individual moods into team snapshot
```

## Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root:
   ```
   VITE_ANTHROPIC_API_KEY=your_key_here
   ```

3. Run the dev server:
   ```bash
   npm run dev
   ```

## Team

Built at a hackathon with a 2:30 PM ET deadline. 4 people, parallel workstreams, no sleep.
