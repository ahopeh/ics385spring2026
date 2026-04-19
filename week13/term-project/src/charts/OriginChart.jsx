import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Doughnut, Bar } from 'react-chartjs-2'
import { useState, useEffect } from 'react'
import VolcanoLoader from '../components/VolcanoLoader'

ChartJS.register(
    ArcElement, Tooltip, Legend, ChartDataLabels,
    CategoryScale, LinearScale, BarElement, Title
)

const INTERNATIONAL_COLORS = {
    'Japan': '#7a9e9f',
    'Canada': '#c4a882',
    'China': '#8fa67a',
    'Korea': '#9b8ea8',
    'Taiwan': '#d4956a',
    'Europe': '#7a8fa6',
    'Oceania': '#a67a7a',
    'Latin America': '#a8b87a',
    'Other Asia': '#8aa8a0',
}

const REGION_COLORS = {
    west: '#7a9e9f',
    southwest: '#d4956a',
    midwest: '#8fa67a',
    south: '#b5876b',
    northeast: '#7a8fa6',
    other: '#9b8ea8',
}

const STATE_REGIONS = {
    'Alaska': 'west', 'California': 'west', 'Colorado': 'west',
    'Idaho': 'west', 'Montana': 'west', 'Nevada': 'west',
    'Oregon': 'west', 'Utah': 'west', 'Washington': 'west', 'Wyoming': 'west',
    'Arizona': 'southwest', 'New Mexico': 'southwest',
    'Oklahoma': 'southwest', 'Texas': 'southwest',
    'Illinois': 'midwest', 'Indiana': 'midwest', 'Iowa': 'midwest',
    'Kansas': 'midwest', 'Michigan': 'midwest', 'Minnesota': 'midwest',
    'Missouri': 'midwest', 'Nebraska': 'midwest', 'N. Dakota': 'midwest',
    'Ohio': 'midwest', 'S. Dakota': 'midwest', 'Wisconsin': 'midwest',
    'Alabama': 'south', 'Arkansas': 'south', 'Delaware': 'south',
    'Florida': 'south', 'Georgia': 'south', 'Kentucky': 'south',
    'Louisiana': 'south', 'Maryland': 'south', 'Mississippi': 'south',
    'N. Carolina': 'south', 'S. Carolina': 'south', 'Tennessee': 'south',
    'Virginia': 'south', 'W. Virginia': 'south',
    'Connecticut': 'northeast', 'Maine': 'northeast', 'Massachusetts': 'northeast',
    'New Hampshire': 'northeast', 'New Jersey': 'northeast', 'New York': 'northeast',
    'Pennsylvania': 'northeast', 'Rhode Island': 'northeast', 'Vermont': 'northeast',
    'Washington, D.C.': 'northeast',
}

function getStateColor(state) {
    const region = STATE_REGIONS[state] || 'other'
    return REGION_COLORS[region]
}

// Center text plugin showing US vs International split
const centerTextPlugin = {
    id: 'centerText',
    beforeDraw(chart) {
        const { ctx, chartArea, config } = chart
        if (!chartArea) return
        const { usTotal, intlTotal, month } = config.options.plugins.centerText || {}
        if (!usTotal && !intlTotal) return

        const total = usTotal + intlTotal
        const usPct = total ? ((usTotal / total) * 100).toFixed(0) : 0
        const intlPct = total ? ((intlTotal / total) * 100).toFixed(0) : 0
        const cx = (chartArea.left + chartArea.right) / 2
        const cy = (chartArea.top + chartArea.bottom) / 2

        ctx.save()
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // US percentage
        ctx.font = 'bold 13px Georgia'
        ctx.fillStyle = '#b5876b'
        ctx.fillText(`🇺🇸 ${usPct}% US`, cx, cy - 20)

        // Divider
        ctx.font = '11px Georgia'
        ctx.fillStyle = '#2a3a2e'
        ctx.fillText('────', cx, cy - 2)

        // International percentage
        ctx.font = 'bold 13px Georgia'
        ctx.fillStyle = '#7a9e9f'
        ctx.fillText(`🌏 ${intlPct}% Intl`, cx, cy + 16)

        // Month
        ctx.font = '10px Georgia'
        ctx.fillStyle = '#4a6a52'
        ctx.fillText(month || '', cx, cy + 34)

        ctx.restore()
    }
}

ChartJS.register(centerTextPlugin)

