//NPM Packages
var path = require('path');
var hbs = require('hbs');
var express = require('express');

//setting up ports

var PORT = process.env.port || 4000;

//Setting up app
var app = express();


//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


//Set up HANA Connection
var hdb    = require('@sap/hana-client');

const connection = hdb.createConnection();

const connectionParams = {
  host     : '54.88.113.194',         //'52.6.174.95', /*Add HANA IP  Here*/
  port     : 30015,
  user     : 'AAJULIAN', /*Add HANA User  Here*/
  password : 'Password0'
}

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));


//Building route to main screen
app.get('', (req, res) => {
    res.render('index', {
        title: 'Conflict Prediction',
        name: 'SAP NS2'
    })
  })

  
//CHANGE FOR INFO ON COUNTRY FSI PRED SCORES

app.get('/tractInfo', (req,res) => {

  
    var month = req.query.month;
    var crimetype = req.query.crime;
  
    //HANA DB Connection and call
    connection.connect(connectionParams, (err) => {
      //catches errors
      if (err) {
          return console.error("Connection error", err);
      }
    
      //SQL Query
      const sql = 'SELECT CRIME_TYPE, CATEGORY, REPORT_DATE, POINT.ST_ASGEOJSON() AS \"geometry\" FROM \"AARON_PRAC\".\"DETROIT\" ' +
                  ' WHERE TRACT = ' + req.query.tract + ' AND MONTH(REPORT_DATE) '+month+ ' AND CRIME_TYPE LIKE \''+crimetype+'\' ';
      console.log(sql)
      connection.exec(sql, (err, rows) => {
        // console.log('Here')
          connection.disconnect();
    
          if (err) {
              return console.error('SQL execute error:', err);
          }
  
          //Sends the data to the client
    
          //  console.log("Results:", rows);
          //  console.log(`Query '${sql}' returned ${rows.length} items`);
  
          res.send({
            data : rows
          })
      });
    });
  
  })




app.listen(PORT, () => {
  console.log('Server is up on port ' + PORT)
});
  
