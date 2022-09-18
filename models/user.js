const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const STATUS ={
    Avilable: '0',
    Busy: '1',
    DND: '2'
}

const UserSchema = new Schema({
    email:{
        type: String,
        required:  true,
        unique: true
    },
    status: {type: STATUS}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);