export default function OriginChart() {
    const [chartData, setChartData] = useState(null)
    const [availableMonths, setAvailableMonths] = useState([])
    const [selectedMonth, setSelectedMonth] = useState('')
    const [view, setView] = useState('international')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [rawData, setRawData] = useState({
        labels: [], data: [], usTotal: 0, intlTotal: 0
    })

    useEffect(() => {
        setLoading(true)
        setError(false)
        const params = new URLSearchParams({ view })
        if (selectedMonth) params.append('month', selectedMonth)

        fetch(`http://localhost:3000/api/origin?${params}`)
            .then(r => r.json())
            .then(d => {
                if (d.error) throw new Error(d.error)
                setAvailableMonths(d.availableMonths)
                if (!selectedMonth) setSelectedMonth(d.month)
                setRawData({
                    labels: d.labels,
                    data: d.data,
                    usTotal: d.usTotal || 0,
                    intlTotal: d.intlTotal || 0,
                })
                setLoading(false)
            })
            .catch(() => {
                setError(true)
                setLoading(false)
            })
    }, [view, selectedMonth])

    useEffect(() => {
        if (!rawData.labels.length) return
        const total = rawData.data.reduce((a, b) => a + b, 0)

        if (view === 'international') {
            setChartData({
                labels: rawData.labels,
                datasets: [{
                    data: rawData.data,
                    backgroundColor: rawData.labels.map(l =>
                        INTERNATIONAL_COLORS[l] || '#8aa8a0'
                    ),
                    borderColor: '#0f1412',
                    borderWidth: 2,
                    hoverOffset: 10,
                }]
            })
        } else {
            const sorted = rawData.labels
                .map((label, i) => ({ label, value: rawData.data[i] }))
                .sort((a, b) => b.value - a.value)

            setChartData({
                labels: sorted.map(d => d.label),
                datasets: [{
                    data: sorted.map(d => ((d.value / total) * 100).toFixed(1)),
                    backgroundColor: sorted.map(d => getStateColor(d.label)),
                    borderColor: '#0f1412',
                    borderWidth: 1,
                    borderRadius: 3,
                }]
            })
        }
    }, [rawData, view])

    const donutOptions = {
        responsive: true,
        cutout: '58%',
        layout: { padding: 48 },
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: '#c8c0b0',
                    font: { family: 'Georgia', size: 12 },
                    padding: 16,
                    usePointStyle: true,
                    pointStyleWidth: 10,
                }
            },
            title: {
                display: true,
                text: `International Visitors — Hawaiʻi Island (${selectedMonth})`,
                color: '#e8a245',
                font: { size: 16, family: 'Georgia' },
                padding: { bottom: 16 }
            },
            datalabels: {
                color: '#e8e0d5',
                font: { size: 10, family: 'Georgia' },
                anchor: 'end',
                align: 'end',
                offset: 10,
                formatter: (value, ctx) => {
                    const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
                    const pct = ((value / total) * 100).toFixed(1)
                    return Number(pct) > 2 ? `${pct}%` : ''
                }
            },
            centerText: {
                usTotal: rawData.usTotal,
                intlTotal: rawData.intlTotal,
                month: selectedMonth,
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => {
                        const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
                        const pct = ((ctx.raw / total) * 100).toFixed(1)
                        return ` ${ctx.label}: ${Number(ctx.raw).toLocaleString()} (${pct}%)`
                    }
                }
            }
        }
    }

    const barOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: `U.S. State Breakdown — Hawaiʻi Island (${selectedMonth})`,
                color: '#e8a245',
                font: { size: 16, family: 'Georgia' },
                padding: { bottom: 16 }
            },
            datalabels: {
                color: '#e8e0d5',
                font: { size: 10, family: 'Georgia' },
                anchor: 'end',
                align: 'end',
                formatter: (value) => `${value}%`
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => ` ${ctx.raw}% of U.S. visitors`
                }
            }
        },
        scales: {
            x: {
                ticks: { color: '#a0b8a8', callback: v => `${v}%` },
                grid: { color: '#1e2e22' },
            },
            y: {
                ticks: { color: '#a0b8a8', font: { size: 11 } },
                grid: { color: '#1e2e22' },
            }
        }
    }

    const barHeight = Math.max(600, (rawData.labels.length || 50) * 24)

    const regionLegend = Object.entries(REGION_COLORS).map(([region, color]) => (
        <span key={region} className="region-legend-item">
            <span className="region-dot" style={{ backgroundColor: color }} />
            {region.charAt(0).toUpperCase() + region.slice(1)}
        </span>
    ))

    return (
        <div className="chart-container origin-chart-container">
            <div className="origin-controls">
                <div className="island-selector">
                    <button
                        className={`island-btn ${view === 'international' ? 'selected' : ''}`}
                        onClick={() => setView('international')}
                        style={{
                            borderColor: '#7a9e9f',
                            backgroundColor: view === 'international' ? '#7a9e9f' : 'transparent',
                            color: view === 'international' ? '#0f1412' : '#7a9e9f',
                        }}
                    >
                        🌏 International
                    </button>
                    <button
                        className={`island-btn ${view === 'states' ? 'selected' : ''}`}
                        onClick={() => setView('states')}
                        style={{
                            borderColor: '#b5876b',
                            backgroundColor: view === 'states' ? '#b5876b' : 'transparent',
                            color: view === 'states' ? '#0f1412' : '#b5876b',
                        }}
                    >
                        🗺️ US States
                    </button>
                </div>
                <select
                    className="month-select"
                    value={selectedMonth}
                    onChange={e => setSelectedMonth(e.target.value)}
                >
                    {availableMonths.map(m => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
            </div>

            {loading ? <VolcanoLoader /> : error ? (
                <p className="weather-error">
                    Unable to load origin data — is the Express server running?
                </p>
            ) : !chartData ? <VolcanoLoader /> : view === 'international' ? (
                <div className="donut-wrapper">
                    <Doughnut data={chartData} options={donutOptions} />
                </div>
            ) : (
                <>
                    <div className="region-legend">{regionLegend}</div>
                    <div style={{ height: `${barHeight}px` }}>
                        <Bar data={chartData} options={barOptions} />
                    </div>
                </>
            )}
        </div>
    )
  }