const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    title: String,
    description: String,
    image: {
        url: String,
        filename: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    members:{
        type: Array,
        ref:'User',
    }
});

module.exports = mongoose.model('Group', GroupSchema);