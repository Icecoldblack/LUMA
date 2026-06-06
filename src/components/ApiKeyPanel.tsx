import { useState } from 'react'

interface ApiKeyPanelProps {
  apiKey: string
  onChange: (key: string) => void
}

/**
 * Optional: paste an Anthropic API key to use the real Claude API for analysis.
 * The key is stored only in this browser's localStorage and sent straight to
 * Anthropic from the page. Leave it empty to use the built-in local analyzer.
 */
export default function ApiKeyPanel({ apiKey, onChange }: ApiKeyPanelProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(apiKey)

  return (
    <div className="api-panel">
      <button type="button" className="api-toggle" onClick={() => setOpen((o) => !o)}>
        <span className={`dot ${apiKey ? 'on' : ''}`} />
        {apiKey ? 'Claude connected' : 'Using local analysis'}
        <span className="chev">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="api-body">
          <p>
            Paste an Anthropic API key to analyze updates with Claude. It stays in your
            browser (localStorage) and is sent directly to Anthropic. Leave it blank to use
            the built-in local analyzer — no key needed.
          </p>
          <div className="api-row">
            <input
              type="password"
              placeholder="sk-ant-..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              aria-label="Anthropic API key"
            />
            <button type="button" className="pill-btn btn-primary" onClick={() => onChange(draft.trim())}>
              Save
            </button>
            {apiKey && (
              <button
                type="button"
                className="pill-btn btn-ghost"
                onClick={() => {
                  setDraft('')
                  onChange('')
                }}
              >
                Clear
              </button>
            )}
          </div>
          <p className="api-warn">
            Browser-side keys are fine for a personal demo, not production. A backend proxy
            will replace this later.
          </p>
        </div>
      )}
    </div>
  )
}
