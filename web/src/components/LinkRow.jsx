import { useState } from 'react'
import { shortLinkFor, stripScheme } from '../lib/url.js'
import { timeAgo } from '../lib/time.js'

export default function LinkRow({ link, onRemove }) {
  const [copied, setCopied] = useState(false)
  const shortLink = shortLinkFor(link.code)

  async function copy() {
    try {
      await navigator.clipboard.writeText(shortLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {}
  }

  return (
    <li className="row">
      <div className="row__main">
        <a className="row__short" href={shortLink} target="_blank" rel="noreferrer">
          {stripScheme(shortLink)}
        </a>
        <span className="row__long" title={link.url}>{link.url}</span>
      </div>
      <time className="row__time" dateTime={new Date(link.createdAt).toISOString()}>
        {timeAgo(link.createdAt)}
      </time>
      <div className="row__actions">
        <button type="button" className="btn" onClick={copy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button
          type="button"
          className="btn btn--danger"
          onClick={() => onRemove(link.code)}
          aria-label={`Remove ${link.code} from history`}
        >
          Remove
        </button>
      </div>
    </li>
  )
}
