const express = require('express');
const router = express.Router();

console.log('[EXPRESS] > server route');

router.get('/', (req, res) => {
    res.json({ status: 'server ok' });
});

module.exports = router;