import axios from 'axios'
export const getCountries = signal => axios.get('https://studies.cs.helsinki.fi/restcountries/api/all', { signal }).then(response => response.data)
export const getWeather = (latitude, longitude, signal) => axios.get('https://api.open-meteo.com/v1/forecast', {
  signal, params: { latitude, longitude, current: 'temperature_2m,weather_code,wind_speed_10m', wind_speed_unit: 'ms', timezone: 'auto' },
}).then(response => response.data)
