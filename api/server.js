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

router.get('/list', checkAuth, (req, res) => {
    res.json([
        { name: "OF", players: 85 },
        { name: "TWG", players: 64 },
        { name: "THG", players: 49 },
        { name: "FLS", players: 34 }
    ]);
});

module.exports = router;