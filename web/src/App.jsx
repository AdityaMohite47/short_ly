import ShortenForm from './components/ShortenForm.jsx'
import LinkList from './components/LinkList.jsx'
import { useLinks } from './hooks/useLinks.js'
import { useShorten } from './hooks/useShorten.js'

export default function App() {
  const { links, addLink, removeLink } = useLinks()
  const { shorten, loading, error } = useShorten(addLink)

  return (
    <div className="page">
      <header className="masthead">
        <h1 className="wordmark">short.ly</h1>
        <p className="tagline">Paste a URL to get a short link.</p>
      </header>

      <ShortenForm onSubmit={shorten} loading={loading} error={error} />
      <LinkList links={links} onRemove={removeLink} />
    </div>
  )
}
