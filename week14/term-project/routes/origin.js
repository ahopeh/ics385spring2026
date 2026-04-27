const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse/sync')

const INTERNATIONAL_MARKETS = [
    'Japan', 'Canada', 'China', 'Korea',
    'Taiwan', 'Europe', 'Oceania', 'Latin America', 'Other Asia'
]

const US_STATES = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
    'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
    'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'N. Carolina',
    'N. Dakota', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
    'New Mexico', 'New York', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'S. Carolina', 'S. Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia',
    'W. Virginia', 'Washington', 'Washington, D.C.', 'Wisconsin', 'Wyoming'
]

function loadCSV() {
    const filePath = path.join(__dirname, '../data/Hawaii Tourism Data (from DBEDT Data Warehouse).csv')
    const content = fs.readFileSync(filePath, 'utf8')
    return parse(content, {
        columns: true,
        skip_empty_lines: true,
        relax_quotes: true,
        relax_column_count: true,
        from_line: 1,
      })
}

function parseNumber(str) {
    if (!str) return 0
    return parseInt(str.replace(/,/g, '').trim()) || 0
}

// GET /api/origin?island=Hawaii&month=2025-01&view=international
router.get('/', (req, res) => {
    try {
        const { month, view } = req.query
        const records = loadCSV()

        // Filter to visitor arrivals for Hawaii Island only
        const arrivals = records.filter(r =>
            r['Indicator'] === 'Visitor arrivals' &&
            r['Destination'] === 'Hawaii Island'
        )

        // Get available months from headers (columns after Units)
        const sampleRow = arrivals[0]
        const allMonths = Object.keys(sampleRow).filter(k =>
            k.match(/^\d{4}-\d{2}$/)
        )

        // Filter to 2025-2026 months only
        const recentMonths = allMonths.filter(m => m >= '2025-01')

        // Use requested month or most recent available
        const selectedMonth = month && sampleRow[month] !== undefined
            ? month
            : recentMonths[recentMonths.length - 1]

        const markets = view === 'states' ? US_STATES : INTERNATIONAL_MARKETS

        // Build chart data
        const labels = []
        const data = []

        markets.forEach(market => {
            const row = arrivals.find(r => r['Market'] === market)
            if (row && row[selectedMonth]) {
                const value = parseNumber(row[selectedMonth])
                if (value > 0) {
                    labels.push(market)
                    data.push(value)
                }
            }
        })

        // Get US Total separately
        const usTotalRow = arrivals.find(r => r['Market'] === 'US Total')
        const usTotal = usTotalRow ? parseNumber(usTotalRow[selectedMonth]) : 0

        // Get international total
        const intlTotal = data.reduce((sum, val) => sum + val, 0)

        res.json({
            month: selectedMonth,
            availableMonths: recentMonths,
            view: view || 'international',
            labels,
            data,
            usTotal,
            intlTotal,
        })
    } catch (err) {
        console.error('Origin route error:', err)
        res.status(500).json({ error: err.message })
    }
})

module.exports = router