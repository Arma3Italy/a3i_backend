const express = require('express');
const router = express.Router();
const UserModel = require('../models/User.js');
const { devLog } = require('../util');

router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const checkAuth = function (req, res, next) {
    const token = req.cookies.authToken;

    return UserModel.find().then(usr => {
        return usr.forEach(user => {
            const check = user.checkToken(token);

            if (check.err === null) return next();

            return res.json({
                auth: "NO",
                sessionID: req.sessionID,
                session: req.session,
                cookie: req.cookies
            });
        });
    })
};

router.get('/', (req, res) => {
    res.json({ status: 'server ok' });
});

router.get('/:id', (req, res) => {
    UserModel.findOne({ steamid: req.params.id }).then(user => {
        if (!user) {
            devLog('MONGO', 'search user - not found');
            return res.status(404).json({ user: null });
        }
        devLog('MONGO', `search user - found > ${user.steamid}`);

        return res.json({ user });
    }).catch(() => {
        devLog('MONGO', `search user - error`);
        return res.status(404).json({ user: null });
    });
});

module.exports = router;