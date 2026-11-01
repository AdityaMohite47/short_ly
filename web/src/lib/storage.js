const KEY = 'shortly:links'

// loadLinks reads saved links from this browser; storage can be blocked, so fail soft
export function loadLinks() {
  try {
    const raw = localStorage.getItem(KEY)
    const links = raw ? JSON.parse(raw) : []
    return Array.isArray(links) ? links : []
  } catch {
    return []
  }
}

export function saveLinks(links) {
  try {
    localStorage.setItem(KEY, JSON.stringify(links))
  } catch {
    // storage full or disabled; history just won't persist
  }
}
