const mongoose = require('mongoose');

const users = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: {
       type: String,
       required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: String,
    campus: {
        type: Array,
    },
    categories: {
        type: Array,
    }
})

module.exports = mongoose.model('Users', users);