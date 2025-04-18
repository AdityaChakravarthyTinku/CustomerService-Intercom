const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    name: { type: String, required: true },
    image:{type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
