const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}, {timeStamps: true});

const categoryModel = mongoose.model('category', categorySchema);

module.exports = categoryModel;