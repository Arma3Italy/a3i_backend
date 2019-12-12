const express = require('express');
const app = express();
const session = require('express-session');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const { server: { port, sessionKey, mongoUri } } = require('../config.js');
const { devLog } = require('../util');

app.use(cookieParser());
app.use(session({
    secret: sessionKey,
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: true,
        secure: false,
        // maxAge: 30000,
        // expires: new Date(Date.now() + 30000),
    }
}));
mongoose.connect(mongoUri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
}, (err) => {
    if (err) return console.log(err);
    devLog('SERVER','Connected to mongodb');
});

app.use('/server',require('../api/server'));
app.use('/auth',require('../api/auth'));
app.use('/user',require('../api/user'));

app.listen(port, () => {
    devLog('SERVER',`Server started on ${port}`);
});
