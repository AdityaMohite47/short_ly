import { useState } from 'react'
import { shortenURL } from '../lib/api.js'
import { normalizeURL } from '../lib/url.js'

// useShorten validates a URL, calls the backend, and tracks loading/error state
export function useShorten(onShortened) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // shorten returns true when a link was created
  async function shorten(input) {
    setError('')

    const url = normalizeURL(input.trim())
    if (!url) {
      setError('That doesn’t look like a web address. Try something like example.com/page.')
      return false
    }

    setLoading(true)
    try {
      const code = await shortenURL(url)
      onShortened(code, url)
      return true
    } catch (err) {
      setError(
        err instanceof TypeError
          ? 'Can’t reach the short.ly server. Check that the backend is running on port 8000.'
          : err.message
      )
      return false
    } finally {
      setLoading(false)
    }
  }

  return { shorten, error, loading }
}
