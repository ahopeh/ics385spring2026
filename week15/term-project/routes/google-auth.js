const express = require('express');
const passport = require('passport');
const router = express.Router();

// GET /auth/google — initiate Google OAuth flow
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// GET /auth/google/callback — Google redirects here after consent
router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/admin/dashboard',
        failureRedirect: '/admin/login?error=1'
    })
);

module.exports = router;