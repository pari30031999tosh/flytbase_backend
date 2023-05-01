const mongoose = require('mongoose');

const missions = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    droneId: String,
    categoryId: String,
    alt: Number,
    speed: Number,
    name: String,
    campus_id: String,
    category_id: String,
    waypoints: {
        type: Array
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Missions', missions);