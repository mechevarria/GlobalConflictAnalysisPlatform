'use strict';
module.exports = (req, res) => {
    const hdb = req.db;
    var year = req.query.year;
    var region = req.query.region;

    console.log(year, region);

    if (year == 2020) {
        year = 2019;
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

    const bindParams = [region, parseInt(year)];

    try {
        const rows = hdb.exec(sql, bindParams);
        res.status(200).json({
            data: rows
        });
    } catch (err) {
        console.error(err);
        console.error(sql, bindParams);
        res.status(500).json({
            error: `[SQL Execute error]: ${err.message}`
        });
    }
};