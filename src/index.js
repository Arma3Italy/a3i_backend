const express = require('express');
const app = express();
const session = require('express-session');
const cfg = require('../config');

app.use(session({
    secret: 'gz3g35z3fz5gz43h6365u3fgz',
    saveUninitialized: true,
    resave: false,
    cookie: {
        httpOnly: true,
        secure: false
    }
}));

app.use('/server',require('../api/server'));
app.use('/auth',require('../api/auth'));

app.listen(cfg.server.port, () => {
    console.log(`[SERVER] > Server started on ${cfg.server.port}`);
});
