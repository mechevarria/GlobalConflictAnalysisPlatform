'use strict';
module.exports = (req, res) => {
    const connection = req.db.connection;
    const config = req.db.config;


    //HANA DB Connection and call
    connection.connect(config, (err) => {
        //catches errors
        if (err) {
            return console.error('Connection error', err);
        }


        var year = req.query.year
        var capital = req.query.capital
    
            //SQL Query
            var sql = 
                `SELECT * FROM ACLED_LDA_VIEW (PLACEHOLDER."$$yr$$"=>${year}, PLACEHOLDER."$$capital$$" =>  '${capital}' );`

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
                data: rows
            })
        });
    });
};