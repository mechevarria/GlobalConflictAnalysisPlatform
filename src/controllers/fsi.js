'use strict';
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const connection = req.db.connection;
    const config = req.db.config;
    var year = req.query.year;
    var region = req.query.region;

    console.log(year, region)

    //HANA DB Connection and call
    connection.connect(config, (err) => {
        //catches errors
        if (err) {
            return console.error('Connection error', err);
        }

        //SQL Query
        const sql = `
        SELECT shape.St_asgeojson() AS SHAPE,
               "capital",
               score,
               confidence,
               "country"
        FROM
            (SELECT shape,
                    "capital",
                    score,
                    confidence,
                    "country",
                    Rank() OVER (PARTITION BY "country"
                                 ORDER BY confidence DESC) AS RANKS
             FROM
                fsi_final
             WHERE
                "region" LIKE ? AND "year" = ?)
        WHERE RANKS = 1
        `;

        console.log(sql)
        connection.exec(sql, [region, year], (err, rows) => {
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
});

module.exports = router;