import { useEffect, useState } from 'react'
import { getCountries } from './services/countries'
import Country from './components/Country'

export default function App() {
  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    getCountries(controller.signal).then(data => {
      if (!controller.signal.aborted) setCountries(data.sort((a, b) => a.name.common.localeCompare(b.name.common)))
    }).catch(() => { if (!controller.signal.aborted) setError(true) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [])
  const matches = countries.filter(country => country.name.common.toLowerCase().includes(query.trim().toLowerCase()))
  const country = selected || (query.trim() && matches.length === 1 ? matches[0] : null)
  return <main><header><p className="eyebrow">Full Stack Open · Part 2</p><h1>A world to explore</h1><p className="intro">Find a country, discover its languages, and check the weather in its capital.</p></header>
    <div className="search"><label htmlFor="country-search">Find countries</label><input id="country-search" type="search" placeholder="Try Finland" value={query} onChange={event => { setQuery(event.target.value); setSelected(null) }} /></div>
    {loading ? <p role="status">Loading countries…</p> : error ? <p className="notice error" role="alert">Countries could not be loaded. Check your connection and reload this page.</p> : !query.trim() ? <p className="empty">Start typing a country name to explore.</p> : country ? <Country country={country} /> : matches.length > 10 ? <p className="empty">Too many matches. Make your search more specific.</p> : matches.length === 0 ? <p className="empty">No countries found. Try a different name.</p> : <section className="card"><h2>Matching countries <span className="count">{matches.length} found</span></h2><ul className="list">{matches.map(item => <li className="row" key={item.cca3 || item.name.common}><strong>{item.name.common}</strong><button className="secondary" aria-label={`Show ${item.name.common}`} onClick={() => setSelected(item)}>Show</button></li>)}</ul></section>}
    <footer>Country data: <a href="https://studies.cs.helsinki.fi/restcountries/">University of Helsinki REST Countries</a> · Weather: <a href="https://open-meteo.com/">Open-Meteo</a></footer>
  </main>
}
