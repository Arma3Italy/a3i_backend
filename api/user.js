const express = require('express');
const router = express.Router();
const UserModel = require('../models/User.js');

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

module.exports = router;