const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, default: null },
    displayName: { type: String },
    googleId: { type: String, default: null },
    provider: { type: String, enum: ['local', 'google'], default: 'local' },
    role: { type: String, enum: ['admin', 'user'], default: 'admin' },
    createdAt: { type: Date, default: Date.now }
});

// Only hash password if it exists and was modified
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    next();
});

userSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);