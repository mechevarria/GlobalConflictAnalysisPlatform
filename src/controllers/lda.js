'use strict';
module.exports = (req, res) => {
    const connection = req.db.connection;
    const config = req.db.config;

    //HANA DB Connection and call
    connection.connect(config, (err) => {
        //catches errors
        if (err) {
            res.status(500).json({ error: `[Connection error]: ${err.message}` });
        }

        const year = req.query.year;
        const capital = req.query.capital;
        const slider = req.query.slider;

        var covid_data = slider == 'true' ? 8000000 : 0;

        console.log(capital);
    
        //SQL Query
        let sql = 'SELECT * FROM ACLED_LDA_VIEW (PLACEHOLDER."$$yr$$"=>?, PLACEHOLDER."$$capital$$" =>  ?, PLACEHOLDER."$$covid$$"=> ?);'
        const bindParams = [parseInt(year), capital, parseInt(covid_data)];

        console.log(sql, bindParams)
        connection.exec(sql, bindParams, (err, rows) => {
            // console.log('Here')
            connection.disconnect();

            if (err) {
                res.status(500).json({ error: `[SQL execute error]: ${err.message}` });
            }

            //Sends the data to the client

            //  console.log("Results:", rows);
            //  console.log(`Query '${sql}' returned ${rows.length} items`);

            res.send({
                data: rows
            });
        });
    });
};