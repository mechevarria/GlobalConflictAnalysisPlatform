'use strict';

const index = require('./controllers/index');
const acled = require('./controllers/acled');
const fsi = require('./controllers/fsi');
const dbscan = require('./controllers/dbscan');
const apriori = require('./controllers/apriori');
const lda = require('./controllers/lda');

module.exports = ((app) => {
    app.use('', index);
    app.use('/fsiMapStart', fsi);
    app.use('/acledEvents', acled);
    app.use('/acledDBSCAN', dbscan);
    app.use('/acledApriori', apriori);
    app.use('/acledLDA', lda);
});