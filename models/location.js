const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    lat: {
        type: String
    },
    long: {
        type: String
    },
    actualAddress: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
}, {timeStamps: true});

const locationModel = mongoose.model('locations', locationSchema);

module.exports = locationModel;