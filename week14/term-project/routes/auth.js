const express = require('express');
const passport = require('passport');
const router = express.Router();

// GET /admin/login — show login form
router.get('/login', (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/admin/dashboard');
    const error = req.query.error ? 'Invalid credentials. Please try again.' : null;
    res.render('admin/login', { error });
});

// POST /admin/login — Passport verifies credentials
router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/admin/dashboard',
        failureRedirect: '/admin/login?error=1'
    })
);

// GET /admin/logout — destroy session
router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect('/admin/login');
    });
});

module.exports = router;