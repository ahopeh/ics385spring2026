const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse/sync')

const RESEARCH_PURPOSES = [
    'Purpose: MCI-net (%)',
    'Purpose: Corporate meetings (%)',
    'Purpose: Conventions (%)',
    'Purpose: Incentive (%)',
    'Purpose: Govt/Military (%)',
    'Purpose: Other business (%)',
]

const LEISURE_PURPOSES = [
    'Purpose: Pleasure-net (%)',
    'Purpose: Vacation (%)',
    'Purpose: Visit Friends/Relative (%)',
    'Purpose: Honeymoon (%)',
]

function loadCSV() {
    const filePath = path.join(__dirname, '../data/Hawaii Tourism Data Purpose (from DBEDT Data Warehouse).csv')
    const content = fs.readFileSync(filePath, 'utf8')
    return parse(content, {
        columns: true,
        skip_empty_lines: true,
        relax_quotes: true,
        relax_column_count: true,
        from_line: 1,
    })
}

function parseFloat2(str) {
    if (!str) return 0
    return parseFloat(str.replace(/,/g, '').trim()) || 0
}

// GET /api/arrivals?months=12
router.get('/', (req, res) => {
    try {
        const records = loadCSV()

        // Get all month columns
        const sampleRow = records[0]
        const allMonths = Object.keys(sampleRow).filter(k =>
            k.match(/^\d{4}-\d{2}$/)
        )

        // Get most recent 12 months with data
        const recentMonths = allMonths
            .filter(m => m >= '2024-01')
            .slice(-12)

        // Find MCI-net (research) and Pleasure-net (leisure) rows
        const researchRow = records.find(r =>
            r['Indicator'] === 'Purpose: MCI-net (%)'
        )
        const leisureRow = records.find(r =>
            r['Indicator'] === 'Purpose: Pleasure-net (%)'
        )

        if (!researchRow || !leisureRow) {
            return res.status(404).json({ error: 'Purpose data not found' })
        }

        const months = recentMonths.map(m => {
            const short = m.slice(0, 7)
            const [year, month] = short.split('-')
            const date = new Date(year, month - 1)
            return date.toLocaleString('default', { month: 'short', year: '2-digit' })
        })

        const research = recentMonths.map(m => parseFloat2(researchRow[m]))
        const leisure = recentMonths.map(m => parseFloat2(leisureRow[m]))

        res.json({
            months,
            research,
            leisure,
            note: 'Research approximated from MCI-net (Meetings/Conventions/Incentives). Leisure from Pleasure-net. Source: DBEDT Hawaii Tourism Authority.'
        })
    } catch (err) {
        console.error('Arrivals route error:', err)
        res.status(500).json({ error: err.message })
    }
})

module.exports = router