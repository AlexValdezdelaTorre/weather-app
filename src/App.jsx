import axios from "axios"
import { useState, useEffect } from "react"
import {
  thunderstormSvg,
  drizzleSvg,
  rainSvg,
  snowSvg,
  atmosphereSvg,
  clearSvg,
  cloudSvg
} from './assets/images'
import './App.css'

const key = '2abd8b9ebac5bbbddc0931174918900a'
const url = 'https://api.openweathermap.org/data/2.5/weather'

const initialState = {
  latitude: 0,
  longitude: 0
}

const conditionCodes = {
  thunderstorm: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
  drizzle: [300, 301, 302, 310, 311, 312, 313, 314, 321],
  rain: [500, 501, 502, 503, 504, 511, 520, 521, 522, 531],
  snow: [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622],
  atmosphere: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
  clear: [800],
  clouds: [801, 802, 803, 804]
}

const icons = {
  thunderstorm: thunderstormSvg,
  drizzle: drizzleSvg,
  rain: rainSvg,
  snow: snowSvg,
  atmosphere: atmosphereSvg,
  clear: clearSvg,
  clouds: cloudSvg
}

function App() {
  const [coords, setCoords] = useState(initialState)
  const [weather, setWeather] = useState({})
  const [toggle, setToggle] = useState(false)


  useEffect(() => {
    console.log(navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords
      setCoords({ latitude, longitude})
    },(error) => {
      console.log('No aceptaste la ubicación')
    }))

  }, [])
 
  useEffect(() => {
    if (coords) {
      axios.get(`${url}?lat=${coords.latitude}&lon=${coords.longitude}&appid=${key}`)
        .then(res => {
          console.log(res)

          const keys = Object.keys(conditionCodes)
          const iconName= keys.find(key => conditionCodes[key].includes(res.data?.weather[0]?.id))
          
          setWeather({
           city: res.data?.name,
           country: res.data?.sys?.country,
           icon: icons[iconName],
           main: res.data?.weather[0]?.main,
           wind: res.data?.wind?.speed,
           clouds: res.data?.clouds?.all,
           pressure: res.data?.main?.pressure,
           temperature: parseInt(res.data?.main?.temp - 273.15)
          })
       }).catch(err => {
        console.log(err)
      })
    }

  }, [coords])


  const temp = !toggle ? parseInt(weather.temperature * 9 / 5) + 32 : weather.temperature

  return (
    <div className="card">
      <h1 className="card__tittle">Weather App</h1>
      <h2 className="card__subtittle">{weather.city}, {weather.country}</h2>
      <div className="card__body">
        <img src={weather.icon} alt={weather.main} />
        <div className="card__info">
          <h3 className="card__main">"{weather.main}"</h3>
          <p className="card__wind-speed">Wind speed {weather.wind}m/s</p>
          <p className="card__clouds">Clouds {weather.clouds}%</p>
          <p className="card__pressure">Pressure {weather.pressure}hPa</p>
        </div>

      </div>
      <h2 className="card__temperature"> {temp} {!toggle ? '°F' : '°C'}</h2>
      <button 
      onClick={() => setToggle(!toggle)}
      className="card__button">
        Change to {toggle ? '°F' : '°C'}
        </button>
    </div>
  )
}

export default App
