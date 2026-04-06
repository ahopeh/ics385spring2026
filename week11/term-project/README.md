# Week 11 — Term Project 3: Review Schema & Express Routes
## Hale Ōhiʻa Lehua | Big Island Eco-Lodge

### What I Built This Week
This week I expanded the Week 10 Property schema by embedding a Review sub-schema,
built three Express REST API routes, and wired everything together with a MongoDB
Atlas connection and EJS view engine setup.
- Tested all three routes in Postman and exported the collection as `postman_collection.json`

### Changes from Week 10
- Added a `reviewSchema` embedded inside `propertySchema` with fields for
  guestName, rating (1–5), comment, and date
- Built three Express routes in `routes/properties.js`:
  - `GET /properties` — returns all Big Island properties
  - `GET /properties/:id` — returns a single property by ID
  - `POST /properties/:id/reviews` — adds a review and filters by `$gte` rating
- Configured EJS as the view engine in `app.js`
- Connected to MongoDB Atlas via `.env`

### Tech Stack
- Node.js / Express
- MongoDB Atlas + Mongoose
- EJS
- dotenv

### Setup Instructions
1. Navigate to `week11/term-project/`
2. Run `npm install`
3. Create a `.env` file with your MongoDB URI: