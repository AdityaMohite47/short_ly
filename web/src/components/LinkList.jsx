import LinkRow from './LinkRow.jsx'

export default function LinkList({ links, onRemove }) {
  return (
    <section className="history" aria-labelledby="history-title">
      <h2 id="history-title">Your links</h2>

      {links.length === 0 ? (
        <p className="empty">
          Links you shorten will show up here. They’re saved in this browser only.
        </p>
      ) : (
        <ul className="list">
          {links.map((link) => (
            <LinkRow key={link.code} link={link} onRemove={onRemove} />
          ))}
        </ul>
      )}
    </section>
  )
}
