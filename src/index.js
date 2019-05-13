const express = require('express');
const app = express();
const session = require('express-session');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const { server: { port, sessionKey, mongoUri } } = require('../config.js');

app.use(cookieParser());
app.use(session({
    secret: sessionKey,
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: true,
        secure: false,
    }
}));

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
});

app.use('/server',require('../api/server'));
app.use('/auth',require('../api/auth'));

app.listen(port, () => {
    console.log(`[SERVER] > Server started on ${port}`);
});
