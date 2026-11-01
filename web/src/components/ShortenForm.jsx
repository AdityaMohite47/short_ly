import { useState } from 'react'

export default function ShortenForm({ onSubmit, loading, error }) {
  const [input, setInput] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (await onSubmit(input)) setInput('')
  }

  return (
    <>
      <form className="shorten" onSubmit={handleSubmit} noValidate>
        <label htmlFor="url" className="sr-only">Long URL</label>
        <input
          id="url"
          type="text"
          inputMode="url"
          autoComplete="off"
          spellCheck="false"
          placeholder="Paste a long link"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'url-error' : undefined}
          autoFocus
        />
        <button type="submit" disabled={loading || !input.trim()}>
          {loading ? 'Shortening…' : 'Shorten'}
        </button>
      </form>
      <p id="url-error" className="error" role="alert">{error}</p>
    </>
  )
}
