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
    ip: {
        type: String,
        required: false,
    },
    expire_date: {
        type: Date,
        required: true,
    },
});

const UserSchema = new Schema({
    user_info: {
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
        armaHours: { 
            type: Number,
            required: true,
            default: 0,
        },
    },
    signup_date: { 
        type: Date,
        required: true,
    },
    profileUpdate_date: { 
        type: Date,
        required: true,
    },
    sessions: { 
        type: [SessionSchema],
        required: false,
    },
});

UserSchema.methods.newSession = function (sessionID, ip, steamid) {
    const token = signsession(sessionID);
    const date = new Date()
    const expire_date = date.setDate(date.getDate() + 7)

    const session = {
        ip,
        token,
        expire_date,
    };

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