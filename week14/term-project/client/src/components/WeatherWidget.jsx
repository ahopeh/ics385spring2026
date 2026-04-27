import { useState, useEffect } from 'react'
import VolcanoLoader from './VolcanoLoader'

const KEY = import.meta.env.VITE_WEATHER_KEY

const SECONDARY_LOCATIONS = [
    { label: 'Hilo', city: 'Hilo,US', lat: null, lon: null },
    { label: 'Kona', city: 'Kailua-Kona,US', lat: null, lon: null },
    { label: 'Waimea', city: null, lat: 20.0194, lon: -155.6694 },
  ]

const VOG_PLACEHOLDER = {
    'Hilo': { level: 'Moderate', note: 'Placeholder — Hawaii DOH API pending' },
    'Kona': { level: 'Low', note: 'Placeholder — Hawaii DOH API pending' },
    'Waimea': { level: 'Low', note: 'Placeholder — Hawaii DOH API pending' },
  }

const ALERT_COLORS = {
    NORMAL: { bg: '#2a5a2e', color: '#a8d8a8' },
    ADVISORY: { bg: '#5a4a0a', color: '#e8d080' },
    WATCH: { bg: '#5a2a0a', color: '#e8a060' },
    WARNING: { bg: '#5a0a0a', color: '#e88080' },
}

function stripHtml(html) {
    if (!html) return ''
    return html
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/\s+/g, ' ')
        .trim()
}

function extractSummary(text) {
    if (!text) return ''
    const match = text.match(/Overview:(.*?)(?:NOTE:|Subscribe|$)/s)
    if (match) return match[1].trim()
    return text.trim()
  }

function VolcanoBar() {
    const [kilaueaData, setKilaueaData] = useState(null)
    const [summary, setSummary] = useState('')
    const [weather, setWeather] = useState(null)
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState(false)

    useEffect(() => {
        // Fetch alert level + notice URL
        fetch('https://volcanoes.usgs.gov/hans-public/api/volcano/getMonitoredVolcanoes')
            .then(r => r.json())
            .then(data => {
                const kilauea = data.find(v => v.vnum === '332010')
                if (!kilauea) return
                setKilaueaData(kilauea)

                // Fetch the notice data for summary text
                return fetch(kilauea.notice_data)
            })
            .then(r => r && r.json())
            .then(notice => {
                if (!notice) return
                const rawText = notice.notice_text || notice.body || JSON.stringify(notice)
                const clean = stripHtml(rawText)
                setSummary(extractSummary(clean))
            })
            .catch(err => console.error('USGS fetch error:', err))

        // Fetch weather for Volcano, HI
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=Volcano,US&units=imperial&appid=${KEY}`)
            .then(r => r.json())
            .then(d => {
                if (d.cod === 200) setWeather(d)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    if (loading) return (
        <div className="volcano-bar">
            <VolcanoLoader />
        </div>
    )

    const alertLevel = kilaueaData?.alert_level || 'ADVISORY'
    const colorCode = kilaueaData?.color_code || 'YELLOW'
    const alertStyle = ALERT_COLORS[alertLevel] || ALERT_COLORS.ADVISORY

    return (
        <div className="volcano-bar">
            {/* Left — Temperature */}
            <div className="volcano-bar-cell">
                <p className="weather-label">Volcano, HI</p>
                {weather ? (
                    <>
                        <p className="weather-temp">{Math.round(weather.main.temp)}°F</p>
                        <p className="weather-desc" style={{ marginTop: '0.5rem' }}>
                            {alertLevel === 'NORMAL' ? 'No eruptive activity' :
                                alertLevel === 'ADVISORY' ? 'Elevated unrest' :
                                    alertLevel === 'WATCH' ? 'Eruption likely' :
                                        'Eruption in progress'}
                        </p>
                        <p className="weather-details">
                            Humidity: {weather.main.humidity}% · Wind: {Math.round(weather.wind.speed)} mph
                        </p>
                    </>
                ) : (
                    <p className="weather-error">Unable to load</p>
                )}
            </div>

            {/* Middle — Activity Summary */}
            <div className="volcano-bar-middle">
                <p className="weather-label">Kīlauea Activity Summary</p>
                <p className="volcano-summary">
                    {expanded ? summary : summary.slice(0, 200) + (summary.length > 200 ? '...' : '')}
                </p>
                {summary.length > 200 && (
                    <button
                        className="expand-btn"
                        onClick={() => setExpanded(prev => !prev)}
                    >
                        {expanded ? 'Show less ▲' : 'Read more ▼'}
                    </button>
                )}
            </div>

            {/* Right — USGS Alert */}
            <div className="volcano-bar-cell">
                <p className="weather-label">USGS Alert</p>
                <span
                    className="usgs-badge"
                    style={{ backgroundColor: alertStyle.bg, color: alertStyle.color }}
                >
                    {alertLevel}
                </span>
                <p className="weather-desc" style={{ marginTop: '0.5rem' }}>
                    Aviation: {colorCode}
                </p>
            </div>
        </div>
    )
}

function WeatherCard({ label, city, lat, lon }) {
    const [weather, setWeather] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        setLoading(true)
        setError(false)
        const url = city
            ? `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${KEY}`
            : `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${KEY}`
        fetch(url)
            .then(r => r.json())
            .then(d => {
                if (d.cod !== 200) throw new Error('API error')
                setWeather(d)
                setLoading(false)
            })
            .catch(() => {
                setError(true)
                setLoading(false)
            })
    }, [city, lat, lon])

    const vog = VOG_PLACEHOLDER[label]

    if (loading) return (
        <div className="weather-card">
            <VolcanoLoader />
        </div>
    )

    if (error) return (
        <div className="weather-card">
            <p className="weather-label">{label}</p>
            <p className="weather-error">Unable to load conditions</p>
        </div>
    )

    return (
        <div className="weather-card">
            <p className="weather-label">{label}</p>
            <p className="weather-temp">{Math.round(weather.main.temp)}°F</p>
            <p className="weather-desc">{weather.weather[0].description}</p>
            <p className="weather-details">
                Humidity: {weather.main.humidity}% · Wind: {Math.round(weather.wind.speed)} mph
            </p>
            {vog && (
                <p className="vog-level">
                    VOG: <span className={`vog-${vog.level.toLowerCase()}`}>{vog.level}</span>
                    <span className="vog-note"> — {vog.note}</span>
                </p>
            )}
        </div>
    )
}

export default function WeatherWidget() {
    return (
        <div className="weather-widget">
            <h3 className="weather-title">Current Conditions</h3>
            <VolcanoBar />
            <div className="weather-grid">
                {SECONDARY_LOCATIONS.map(loc => (
                    <WeatherCard key={loc.label} label={loc.label} city={loc.city} lat={loc.lat} lon={loc.lon} />
                ))}
            </div>
        </div>
    )
}