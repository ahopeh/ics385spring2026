const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    location: { type: String, required: true },
    description: { type: String },
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;