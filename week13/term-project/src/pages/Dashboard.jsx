import { useState, useEffect } from 'react'
import IslandSelector from '../components/IslandSelector'
import MetricCards from '../components/MetricCards'
import WeatherWidget from '../components/WeatherWidget'
import ArrivalChart from '../charts/ArrivalChart'
import LengthOfStayChart from '../charts/LengthOfStayChart'
import OriginChart from '../charts/OriginChart'

export default function Dashboard() {
    const [selectedIslands, setSelectedIslands] = useState(['Hawaiʻi'])

    const toggleIsland = (island) => {
        setSelectedIslands(prev =>
            prev.includes(island)
                ? prev.filter(i => i !== island)
                : [...prev, island]
        )
    }

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Hale ʻŌhiʻa Lehua</h1>
                <p className="dashboard-tagline">Visitor Statistics & Conditions Dashboard</p>
                <a href="#visitor-stats" className="jump-link">↓ Jump to Visitor Statistics</a>
                <div className="livestream-container">
                    <div className="livestream-wrapper">
                        <iframe
                            src="https://www.youtube.com/embed/FVdmnpJ2kM0?autoplay=1&mute=1"
                            className="livestream-frame"
                            title="Kīlauea Live Webcam — USGS HVO V3cam"
                            allowFullScreen
                            allow="autoplay"
                        />
                    </div>
                    <p className="livestream-caption">
                        🔴 Live — Kīlauea Summit · USGS HVO V3cam · Halemaʻumaʻu Crater
                    </p>
                </div>
            </header>

            <section className="dashboard-section">
                <WeatherWidget />
            </section>

            <section id="visitor-stats" className="dashboard-section">
                <MetricCards selectedIslands={selectedIslands} />
            </section>

            <section className="dashboard-section">
                <h2 className="section-title-center">Island Filter</h2>
                <IslandSelector
                    selectedIslands={selectedIslands}
                    onToggle={toggleIsland}
                />
            </section>

            <section className="dashboard-section charts-grid">
                <ArrivalChart selectedIslands={selectedIslands} />
                <LengthOfStayChart selectedIslands={selectedIslands} />
            </section>

            <section className="dashboard-section">
                <OriginChart />
            </section>
        </div>
      )
}