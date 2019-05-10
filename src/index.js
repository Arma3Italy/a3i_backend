const express = require('express');
const app = express();
const cfg = require('../config');

console.log('[EXPRESS] > app starter');

app.use('/server',require('../api/server'));
app.use('/auth',require('../api/auth'));

app.listen(cfg.server.port, () => {
    console.log(`[SERVER] > Server started on ${cfg.server.port}`);
});
