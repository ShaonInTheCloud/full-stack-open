import { useEffect, useRef, useState } from 'react'
import personsService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

export default function App() {
  const [persons, setPersons] = useState([])
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [busy, setBusy] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    let active = true
    personsService.getAll().then(data => { if (active) setPersons(data) })
      .catch(() => { if (active) setLoadError(true) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false; clearTimeout(timer.current) }
  }, [])

  const notify = (message, type = 'success') => {
    clearTimeout(timer.current)
    setNotification({ message, type })
    timer.current = setTimeout(() => setNotification(null), 5000)
  }
  const forget = id => setPersons(current => current.filter(person => person.id !== id))
  const save = async event => {
    event.preventDefault()
    if (busy || loading || loadError) return
    const contact = { name: name.trim(), number: number.trim() }
    if (!contact.name || !contact.number) { notify('Please enter a name and phone number.', 'error'); return }
    const existing = persons.find(person => person.name.toLowerCase() === contact.name.toLowerCase())
    if (existing && !window.confirm(`${existing.name} is already in the phonebook. Replace the old number with the new one?`)) return
    setBusy(true)
    try {
      if (existing) {
        const saved = await personsService.update(existing.id, { ...existing, number: contact.number })
        setPersons(current => current.map(person => person.id === saved.id ? saved : person))
        notify(`Updated ${saved.name}`)
      } else {
        const saved = await personsService.create(contact)
        setPersons(current => [...current, saved])
        notify(`Added ${saved.name}`)
      }
      setName(''); setNumber('')
    } catch (error) {
      if (existing && error.response?.status === 404) {
        forget(existing.id)
        notify(`${existing.name} has already been removed from the server. Save again to add the contact.`, 'error')
      } else notify(error.response?.data?.error || 'Could not save the contact. Check the connection and try again.', 'error')
    } finally { setBusy(false) }
  }
  const remove = async person => {
    if (busy || !window.confirm(`Delete ${person.name}?`)) return
    setBusy(true)
    try { await personsService.remove(person.id); forget(person.id); notify(`Deleted ${person.name}`) }
    catch (error) {
      if (error.response?.status === 404) { forget(person.id); notify(`${person.name} has already been removed from the server.`, 'error') }
      else notify('Could not delete the contact. Please try again.', 'error')
    } finally { setBusy(false) }
  }
  const visible = persons.filter(person => person.name.toLowerCase().includes(filter.trim().toLowerCase()))
  return <main><header><p className="eyebrow">Full Stack Open · Part 2</p><h1>Phonebook</h1><p className="intro">Keep the people you need close at hand.</p></header>
    <Notification notification={notification} />
    {loadError && <p className="notice error" role="alert">Could not load contacts. Start the phonebook server, then reload this page.</p>}
    <div className="grid"><section className="card"><h2>Add or update a contact</h2><p className="muted">Use an existing name to replace their phone number.</p><PersonForm name={name} number={number} onNameChange={event => setName(event.target.value)} onNumberChange={event => setNumber(event.target.value)} onSubmit={save} busy={busy || loading || loadError} /></section>
      <section className="card"><h2>Contacts <span className="count">{persons.length} saved</span></h2><Filter value={filter} onChange={event => setFilter(event.target.value)} />
        {loading ? <p role="status">Loading contacts…</p> : !loadError && <Persons persons={visible} onDelete={remove} busy={busy} />}
      </section></div><footer>Sample contacts are demonstration data. Changes are saved to the local phonebook server.</footer>
  </main>
}
