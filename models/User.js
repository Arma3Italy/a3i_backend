const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { signsession } = require('../util');

const Session = new Schema({
    token: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    ip: {
        type: String,
        required: false,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const UserSchema = new Schema({
    steamid: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    date: { 
        type: Date,
        required: true,
        default: Date.now,
    },
    sessions: { 
        type: [Session],
        required: false,
    },
});

UserSchema.methods.newSession = function (sessionID) {
    const token = signsession(sessionID);
}

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;