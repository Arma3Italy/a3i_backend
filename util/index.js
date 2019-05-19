const crypto = require('crypto');
const { server: { signKey } } = require('../config.js');

function signsession(sessionid) {
    const hmac = crypto.createHmac('sha256', signKey);
    const hash = hmac.update(sessionid).digest('hex');
    const token = Buffer.from(`${sessionid}.${hash}`).toString('base64');

    return token;
}

function devLog(type, msg) {
    console.log(`[${type}] > ${msg}`)
}

module.exports = { signsession, devLog }