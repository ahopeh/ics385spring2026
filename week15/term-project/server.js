require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const initPassport = require('./passport-config');
const helmet = require('helmet');

const propertyRoutes = require('./routes/properties');
const originRoutes = require('./routes/origin');
const arrivalsRoutes = require('./routes/arrivals');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();

// Security
app.use(helmet());

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
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    }
}));

// Passport middleware
initPassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Serve React frontend
app.use(express.static(path.join(__dirname, 'client/dist')));

// Routes
app.use('/properties', propertyRoutes);
app.use('/api/origin', originRoutes);
app.use('/api/arrivals', arrivalsRoutes);
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/admin', authRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', require('./routes/google-auth'));

// Catch-all: serve React app for any non-API route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

// Export for Jest
module.exports = app;

// Connect to MongoDB and start server
if (require.main === module) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('MongoDB connected');
            app.listen(3000, () => console.log('Server running on http://localhost:3000'));
        })
        .catch(err => console.error('Connection error:', err));
}