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
import { lengthOfStayData, islandColors } from '../data/hawaiiData'
import VolcanoLoader from '../components/VolcanoLoader'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels)

export default function LengthOfStayChart({ selectedIslands }) {
    const islands = selectedIslands.length > 0 ? selectedIslands : ['Hawaiʻi']
    const months = lengthOfStayData['Hawaiʻi'].map(d => d.month)

    const datasets = islands.flatMap(island => [
        {
            label: `${island} — Avg Stay`,
            data: lengthOfStayData[island].map(d => d.avgStay),
            backgroundColor: islandColors[island],
            stack: island,
        },
        {
            label: `${island} — Research Rental`,
            data: lengthOfStayData[island].map(d => d.researchRental),
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
                text: 'Length of Stay vs Research Facility Rental (days) — Synthetic Data',
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