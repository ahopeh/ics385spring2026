# Week 10 — Term Project 3: Property Schema & Seed Data

## Hale Ōhiʻa Lehua | Big Island Eco-Lodge

### Project Overview
This week marks the beginning of Term Project 3 for ICS 385. I chose the Big Island 
because the volcanic and ecological data available through the DBEDT dashboard will 
provide rich metrics for the dashboard I'll build in later weeks. The eco-lodge concept felt personally meaningful given my background in ecological stewardship — Hale Ōhiʻa Lehua is a fictional property near Volcano National Park targeting eco-tourists.

### What I Built
- A Mongoose `Property` schema with fields for name, island, type, description, 
amenities, targetSegment, and imageURL
- A `seed.js` script that inserts 5 made-up properties (my initial idea and 4 other imagined properties also on Hawaiʻi island) into MongoDB
- Connected and verified both local MongoDB and MongoDB Atlas

### Properties Seeded
1. Hale Ōhiʻa Lehua — eco-lodge near Volcano NP (eco-tourists)
2. Hilo Garden B&B — family friendly (family travelers)
3. Kona Coast Vacation Rental — ocean views, coffee and chocolate (returning visitors)
4. Waimea Ranch Hotel — paniolo country, horse ranch inspired (adventure seekers)
5. Waipio Valley Honeymoon Cottage — jungle and waterfalls (honeymooners)

### Tech
- Node.js
- MongoDB + Mongoose
- MongoDB Atlas (cloud)
- dotenv

### Setup Instructions
1. Clone the repo
2. Navigate to `week10/term-project/`
3. Run `npm install`
4. Create a `.env` file with your MongoDB URI:
```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/haleOhiaLehua
```
5. Run `node seed.js`

### Reflections
The hardest part of this week was troubleshooting the Atlas connection. I kept 
updating the wrong `.env` file — I was editing the one in my Week 9 folder instead 
of Week 10, which meant my changes weren't being picked up. Tracing back through 
the problem and staying patient when something should be working but isn't is one 
of the harder parts of this kind of work in my opinion — but I stuck with it and got there.

What surprised me most was realizing how much I've actually learned. I could use 
the terminal and VS Code to troubleshoot, compose a schema and seed script from 
scratch, and move data between my local environment and the cloud. I still hit 
difficult moments, but I felt equipped and comfortable in the work, which felt like an achievement.

### AI Attribution / Acknowledgement 
This project was completed with assistance from Claude (Anthropic) as a 
collaborative learning tool. All the code was written by me (April) directly, and all comments to provide explanation and reference were written my me entirely. 