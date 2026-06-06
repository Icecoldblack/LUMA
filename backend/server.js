require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const os = require('os');
const Groq = require('groq-sdk');
const { analyzeText } = require('./analyzeText');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// In-memory store
const checkins = [];

const teammates = [
  { id: '1', name: 'Alex Chen', role: 'Frontend', avatar: '👩‍💻' },
  { id: '2', name: 'Jordan Park', role: 'Backend', avatar: '👨‍💻' },
  { id: '3', name: 'Sam Rivera', role: 'Design', avatar: '🎨' },
];

app.get('/api/teammates', (req, res) => {
  const result = teammates.map(t => ({
    ...t,
    latestCheckin: checkins.filter(c => c.teammateId === t.id).at(-1) ?? null,
  }));
  res.json(result);
});

// POST /api/analyze — base64 audio → transcript → mood analysis
app.post('/api/analyze', async (req, res) => {
  const { audioBase64, mimeType = 'audio/webm' } = req.body;

  if (!audioBase64) {
    return res.status(400).json({ error: 'audioBase64 is required' });
  }

  const ext = mimeType.includes('mp4') ? 'mp4' : mimeType.includes('ogg') ? 'ogg' : 'webm';
  const tempPath = path.join(os.tmpdir(), `luma-${Date.now()}.${ext}`);

  try {
    fs.writeFileSync(tempPath, Buffer.from(audioBase64, 'base64'));

    // Step 1: transcribe
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(tempPath),
      model: 'whisper-large-v3-turbo',
      response_format: 'json',
      language: 'en',
    });

    const transcript = transcription.text?.trim();
    if (!transcript) {
      return res.status(422).json({ error: 'Could not transcribe — try speaking louder or longer.' });
    }

    // Step 2: mood analysis
    let analysis;
    try {
      analysis = await analyzeText(transcript);
    } catch {
      return res.status(500).json({ error: 'Analysis failed — Claude returned malformed JSON' });
    }

    res.json({ transcript, ...analysis });
  } catch (err) {
    console.error('[/api/analyze]', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  }
});

// POST /api/checkin — save analyzed check-in
app.post('/api/checkin', (req, res) => {
  const { teammateId, transcript, mood, moodScore, summary, blockers, wins } = req.body;
  if (!teammateId) return res.status(400).json({ error: 'teammateId required' });

  const checkin = {
    id: Date.now().toString(),
    teammateId,
    transcript: transcript ?? '',
    mood: mood ?? 'neutral',
    moodScore: moodScore ?? 3,
    summary: summary ?? '',
    blockers: blockers ?? [],
    wins: wins ?? [],
    timestamp: new Date().toISOString(),
  };

  checkins.push(checkin);
  res.status(201).json(checkin);
});

// POST /api/analyze-text — transcript string → { mood, blockers, summary }
app.post('/api/analyze-text', async (req, res) => {
  const { transcript } = req.body;
  if (!transcript?.trim()) {
    return res.status(400).json({ error: 'transcript is required' });
  }
  try {
    res.json(await analyzeText(transcript));
  } catch (err) {
    console.error('[/api/analyze-text]', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/team-snapshot
app.get('/api/team-snapshot', (req, res) => {
  const latest = {};
  for (const c of checkins) {
    if (!latest[c.teammateId] || c.timestamp > latest[c.teammateId].timestamp) {
      latest[c.teammateId] = c;
    }
  }

  const recent = Object.values(latest);
  if (recent.length === 0) {
    return res.json({ avgMoodScore: null, teamMood: null, allBlockers: [], checkedInCount: 0, totalTeam: teammates.length });
  }

  const avgMoodScore = recent.reduce((sum, c) => sum + c.moodScore, 0) / recent.length;
  const allBlockers = [...new Set(recent.flatMap(c => c.blockers))];
  const teamMood =
    avgMoodScore >= 4.5 ? 'great' :
    avgMoodScore >= 3.5 ? 'good' :
    avgMoodScore >= 2.5 ? 'neutral' :
    avgMoodScore >= 1.5 ? 'stressed' : 'blocked';

  res.json({
    avgMoodScore: Math.round(avgMoodScore * 10) / 10,
    teamMood,
    allBlockers,
    checkedInCount: recent.length,
    totalTeam: teammates.length,
    breakdown: recent.map(c => ({ teammateId: c.teammateId, mood: c.mood, moodScore: c.moodScore, blockers: c.blockers })),
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`LUMA backend on http://localhost:${PORT}`));
