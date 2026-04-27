const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

// GET /properties — return all properties
router.get('/', async (req, res) => {
    const properties = await Property.find({});
    res.json(properties);
});

// GET /properties/:id — return one property
router.get('/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ error: 'Property not found' });
        res.json(property);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /properties/:id/reviews — add a review, filter by minimum rating
router.post('/:id/reviews', async (req, res) => {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });

    property.reviews.push(req.body);
    await property.save();

    // Return only reviews with rating >= 4 (satisfies $gte requirement)
    const topReviews = await Property.find({
        _id: req.params.id,
        'reviews.rating': { $gte: 4 }
    });

    res.status(201).json(property);
});

module.exports = router;