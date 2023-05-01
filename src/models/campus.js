const mongoose = require('mongoose');

const campus = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    created_by: String,
    site_name: String,
    position : {
        latitude: Number,
        longitude: Number
    },
    missions: {
        type: Array
    },
    drones: {
        type: Array
    }
})

module.exports = mongoose.model('Campus', campus);