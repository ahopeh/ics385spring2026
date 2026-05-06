# Week 14 — Term Project: Hale ʻŌhiʻa Lehua
## Admin Authentication with Passport.js
### ICS 385 Spring 2026 | April Torres

---

### Overview
Week 14 extends my full-stack term-project by adding a complete admin authentication layer using Passport.js, bcrypt, password hashing, and MongoDB-backed session management. Also I focused on ensuring that my project's structure was fully contained to one project forward, which will streamline copying-forward in week 15. 

---

### Deliverables
- screenshots:
    - [DashboardAfterLogin](/week14/term-project/docs/week14/AdminDashboardAfterLogin.png)
    - [AdminPortalLoginScreen](/week14/term-project/docs/week14/AdminPortalLoginScreen.png)
    - [MongoDBHashedPasswords](/week14/term-project/docs/week14/MongoDBHashedPasswords.png)
- [reflection-paragraph](/week14/term-project/docs/week14/reflection-paragraph.md)


### Pages
- **Marketing Page** — Hero with live Kīlauea video, About, Amenities, 
  Conditions Snapshot, dual CTAs for Leisure and Research guests
- **Visitor Dashboard** — Live webcam, current conditions, visitor statistics, 
  Chart.js visualizations, island selector
- **Admin Login** (`/admin/login`) - Protected login form with property branding, error handling, and mobile-responsive layout.
- **Admin Dashboard** (`/admin/dashboard`) - Protected route displaying all properties from MongoDB, review counts, and admin controls. Only accessible via authentication. 

---

### What I Built This Week

**Project Restructure:**
- Unified Week 11 Express backend and Week 13 Vite/React frontend into a single
  `week14/term-project/` folder
- Resolved CommonJS vs ES module conflict by separating backend (`package.json` 
  at root with `"type": "commonjs"`) and frontend (`client/package.json` with 
  `"type": "module"`)

**Authentication Layer:**
- `models/User.js` — Mongoose schema with bcrypt pre-save hook (10 salt rounds)
  and `comparePassword` instance method
- `passport-config.js` — LocalStrategy configured with `usernameField: 'email'`,
  serializeUser/deserializeUser lifecycle
- `middleware/isAuthenticated.js` — Route guard redirecting unauthenticated 
  requests to `/admin/login`
- `routes/auth.js` — GET/POST `/admin/login`, GET `/admin/logout`
- `routes/admin.js` — Protected `/admin/dashboard` route
- `seed-admin.js` — One-time admin user creation script (excluded from GitHub 
  via `.gitignore`). Admin password loaded from `ADMIN_PASSWORD` in `.env`.

**Session Management:**
- `express-session` with `connect-mongo` store — sessions persist across 
  server restarts in MongoDB Atlas

---

### Security Notes
- Passwords stored as bcrypt hashes (`$2b$10$...`) — plain text never touches 
  the database
- `.env` excluded from GitHub via `.gitignore` — contains `MONGO_URI`, 
  `SESSION_SECRET`, and (temporarily during setup) `ADMIN_PASSWORD`
- `seed-admin.js` excluded from GitHub via `.gitignore`
- Admin email documented here: `admin@haleohialehua.com`
- Admin password: stored securely by admin, never committed

---

### APIs & Data Sources
- OpenWeatherMap API — current weather for Volcano, Hilo, Kona, Waimea
- USGS HANS Public API — Kīlauea alert level and activity summary
  (volcanoes.usgs.gov/hans-public/api/volcano/getMonitoredVolcanoes)
- USGS HVO YouTube — live V3cam webcam stream
- DBEDT Hawaii Tourism Authority Data Warehouse — visitor origin CSV
- MongoDB Atlas — property data and session store

---

### Setup
This project runs as a unified full-stack application from a single folder.

**Backend + Frontend:**
1. Navigate to `week14/term-project/`
2. Create `.env` with the following:

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