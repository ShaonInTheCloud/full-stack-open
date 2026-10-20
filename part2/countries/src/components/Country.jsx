import Weather from './Weather'
export default function Country({ country }) {
  const languages = Object.entries(country.languages || {})
  return <article className="card"><h2>{country.name.common}</h2><div className="details"><div><dl>
    <dt>Capital</dt><dd>{country.capital?.join(', ') || 'Not listed'}</dd>
    <dt>Area</dt><dd>{country.area?.toLocaleString('en-US') ?? 'Not listed'} km²</dd>
    </dl><h3>Languages</h3>{languages.length ? <ul className="languages">{languages.map(([code, name]) => <li key={code}>{name}</li>)}</ul> : <p>Not listed</p>}</div>
    {country.flags?.svg && <img className="flag" src={country.flags.svg} alt={country.flags.alt || `Flag of ${country.name.common}`} />}</div>
    <Weather key={country.cca3 || country.name.common} country={country} /></article>
}
