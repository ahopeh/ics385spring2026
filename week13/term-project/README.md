# Week 13 — Term Project: Hale ʻŌhiʻa Lehua
## React Visitor Statistics Dashboard
### ICS 385 Spring 2026 | April Torres

---

### Overview
Week 13 extends the Hale ʻŌhiʻa Lehua React marketing page (Week 12) with a 
full Visitor Statistics Dashboard. The dashboard is currently public-facing. I'm considering placing it behind auth in week 14. 

---

### Deliverables
- [screenshots](/week13/term-project/docs/)
- [reflection-paragraph](/week13/term-project/docs/reflection-paragraph.md)


### Pages
- **Marketing Page** — Hero with live Kīlauea video, About, Amenities, 
  Conditions Snapshot, dual CTAs for Leisure and Research guests
- **Visitor Dashboard** — Live webcam, current conditions, visitor statistics, 
  Chart.js visualizations, island selector
- **Admin** — Placeholder, Passport.js authentication coming Week 14

---

### What I Built This Week

**Live Data Integrations:**
- Live Kīlauea summit webcam stream (USGS HVO V3cam via YouTube)
- Real-time weather via OpenWeatherMap API for Volcano, Hilo, Kona, and Waimea
- Live USGS volcanic alert level and activity summary via USGS HANS public API
- Expand-in-place activity summary pulled from USGS notice endpoint

**Visitor Statistics Dashboard:**
- Three KPI metric cards (Avg Daily Rate, Occupancy Rate, Avg Length of Stay)
- Color-coded multi-select island filter using toggleable buttons (useState)
- Animated volcano loading graphic while API calls resolve
- Universal navigation header across marketing page and dashboard

**Chart.js Visualizations:**
1. Visitor Arrivals — horizontal bar chart, research vs leisure by month, 
   filterable by island (synthetic placeholder data, DBEDT pipeline planned Week 14)
2. Length of Stay vs Research Facility Rental — horizontal bar chart showing 
   correlation by month (synthetic placeholder data, documented as such)
3. Visitor Origin — dual-mode chart:
   - International view: donut chart with US vs International split in center, 
     international market breakdown in slices (Japan, Canada, Europe, etc.)
   - US States view: horizontal bar chart sorted largest to smallest, 
     color-coded by region (West, Southwest, Midwest, South, Northeast)

**Real DBEDT Data Pipeline:**
Visitor origin chart uses real data from the DBEDT Hawaii Tourism Authority 
Data Warehouse CSV (Hawaii Island, 2025–2026). 

Full pipeline:
1. DBEDT CSV downloaded from dbedt.hawaii.gov/visitor/tourismdata/
2. CSV stored in week11/term-project/data/
3. Parsed server-side using csv-parse in Express route GET /api/origin
4. React fetches via useEffect on mount and on filter/month change
5. Chart.js renders with toggle between International and US States views
6. Month selector dropdown populated dynamically from available CSV columns

---

### Data Notes
- Visitor arrivals bar charts use synthetic placeholder data approximating 
  DBEDT Hawaii Tourism Authority patterns. Real DBEDT CSV integration planned 
  for Week 14 via Express route GET /api/arrivals?island=Hawaii.
  TODO: Replace hawaiiData.js arrival data with live DBEDT pipeline.
- Visitor origin chart uses REAL DBEDT data (Hawaii Island, Jan 2025–Feb 2026).
- Research facility correlation data is synthetic, generated to demonstrate 
  the visualization. In production this would pull from internal booking records 
  via the existing MongoDB backend.
- VOG index displays placeholder levels (Low/Moderate) pending Hawaii DOH 
  Air Quality API integration, planned for the full Conditions page in Week 15.

---

### APIs & Data Sources
- OpenWeatherMap API — current weather for Volcano, Hilo, Kona, Waimea
- USGS HANS Public API — Kīlauea alert level and activity summary
  (volcanoes.usgs.gov/hans-public/api/volcano/getMonitoredVolcanoes)
- USGS HVO YouTube — live V3cam webcam stream
- DBEDT Hawaii Tourism Authority Data Warehouse — visitor origin CSV

---

### Setup
This project requires two servers running simultaneously:

**Backend (Week 11 Express server):**
1. Navigate to `week11/term-project/`
2. Create `.env` with your MongoDB URI ( MONGO_URI=your_mongodb_connection_string)
3. Run `npm install`
4. Run `node app.js` (runs on port 3000)

**Frontend (Week 13 Vite React app):**
1. Navigate to `week13/term-project/`
2. Create `.env` with your OpenWeatherMap key (VITE_WEATHER_KEY=your_openweathermap_key)
3. Run `npm install`
4. Run `npm run dev` (runs on port 5173)

---

### AI Attribution
Built with Claude (Anthropic) as a collaborative learning tool across multiple 
sessions. All architectural decisions, design choices, API integrations, and 
data pipeline design were reasoned through and understood by me. Claude assisted 
with component structure, debugging, CSS styling, and code generation. All code 
was reviewed and understood before implementation. 