'use strict';
module.exports = (req, res) => {
    const connection = req.db.connection;
    const config = req.db.config;
    var year = req.query.year;
    var region = req.query.region;

    console.log(year, region)

    if (year == 2020) {
        year = 2019;
    }

    //HANA DB Connection and call
    connection.connect(config, (err) => {
        //catches errors
        if (err) {
            return res.status(500).json({ error: `[Connection error]: ${err.message}` });
        }

        //SQL Query
        const sql = 
        // `
        // SELECT "capital", SCORE, "CONFIDENCE", "countries", SHAPE.ST_ASGEOJSON()
        // FROM FSI_PRED_FULL
        // WHERE "region" LIKE ?
        //       AND "year" = ?
        // `



         `
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
        `

        const bindParams = [region, parseInt(year)];
        console.log(sql, bindParams)
        connection.exec(sql, bindParams, (err, rows) => {
            // console.log('Here')
            connection.disconnect();

            if (err) {
                res.status(500).json({ error: `[SQL execute error]: ${err.message}` });
            } else {
                res.status(200).json({
                    data: rows
                });
            }
        });
    });
};