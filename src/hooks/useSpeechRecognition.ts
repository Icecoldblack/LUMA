import { useCallback, useEffect, useRef, useState } from 'react'

const SpeechRecognitionImpl =
  typeof window !== 'undefined'
    ? window.SpeechRecognition ?? window.webkitSpeechRecognition
    : undefined

export interface UseSpeechRecognition {
  /** Whether the browser exposes the Web Speech API at all. */
  supported: boolean
  /** True while the mic is actively capturing. */
  listening: boolean
  /** Final + interim transcript. Editable via setTranscript. */
  transcript: string
  setTranscript: (value: string) => void
  start: () => void
  stop: () => void
  reset: () => void
  error: string | null
}

/**
 * Wraps the browser SpeechRecognition API. Accumulates finalized phrases and
 * shows the in-progress (interim) phrase live, so the transcript reads
 * naturally as the user speaks. The transcript is editable so users on
 * unsupported browsers (or with a misheard word) can correct it by hand.
 */
export function useSpeechRecognition(): UseSpeechRecognition {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const finalRef = useRef('')

  useEffect(() => {
    if (!SpeechRecognitionImpl) return

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
      // "no-speech"/"aborted" are routine when the user pauses or stops — ignore.
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setError(event.error)
      }
      setListening(false)
    }

    recognition.onend = () => setListening(false)

    recognitionRef.current = recognition
    return () => {
      recognition.onresult = null
      recognition.onerror = null
      recognition.onend = null
      recognition.abort()
    }
  }, [])

  const start = useCallback(() => {
    const recognition = recognitionRef.current
    if (!recognition || listening) return
    setError(null)
    finalRef.current = ''
    setTranscript('')
    try {
      recognition.start()
      setListening(true)
    } catch {
      // start() throws if called while already running — safe to ignore.
    }
  }, [listening])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
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
