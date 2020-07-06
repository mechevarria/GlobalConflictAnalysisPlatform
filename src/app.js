'use strict';

//NPM Packages
const bodyParser = require('body-parser');
const path = require('path');
const hbs = require('hbs');
const compression = require('compression');
const morgan = require('morgan');
const express = require('express');

let app = express();

app.use(morgan('combined'));
app.use(bodyParser.json({ extended: true }));
app.use(compression());

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

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

const router = express.Router();
router.route('').get(indexCtrl);
router.route('/fsiMapStart').get(fsiCtrl);
router.route('/acledEvents').get(acledCtrl);
router.route('/acledDBSCAN').get(dbscanCtrl);

app.use('/', router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.info(`http server started on port ${port}`);
});