const mongoose = require('mongoose');

const category = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    user_id: String,
    name: String,
    color: String,
    tag_name: String,
    missions: {
        type: Array,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('Category', category);