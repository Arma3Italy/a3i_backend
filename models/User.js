const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { signsession } = require('../util');

const SessionSchema = new Schema({
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

const SessionModel = mongoose.model('Session', SessionSchema);

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
        type: [SessionSchema],
        required: false,
    },
});

UserSchema.methods.newSession = function (sessionID, ip) {
    const token = signsession(sessionID);

    const session = new SessionModel({
        token,
        ip,
    });

    this.sessions.push(session);

    return token;
}

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;