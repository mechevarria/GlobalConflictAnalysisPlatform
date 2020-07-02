'use strict';

//NPM Packages
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const hbs = require('hbs');
const compression = require('compression');
const morgan = require('morgan');
const express = require('express');

let app = express();

app.set('port', process.env.PORT || 3000);
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

require('./routes')(app);

http.createServer(app)
  .listen(app.get('port'), () => {
    console.info(`http server started on port ${app.get('port')}`);
  });