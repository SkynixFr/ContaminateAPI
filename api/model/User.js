const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
    email: String,
    username: String,
    password: String,
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Users', UserSchema);