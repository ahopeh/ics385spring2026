# UH Maui College Campus Dashboard

**ICS 385 — Week 8b Intermediate Assignment**  
**Author:** April Hope  
**Semester:** Spring 2026  

A multi-API integrated dashboard combining course management with live weather data, 
programming humor, and Chuck Norris facts. Built with vanilla JavaScript using 
professional patterns for API integration, security, and error handling.

**Note:** ChatGPT and Claude AI facilitated coding this project.

---

## Developer Notes

Building this assignment was complex and fun. Thinking about how all the programs work together was interesting, and made troubleshooting code errors like a fun puzzle. Even though OpenWeather's API key is supposed to generate within 2 hours I ran into some issues with that, but this made seeing how errors are handled in the program very cool to see. Running into the RapidAPI rate limiting due to testing helped me see the importance of giving coding projects time cushions - sometimes the issues you run into take nothing but time to resolve themselves. 


## Features

- **Course Management** — Browse, search, and filter UH Maui courses by department, 
  instructor, or topic. Displays enrollment data and capacity percentages.
- **Live Campus Weather** — Real-time weather for Kahului via OpenWeatherMap API. 
  Auto-refreshes every 10 minutes.
- **Programming Humor** — Programming jokes from JokeAPI (no auth required) and 
  Chuck Norris facts from RapidAPI. Refresh on demand.
- **Dashboard Statistics** — Real-time stats combining course enrollment data 
  with API connection status.
- **Data Export** — Download all dashboard data as a JSON file.
- **Secure API Key Management** — Keys stored in browser localStorage with a 
  setup modal. Never hardcoded or committed to Git.

