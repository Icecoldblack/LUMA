import { useState, useRef, useCallback } from 'react';

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const start = useCallback(async () => {
    setError(null);

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError('no-permission');
      return;
    }

    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);
  }, []);

  // stop() returns { audioBase64, mimeType } ready to POST to /api/analyze
  const stop = useCallback(() => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        resolve(null);
        return;
      }

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });

        // Stop all mic tracks
        recorder.stream.getTracks().forEach(t => t.stop());

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(',')[1];
          setIsRecording(false);
          resolve({ audioBase64: base64, mimeType });
        };
        reader.readAsDataURL(blob);
      };

      recorder.stop();
    });
  }, []);

  // Convenience: stop + immediately POST to backend
  const stopAndAnalyze = useCallback(async (backendUrl = 'http://localhost:3001') => {
    setIsProcessing(true);
    try {
      const audio = await stop();
      if (!audio) return null;

      const res = await fetch(`${backendUrl}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(audio),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg);
      }

      return await res.json(); // { transcript, mood, moodScore, summary, blockers, wins }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [stop]);

  return { isRecording, isProcessing, error, start, stop, stopAndAnalyze };
}
