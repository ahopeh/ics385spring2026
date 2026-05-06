const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    // Shared fields
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    preferredDates: { type: String },
    message: { type: String },
    guestType: { type: String, enum: ['leisure', 'research'], required: true },

    // Research guest fields
    affiliation: { type: String },
    researchFocus: { type: String },
    facilityInterest: {
        labSpace: { type: Boolean, default: false },
        quietStudyRooms: { type: Boolean, default: false },
        equipmentStorage: { type: Boolean, default: false }
    },

    // Leisure guest fields
    sisterPropertyInterest: [{
        type: String,
        enum: [
            'Hilo Garden B&B',
            'Kona Coast Vacation Rental',
            'Waimea Ranch Hotel',
            'Waipio Valley Honeymoon Cottage'
        ]
    }],
    extendedStayInterest: { type: Boolean, default: false },

    // Metadata
    status: { type: String, enum: ['new', 'read', 'responded'], default: 'new' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', inquirySchema);