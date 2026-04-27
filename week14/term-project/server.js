require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const initPassport = require('./passport-config');

const propertyRoutes = require('./routes/properties');
const originRoutes = require('./routes/origin');
const arrivalsRoutes = require('./routes/arrivals');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session middleware — must come before passport
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { secure: false } // set to true when using HTTPS in production
}));

// Passport middleware
initPassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/properties', propertyRoutes);
app.use('/api/origin', originRoutes);
app.use('/api/arrivals', arrivalsRoutes);
app.use('/admin', authRoutes);
app.use('/admin', adminRoutes);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(3000, () => console.log('Server running on http://localhost:3000'));
    })
    .catch(err => console.error('Connection error:', err));