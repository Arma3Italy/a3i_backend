const express = require('express');
const app = express();
const cfg = require('../config');

app.listen(cfg.server.port, () => {
    console.log(`[SERVER] > Server started on ${cfg.server.port}`);
});