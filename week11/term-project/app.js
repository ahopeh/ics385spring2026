const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config()
const propertyRoutes = require('./routes/properties');
const originRoutes = require('./routes/origin');
const app = express();




// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/properties', propertyRoutes);
app.use('/api/origin', originRoutes)

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(3000, () => console.log('Server running on http://localhost:3000'));
    })
    .catch(err => console.error('Connection error:', err));