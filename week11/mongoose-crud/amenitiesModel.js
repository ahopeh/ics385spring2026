const mongoose = require('mongoose');

const amenitiesSchema = new mongoose.Schema({
    pool: { type: Boolean, default: false },
    lawn: { type: Boolean, default: false },
    BBQ: { type: Boolean, default: false },
    laundry: { type: Boolean, default: false },
});

const Amenities = mongoose.model('Amenities', amenitiesSchema);

module.exports = Amenities;