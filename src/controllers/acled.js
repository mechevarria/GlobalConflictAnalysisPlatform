'use strict';

module.exports = (req, res) => {
    let connection = req.db.connection;
    let config = req.db.config;

    var year = req.query.year;
    // var region = req.query.region;
    var capital = req.query.capital;

    var slider = req.query.slider;

    var covid_data = slider == 'true' ? 8000000 : 0;

    var eventsList = [
        { name: 'Battles', type: req.query.battles },
        { name: 'Explosions%', type: req.query.explosions },
        { name: 'Protests', type: req.query.protests },
        { name: 'Riots', type: req.query.riots },
        { name: 'Strategic%', type: req.query.strategic },
        { name: 'Violence%', type: req.query.violence }
    ].filter((input) => {
        return input.type === 'true'
    });

    var sql = '';

    const bindParams = [capital];

    if (eventsList.length >= 1) {

        let addedSQL = '';

        for (let i = 0; i < eventsList.length; i++) {

            if (i == 0) {
                addedSQL += '?';
            } else {

                addedSQL += ' OR "event_type" LIKE ?';
            }
            bindParams.push(eventsList[i].name);
        }

        

        //SQL Query

        sql += `
        SELECT TOP 2000 COORDINATES.ST_AsGeoJSON() as COORDINATES, "event_date", "actor1", "location", "source", "event_type", "fatalities", "country" FROM "ACLED_FULL"
        WHERE COORDINATES.ST_Within(
            (SELECT ST_ConvexHullAggr(SHAPE) FROM 
                (SELECT SHAPE, "capital", "country" FROM "FSI_FINAL"   
                    WHERE "capital" = ?
                )
            )) = 1	
        AND ("event_type" LIKE ${addedSQL} )
        AND "year" = ?
        AND "data_id" >= ?
        ORDER BY RAND();
        `
    } else {

        sql += `
        SELECT TOP 2000 COORDINATES.ST_AsGeoJSON() as COORDINATES, "event_date", "actor1", "location", "source", "event_type", "fatalities", "country" FROM "ACLED_FULL"
        WHERE COORDINATES.ST_Within(
            (SELECT ST_ConvexHullAggr(SHAPE) FROM 
                (SELECT SHAPE, "capital", "country" FROM "FSI_FINAL"   
                    WHERE "capital" = ?
                )
            )) = 1	
        AND "year" = ?
        AND "data_id" >= ?
        ORDER BY RAND();
        `
    }
    bindParams.push(year);
    bindParams.push(parseInt(covid_data));

    //HANA DB Connection and call
    connection.connect(config, (err) => {
        //catches errors
        if (err) {
            return res.status(500).json({ error: `[Connection error]: ${err.message}` });
        }

        console.log(sql, bindParams)
        connection.exec(sql, bindParams, (err, rows) => {
            // console.log('Here')
            connection.disconnect();

            if (err) {
                res.status(500).json({ error: `[SQL Execute error]: ${err.message}` });
            } else {
                res.status(200).json({
                    data: rows
                });
            }
        });
    });
};