import { metricsData } from '../data/hawaiiData'

export default function MetricCards({ selectedIslands }) {
    const islands = selectedIslands.length > 0 ? selectedIslands : ['Hawaiʻi']

    const avg = (key) => {
        const values = islands.map(i => metricsData[i][key])
        return (values.reduce((sum, v) => sum + v, 0) / values.length)
    }

    const adr = avg('adr').toFixed(0)
    const occupancy = avg('occupancy').toFixed(1)
    const avgStay = avg('avgStay').toFixed(1)

    return (
        <div className="metric-cards">
            <div className="metric-card">
                <p className="metric-value">${adr}</p>
                <p className="metric-label">Avg Daily Rate</p>
                <p className="metric-unit">per night</p>
            </div>
            <div className="metric-card">
                <p className="metric-value">{occupancy}%</p>
                <p className="metric-label">Occupancy Rate</p>
                <p className="metric-unit">current</p>
            </div>
            <div className="metric-card">
                <p className="metric-value">{avgStay}</p>
                <p className="metric-label">Avg Length of Stay</p>
                <p className="metric-unit">days</p>
            </div>
        </div>
    )
}