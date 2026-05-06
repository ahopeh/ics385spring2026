const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const isAuthenticated = require('../middleware/isAuthenticated');
const { body, validationResult } = require('express-validator');

// POST /api/inquiries — save new inquiry from public form
router.post('/',
    body('name').trim().notEmpty().escape(),
    body('email').isEmail().normalizeEmail(),
    body('guestType').isIn(['leisure', 'research']),
    body('message').trim().escape(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        try {
            const inquiry = new Inquiry(req.body);
            await inquiry.save();
            res.status(201).json({ success: true, message: 'Inquiry received!' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Something went wrong.' });
        }
    }
  );

// GET /api/inquiries — protected, admin only
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/inquiries/stats — interest by sister property
router.get('/stats', isAuthenticated, async (req, res) => {
    try {
        const total = await Inquiry.countDocuments();
        const leisure = await Inquiry.countDocuments({ guestType: 'leisure' });
        const research = await Inquiry.countDocuments({ guestType: 'research' });

        const sisterStats = await Inquiry.aggregate([
            { $unwind: '$sisterPropertyInterest' },
            { $group: { _id: '$sisterPropertyInterest', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({ total, leisure, research, sisterStats });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;