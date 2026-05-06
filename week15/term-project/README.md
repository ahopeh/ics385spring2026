# Hale ʻŌhiʻa Lehua — Hawaii Hospitality Dashboard
**Live URL:** https://hale-ohia-lehua.onrender.com  
**GitHub:** https://github.com/ahopeh/ics385spring2026/tree/main/week15/term-project

A full-stack hospitality web application for a fictional eco-lodge near Hawaiʻi Volcanoes 
National Park, built across Weeks 10–15 of ICS 385. The property serves two visitor 
segments — Research Guests and Leisure Guests — and is guided by the principle of 
Two-Eyed Seeing, balancing Western scientific inquiry with traditional Hawaiian knowledge.

---

## Pages
- **Marketing Page** — Hero with live Kīlauea webcam, About, Amenities, Conditions 
  Snapshot, and dual CTAs with inquiry modals for Leisure and Research guests
- **Visitor Dashboard** — Live USGS volcanic conditions, OpenWeatherMap weather widget, 
  Chart.js visitor statistics with island filter, DBEDT origin data
- **Admin Login** (`/admin/login`) — Local email/password or Google OAuth 2.0
- **Admin Dashboard** (`/admin/dashboard`) — Protected. Displays properties, real-time 
  inquiry feed, and sister property interest widget

---

## Technology Stack
- **Frontend:** React 19, Vite, Chart.js, Framer Motion
- **Backend:** Node.js, Express 4, EJS
- **Database:** MongoDB Atlas, Mongoose
- **Authentication:** Passport.js (LocalStrategy + Google OAuth 2.0), bcrypt, express-session, connect-mongo
- **Security:** Helmet.js, express-validator
- **APIs:** OpenWeatherMap, USGS HANS, USGS HVO YouTube, DBEDT Hawaii Tourism Authority
- **Testing:** Jest, Supertest
- **Deployment:** Render (backend), Vite dev server (frontend)

---

## Setup Instructions
1. Clone the repo
2. Navigate to `week15/term-project/`
3. Run `npm install`
4. Copy `.env.example` to `.env` and fill in values:
5. Run `node server.js` (backend, port 3000)
6. Navigate to `client/` and run `npm install` then `npm run dev` (frontend, port 5173)

---

## Acceptance Criteria Results

| ID | Description | Result |
|----|-------------|--------|
| AC-1 | Marketing page loads with property name and amenities | ✅ Pass |
| AC-2 | Visitor dashboard renders Chart.js visualizations | ✅ Pass |
| AC-3 | Local login with correct credentials redirects to dashboard | ✅ Pass |
| AC-4 | Wrong credentials redirects to login with error | ✅ Pass |
| AC-5 | Unauthenticated /admin/dashboard redirects to login | ✅ Pass |
| AC-6 | Logout destroys session | ✅ Pass |
| AC-7 | Google OAuth sign-in creates user with googleId | ✅ Pass |
| AC-8 | Inquiry modal submits to MongoDB | ✅ Pass |
| AC-9 | Admin dashboard displays inquiries and sister property widget | ✅ Pass |

---

## Weekly Arc Summary
- **Week 10:** Mongoose Property schema, seed data, MongoDB Atlas connection
- **Week 11:** Express REST routes, EJS templates, embedded review schema
- **Week 12:** React marketing page, component hierarchy, prop drilling
- **Week 13:** Visitor dashboard, Chart.js visualizations, DBEDT CSV pipeline, live APIs
- **Week 14:** Passport.js LocalStrategy, bcrypt, session management, admin login/dashboard
- **Week 15:** Google OAuth 2.0, guest inquiry system, Helmet.js, express-validator, Jest tests, Render deployment

---

## AI Tools Used
Claude (Anthropic) was used as a collaborative learning tool throughout this project. 
Claude assisted with component structure, debugging, CSS styling, code generation, 
and grammar editing on the PRD. All architectural decisions, design choices, and 
security design were reasoned through and understood by me. 

---

## Test Output
![Jest test output showing 3 passing tests](/week15/term-project/docs/Week15/TestSuccess.png)
