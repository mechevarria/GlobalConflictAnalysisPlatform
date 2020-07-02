'use strict';
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Conflict Prediction',
        name: 'SAP NS2'
    });
});

module.exports = router;