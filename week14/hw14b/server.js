require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
// const MongoStore = require('connect-mongo');
const passport = require('passport');

const app = express();
app.set('view engine', 'ejs');

// connect DB
mongoose.connect(process.env.MONGODB_URI);

// body parser
app.use(express.urlencoded({ extended: true }));

// session (MUST come before passport)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// passport
require('./passport-config')(passport);
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use('/', require('./routes/auth'));

// server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});