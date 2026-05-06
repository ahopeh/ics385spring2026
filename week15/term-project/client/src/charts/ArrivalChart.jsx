import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Bar } from 'react-chartjs-2'
import { arrivalData, islandColors } from '../data/hawaiiData'
import VolcanoLoader from '../components/VolcanoLoader'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels)

export default function ArrivalChart({ selectedIslands }) {
    const islands = selectedIslands.length > 0 ? selectedIslands : ['Hawaiʻi']
    const months = arrivalData['Hawaiʻi'].map(d => d.month)

    const datasets = islands.flatMap(island => [
        {
            label: `${island} — Research`,
            data: arrivalData[island].map(d => d.research),
            backgroundColor: islandColors[island],
            stack: island,

        },
        {
            label: `${island} — Leisure`,
            data: arrivalData[island].map(d => d.leisure),
            backgroundColor: islandColors[island] + '99',
            stack: island,
        }
      ])

    const options = {
        indexAxis: 'y',
        responsive: true,
        plugins: {
            legend: {
                labels: { color: '#e8e0d5', font: { family: 'Georgia' } }
            },
            title: {
                display: true,
                text: 'Visitor Arrivals — Research vs Leisure',
                color: '#e8a245',
                font: { size: 15, family: 'Georgia' }
            },
            datalabels: {
               display: false,
            }
        },
        scales: {
            x: {
                ticks: { color: '#a0b8a8' },
                grid: { color: '#1e2e22' },
                stacked: true,
            },
            y: {
                ticks: { color: '#a0b8a8' },
                grid: { color: '#1e2e22' },
                stacked: true,
            }
        }
    }

    if (!islands.length) return <VolcanoLoader />

    const dynamicHeight = Math.max(600, islands.length * 300)

    return (
        <div className="chart-container" style={{ height: `${dynamicHeight}px` }}>
            <Bar
                data={{ labels: months, datasets }}
                options={{ ...options, maintainAspectRatio: false }}
            />
        </div>
    )
  }