import { useEffect, useState } from 'react'
import { loadLinks, saveLinks } from '../lib/storage.js'

// useLinks holds the shortened-link history and keeps it in sync with localStorage
export function useLinks() {
  const [links, setLinks] = useState(loadLinks)

  useEffect(() => saveLinks(links), [links])

  function addLink(code, url) {
    setLinks((prev) => [{ code, url, createdAt: Date.now() }, ...prev])
  }

  function removeLink(code) {
    setLinks((prev) => prev.filter((l) => l.code !== code))
  }

  return { links, addLink, removeLink }
}
