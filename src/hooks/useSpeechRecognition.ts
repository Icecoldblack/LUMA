import { useCallback, useRef, useState } from 'react'

const SpeechRecognitionImpl =
  typeof window !== 'undefined'
    ? window.SpeechRecognition ?? window.webkitSpeechRecognition
    : undefined

export interface UseSpeechRecognition {
  supported: boolean
  listening: boolean
  transcript: string
  setTranscript: (value: string) => void
  start: () => void
  stop: () => void
  reset: () => void
  error: string | null
}

export function useSpeechRecognition(): UseSpeechRecognition {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const finalRef = useRef('')
  // Tracks whether the user intentionally stopped so onend doesn't auto-restart
  const stoppedRef = useRef(false)

  const start = useCallback(() => {
    if (!SpeechRecognitionImpl || listening) return
    setError(null)
    stoppedRef.current = false
    finalRef.current = ''
    setTranscript('')

    // Always create a fresh instance — reusing a stopped instance throws.
    const recognition = new SpeechRecognitionImpl()
    recognition.lang = 'en-US'
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const text = result[0].transcript
        if (result.isFinal) finalRef.current += text + ' '
        else interim += text
      }
      setTranscript((finalRef.current + interim).trimStart())
    }

    recognition.onerror = (event) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setError(event.error)
      }
      setListening(false)
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }, [listening])

  const stop = useCallback(() => {
    stoppedRef.current = true
    recognitionRef.current?.stop()
    recognitionRef.current = null
    setListening(false)
  }, [])

  const reset = useCallback(() => {
    finalRef.current = ''
    setTranscript('')
    setError(null)
  }, [])

  const setTranscriptManual = useCallback((value: string) => {
    finalRef.current = value ? value + ' ' : ''
    setTranscript(value)
  }, [])

  return {
    supported: Boolean(SpeechRecognitionImpl),
    listening,
    transcript,
    setTranscript: setTranscriptManual,
    start,
    stop,
    reset,
    error,
  }
}