---

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- VS Code with the Live Server extension (recommended)
- API keys (free tier) from:
  - [OpenWeatherMap](https://openweathermap.org/api) — for weather data
  - [RapidAPI](https://rapidapi.com/matchilling/api/chuck-norris) — for Chuck Norris jokes

### Setup Instructions

1. **Clone the repository**
```bash
   git clone <your-repo-url>
   cd week8/intermediate-dashboard
```

2. **Set up environment variables**
```bash
   cp .env.example .env
```
   Edit `.env` and add your actual API keys. This file is gitignored and will 
   never be committed.

3. **Get your API keys**
   - **OpenWeatherMap:** Sign up at https://home.openweathermap.org/users/sign_up, 
     then find your key at https://home.openweathermap.org/api_keys. 
     Note: New keys can take 2 - 4 hours to activate.
   - **RapidAPI:** Sign up at https://rapidapi.com, search for "Chuck Norris" by 
     matchilling, subscribe to the free tier, and copy your X-RapidAPI-Key from 
     the code snippet panel.
   - **JokeAPI:** No registration required.

4. **Launch the dashboard**
   - Open the project folder in VS Code
   - Right-click `index.html` → "Open with Live Server"
   - The API key setup modal will appear on first visit
   - Enter your OpenWeatherMap and RapidAPI keys and click Save

5. **Verify it works**
   - Weather widget should show live Kahului weather
   - Click "New Jokes" to fetch fresh humor
   - Search and filter courses in the Course Management section
   - Check that all four stat cards show values

---

## File Structure
```
intermediate-dashboard/
├── index.html           # Main dashboard layout
├── styles.css           # Responsive styling (desktop, tablet, mobile)
├── config.js            # Secure configuration management (SecureConfig class)
├── api-client.js        # Unified API client with caching and rate limiting
├── course-catalog.js    # Course data loading, search, and filtering
├── dashboard.js         # Main controller that ties everything together
├── sample-data.json     # Course catalog data with enrollment numbers
├── .env.example         # Environment variable template (safe to commit)
├── .gitignore           # Excludes .env and other sensitive/unnecessary files
└── README.md            # This file
```

### Dependency Chain

Scripts must load in this order (defined in index.html):

1. `config.js` — Creates `appConfig` (no dependencies)
2. `api-client.js` — Needs `appConfig` for API settings
3. `course-catalog.js` — Standalone, but used by dashboard
4. `dashboard.js` — Needs all three above

---

## API Integration Details

| API | Authentication | Purpose | Rate Limit |
|-----|---------------|---------|------------|
| OpenWeatherMap | API key as URL parameter (`appid`) | Live weather for Kahului | 60 req/min |
| RapidAPI (Chuck Norris) | Custom headers (`X-RapidAPI-Key`, `X-RapidAPI-Host`) | Chuck Norris jokes | 100 req/min |
| JokeAPI (sv443.net) | None required | Programming humor | 120 req/min |

### Error Handling Strategy

Each API has fallback data defined in `api-client.js`. If an API call fails for any 
reason (network error, invalid key, timeout, rate limit), the dashboard displays 
placeholder data with an error badge instead of crashing. This is the **graceful 
degradation** pattern.

- **Timeouts:** OpenWeatherMap has a 5-second timeout; joke APIs have 3-second timeouts 
  via AbortController.
- **Caching:** Successful responses are cached for 10 minutes to reduce API calls 
  and improve performance.
- **Concurrent requests:** `Promise.allSettled()` fetches multiple APIs simultaneously 
  without one failure blocking the others.

---

## Security Checklist

- [x] API keys are **never hardcoded** in JavaScript source files
- [x] API keys are stored in browser `localStorage` (client-side development approach)
- [x] `.env` file is listed in `.gitignore` and will not be committed
- [x] `.env.example` provides a template without real credentials
- [x] API key inputs use `type="password"` to mask values in the UI
- [x] `SecureConfig` class validates that required keys are present on startup
- [x] All API configuration is centralized in a single file (`config.js`)
- [x] No API keys are visible in the HTML source code
- [x] Console warnings alert developers when keys are missing (without exposing values)

### Production Considerations

In a production environment, API keys would be managed server-side using actual 
environment variables, never stored in the browser. The `localStorage` approach 
used here is a development convenience that demonstrates the configuration management 
pattern without requiring a backend server.

---

## Testing Documentation

### API Connectivity Tests

| Test | Expected Result | Status |
|------|----------------|--------|
| OpenWeatherMap with valid key | Live weather data for Kahului | Key activation pending - fallback error handling verified |
| RapidAPI with valid key | Random Chuck Norris joke | Pass (rate limit reached during testing. Fallback displays correctly ) |
| JokeAPI (no key needed) | Random programming joke | Pass |
| OpenWeatherMap with invalid key | Fallback weather + error badge | Pass |
| RapidAPI with invalid key | Fallback joke + error message | Pass |
| All APIs unavailable | Dashboard loads with all fallback data | Pass |

### Responsive Design Tests

| Screen Size | Breakpoint | Layout | Status |
|------------|------------|--------|--------|
| Desktop | > 768px | 2-column grid | Pass |
| Tablet | ≤ 768px | 1-column, 2x2 stats | Pass |
| Mobile | ≤ 480px | 1-column, stacked | Pass |

### Functional Tests

| Feature | Test | Status |
|---------|------|--------|
| Course search | Type in search box, results filter in real-time | Pass |
| Department filter | Select department, courses filter correctly | Pass |
| Weather refresh | Click "Update Weather", new data loads | Pass |
| Joke refresh | Click "New Jokes", both jokes update | Pass |
| Data export | Click "Export Data", JSON file downloads | Pass - file contains real data |
| API key setup | Enter keys in modal, save and reload | Pass |
| Stats display | All four stat cards show correct values | Pass |
| Auto-refresh | Weather refreshes every 10 minutes | Pass |

---

## Technologies Used

- **HTML5** — Semantic markup with accessibility considerations
- **CSS3** — Grid layout, Flexbox, media queries, transitions
- **Vanilla JavaScript (ES6+)** — Classes, async/await, Promises, Fetch API
- **OpenWeatherMap API** — Weather data
- **JokeAPI** — Programming humor
- **RapidAPI** — Chuck Norris jokes
- **localStorage** — Client-side API key storage

---

## Acknowledgments

- UH Maui College ICS 385 course materials
- OpenWeatherMap, JokeAPI, and RapidAPI for free API access
- ChatGPT and Claude AI for coding assistance