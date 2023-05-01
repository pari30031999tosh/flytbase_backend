const mongoose = require('mongoose');

const drones = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    drone_type: String,
    make_name: String,
    created_by: mongoose.Types.ObjectId,
    campus_id: mongoose.Types.ObjectId,
    deleted_on: {
        type: Date,
        
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

module.exports = mongoose.model('Drones', drones);