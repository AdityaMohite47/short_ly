export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

// shortenURL sends the long URL to the Go backend and returns the short code
export async function shortenURL(url) {
  const res = await fetch('/shorten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })

  if (!res.ok) {
    const msg = (await res.text()).trim()
    throw new Error(msg || `The server returned ${res.status}. Try again.`)
  }

  const { short_url } = await res.json()
  return short_url
}
