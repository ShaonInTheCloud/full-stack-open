import { useEffect, useState } from 'react'
import { getWeather } from '../services/countries'

function describeWeather(code) {
  if (code === 0) return ['☀️', 'Clear sky']
  if ([1, 2, 3].includes(code)) return ['⛅', 'Partly cloudy or overcast']
  if ([45, 48].includes(code)) return ['🌫️', 'Fog']
  if ([51, 53, 55, 56, 57].includes(code)) return ['🌦️', 'Drizzle']
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return ['🌧️', 'Rain']
  if ([71, 73, 75, 77, 85, 86].includes(code)) return ['❄️', 'Snow']
  if ([95, 96, 99].includes(code)) return ['⛈️', 'Thunderstorm']
  return ['🌡️', 'Conditions unavailable']
}

export default function Weather({ country }) {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(false)
  const coordinates = country.capitalInfo?.latlng
  const latitude = coordinates?.[0]
  const longitude = coordinates?.[1]
  const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude)
  useEffect(() => {
    setWeather(null); setError(false)
    if (!hasCoordinates) return
    const controller = new AbortController()
    getWeather(latitude, longitude, controller.signal)
      .then(data => { if (!controller.signal.aborted) setWeather(data) })
      .catch(() => { if (!controller.signal.aborted) setError(true) })
    return () => controller.abort()
  }, [latitude, longitude, hasCoordinates])
  const current = weather?.current
  const [icon, description] = describeWeather(current?.weather_code)
  return <section className="weather"><h3>Weather in {country.capital?.[0] || 'the capital'}</h3>
    {!hasCoordinates ? <p>Capital coordinates are unavailable.</p> : error ? <p role="alert">Weather could not be loaded. Select the country again to retry.</p> : !weather ? <p role="status">Loading weather…</p> : !current ? <p>Current weather is unavailable.</p> : <>
      <span className="weather-icon" role="img" aria-label={description}>{icon}</span><p>{description}</p>
      <p className="temperature">{current.temperature_2m ?? '—'} °C</p><p>Wind: {current.wind_speed_10m ?? '—'} m/s</p>
      <small>Modelled conditions · {current.time?.replace('T', ' ')} ({weather.timezone})</small>
    </>}
    <p><small>Weather data by <a href="https://open-meteo.com/">Open-Meteo</a></small></p>
  </section>
}
