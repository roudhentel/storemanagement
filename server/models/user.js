let mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
    Fullname: String,
    Username: String,
    Password: String,
    CreateDate: Date,
    RoleId: String
}));