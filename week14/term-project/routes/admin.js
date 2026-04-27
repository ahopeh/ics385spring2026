const express = require('express');
const isAuthenticated = require('../middleware/isAuthenticated');
const Property = require('../models/Property');
const router = express.Router();

// GET /admin/dashboard — protected route
router.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        const properties = await Property.find({});
        res.render('admin/dashboard', {
            user: req.user,
            properties: properties
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;