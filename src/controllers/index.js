'use strict';

module.exports = (req, res) => {
    res.render('index', {
        title: 'Conflict Prediction',
        name: 'SAP NS2'
    });
};