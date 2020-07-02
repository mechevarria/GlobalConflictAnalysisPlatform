'use strict';

const index = require('./controllers/index');
const acled = require('./controllers/acled');
const fsi = require('./controllers/fsi');

module.exports = ((app) => {
    app.use('', index);
    app.use('/fsiMapStart', fsi);
    app.use('/acledEvents', acled);
});