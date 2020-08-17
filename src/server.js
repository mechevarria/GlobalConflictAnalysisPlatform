'use strict';

//NPM Packages
const bodyParser = require('body-parser');
const path = require('path');
const compression = require('compression');
const morgan = require('morgan');
const express = require('express');

let app = express();

app.use(morgan('combined'));
app.use(bodyParser.json({ extended: true }));
app.use(compression());

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

// inject hana connection info each route
const middleware = require('./middlewares/db');
app.use(middleware);

// configure routes
const indexCtrl = require('./controllers/index');
const acledCtrl = require('./controllers/acled');
const fsiCtrl = require('./controllers/fsi');
const dbscanCtrl = require('./controllers/dbscan');
const aprioriCtrl = require('./controllers/apriori');
const ldaCtrl = require('./controllers/lda');

const router = express.Router();
router.route('').get(indexCtrl);
router.route('/fsiMapStart').get(fsiCtrl);
router.route('/acledEvents').get(acledCtrl);
router.route('/acledDBSCAN').get(dbscanCtrl);
router.route('/acledApriori').get(aprioriCtrl);
router.route('/acledLDA').get(ldaCtrl);

app.use('/', router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.info(`http server started on port ${port}`);
});