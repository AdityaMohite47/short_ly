import { BACKEND_URL } from './api.js'

// normalizeURL adds https:// when the scheme is missing and rejects anything that isn't http(s)
export function normalizeURL(value) {
  const withScheme = /^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`
  try {
    const u = new URL(withScheme)
    if ((u.protocol === 'http:' || u.protocol === 'https:') && u.hostname.includes('.')) {
      return u.href
    }
  } catch {}
  return null
}

// shortLinkFor builds the full redirect URL the backend serves for a code
export function shortLinkFor(code) {
  return `${BACKEND_URL}/${code}`
}

// stripScheme drops http(s):// for display
export function stripScheme(url) {
  return url.replace(/^https?:\/\//, '')
}
