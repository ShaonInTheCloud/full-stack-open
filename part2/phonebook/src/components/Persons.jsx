export default function Persons({ persons, onDelete, busy }) {
  if (!persons.length) return <p className="empty">No contacts match. Try another name or add a contact.</p>
  return <ul className="list">{persons.map(person => <li className="row" key={person.id}>
    <div><strong>{person.name}</strong><small>{person.number}</small></div>
    <button className="danger" disabled={busy} aria-label={`Delete ${person.name}`} onClick={() => onDelete(person)}>Delete</button>
  </li>)}</ul>
}
