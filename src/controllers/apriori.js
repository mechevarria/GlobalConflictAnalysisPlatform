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

        const year = req.query.year
        const capital = req.query.capital

        const eventsList = [
            { name: 'Battles', type: req.query.battles },
            { name: 'Explosions%', type: req.query.explosions },
            { name: 'Protests', type: req.query.protests },
            { name: 'Riots', type: req.query.riots },
            { name: 'Strategic%', type: req.query.strategic },
            { name: 'Violence%', type: req.query.violence }
        ].filter((input) => {
            return input.type === 'true'
        });

        console.log(eventsList);

        let sql = '';

        const bindParams = [parseInt(year), capital];
        if (eventsList.length >= 1) {

            let addedSQL = '';

            eventsList.forEach((event, index) => {
                if (index === 0) {
                    addedSQL += '?';
                } else {
                    addedSQL += ' OR CONSEQUENT LIKE ?';
                }
                bindParams.push(`%${event.name}%`);
            });

            //SQL Query
            sql +=
                `SELECT TOP 30 ANTECEDENT, CONSEQUENT, CONFIDENCE FROM ACLED_APRIORI_VIEW (PLACEHOLDER."$$yr$$"=>?, PLACEHOLDER."$$capital$$" =>  ? )
                WHERE CONSEQUENT LIKE ${addedSQL}
                ORDER BY LIFT, CONFIDENCE DESC;
                `

        } else {

            //SQL Query
            sql +=
                `SELECT TOP 30 * FROM ACLED_APRIORI_VIEW (PLACEHOLDER."$$yr$$"=>?, PLACEHOLDER."$$capital$$" => ?)
            ORDER BY LIFT, CONFIDENCE DESC;
            `
        }
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
            })
        });
    });
};