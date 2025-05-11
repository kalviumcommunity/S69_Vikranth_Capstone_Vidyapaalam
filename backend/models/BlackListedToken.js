const mongoose = require('mongoose');

const BlacklistedTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), 
    },
});

module.exports = mongoose.model('BlacklistedToken', BlacklistedTokenSchema);

