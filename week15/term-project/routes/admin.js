const express = require('express');
const isAuthenticated = require('../middleware/isAuthenticated');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const router = express.Router();

// GET /admin/dashboard — protected route
router.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        const properties = await Property.find({});
        const inquiries = await Inquiry.find({}).sort({ createdAt: -1 }).limit(10);
        const totalInquiries = await Inquiry.countDocuments();
        const leisureCount = await Inquiry.countDocuments({ guestType: 'leisure' });
        const researchCount = await Inquiry.countDocuments({ guestType: 'research' });

        const sisterStats = await Inquiry.aggregate([
            { $unwind: '$sisterPropertyInterest' },
            { $group: { _id: '$sisterPropertyInterest', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
    
        res.render('admin/dashboard', {
            user: req.user,
            properties,
            inquiries,
            totalInquiries,
            leisureCount,
            researchCount,
            sisterStats
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;