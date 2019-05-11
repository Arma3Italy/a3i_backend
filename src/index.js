const express = require('express');
const app = express();
const session = require('express-session');
const { server: { port, sessionKey } } = require('../config.js');

app.use(session({
    secret: sessionKey,
    saveUninitialized: true,
    resave: false,
    cookie: {
        httpOnly: true,
        secure: false
    }
}));

app.use('/server',require('../api/server'));
app.use('/auth',require('../api/auth'));

app.listen(port, () => {
    console.log(`[SERVER] > Server started on ${port}`);
});
