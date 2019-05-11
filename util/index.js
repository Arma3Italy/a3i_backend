const crypto = require('crypto');
const KEY = 'sadfg43t43tv23tf';

function signsession(sessionid) {
    const hmac = crypto.createHmac('sha256', KEY);
    const hash = hmac.update(sessionid).digest('hex');
    const token = Buffer.from(`${sessionid}.${hash}`).toString('base64');

    return token;
}

module.exports = { signsession }