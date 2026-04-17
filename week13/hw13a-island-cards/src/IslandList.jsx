import { useState } from 'react'
import IslandCard from './IslandCard'

export default function IslandList({ islands }) {
    const [segment, setSegment] = useState('All')

    const segments = ['All', ...new Set(islands.map(i => i.segment))]

    const displayed = segment === 'All'
        ? islands
        : islands.filter(i => i.segment === segment)

    const avgStay = displayed.length
        ? (displayed.reduce((sum, i) => sum + i.avgStay, 0) / displayed.length).toFixed(1)
        : 0

    return (
        <div className="island-list">
            <div className="controls">
                <label htmlFor="segment-filter">Filter by visitor segment: </label>
                <select
                    id="segment-filter"
                    onChange={e => setSegment(e.target.value)}
                    value={segment}
                >
                    {segments.map(s => <option key={s}>{s}</option>)}
                </select>
            </div>

            <div className="summary-card">
                <p>Showing <strong>{displayed.length}</strong> island{displayed.length !== 1 ? 's' : ''}</p>
                <p>Average length of stay: <strong>{avgStay} days</strong></p>
            </div>

            <div className="grid">
                {displayed.map(island => (
                    <IslandCard key={island.id} {...island} />
                ))}
            </div>
        </div>
    )
}