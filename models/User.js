const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { signsession, devLog } = require('../util');

const SessionSchema = new Schema({
    token: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    steamid: {
        type: String,
        required: true,
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
    update: { 
        type: Date,
        required: true,
        default: Date.now,
    },
    armaHours: { 
        type: Number,
        required: true,
        default: 0,
    },
    sessions: { 
        type: [SessionSchema],
        required: false,
    },
});

UserSchema.methods.newSession = function (sessionID, ip, steamid) {
    const token = signsession(sessionID);
    
    const session = new SessionSchema({
        token,
        steamid,
        ip,
    });

    this.sessions.push(session);

    
    devLog('MONGO',`new session for ID ${steamid} created`)
    return token;
}

UserSchema.methods.checkToken = function (token) {
    const session = this.sessions.filter(session => session.token === token);

    if (session.length > 0) return { err: null, session, user: this };
    return { err: 'No session found' };
}

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;