const express = require('express');
const app = express();
const cfg = require('../config');

app.use('/server',require('../api/server'));

app.listen(cfg.server.port, () => {
    console.log(`[SERVER] > Server started on ${cfg.server.port}`);
});