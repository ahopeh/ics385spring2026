// routes/auth.js
const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const isAuthenticated = require('../middleware/isAuthenticated');

const router = express.Router();

// register page
router.get('/register', (req, res) => {
    res.render('register');
});

// register user
router.post('/register', async (req, res) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password
    });

    await user.save();
    res.redirect('/login');
});

// login page
router.get('/login', (req, res) => {
    res.render('login');
});

// login
router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect: '/login'
    })
);

// protected route
router.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.user });
});

// logout
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/login');
    });
});

module.exports = router;