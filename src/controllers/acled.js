'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    let connection = req.db.connection;
    let config = req.db.config;

    var year = req.query.year;
    var region = req.query.region;

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

    var sql = ''

    if (eventsList.length >= 1) {

        let addedSQL = ''

        for (let i = 0; i < eventsList.length; i++) {

            if (i == 0) {
                addedSQL += '' + eventsList[i].name + '\' ';
            } else {

                addedSQL += ' OR "event_type" LIKE \'' + eventsList[i].name + '\' ';
            }

        }

        //SQL Query
        sql += 'SELECT COORDINATES.ST_AsGeoJSON() as COORDINATES, "event_date", "actor1", "location", "source", "event_type" FROM "AAJULIAN"."ACLED" ' +
            ' WHERE COORDINATES.ST_Within((SELECT ST_ConvexHullAggr(SHAPE) FROM   ' +
            '    (SELECT SHAPE, "capital", SCORE, CONFIDENCE, "country", RANK() OVER (PARTITION BY "country" ORDER BY CONFIDENCE desc) FROM "AAJULIAN"."FSI_FINAL"  ' +
            '      WHERE "region" LIKE \'' + region + '\' AND "year" = ' + year + '))) = 1	  ' +
            ' AND COORDINATES.ST_CoveredBy((SELECT ST_ConvexHullAggr(SHAPE) FROM   ' +
            '    (SELECT SHAPE, "capital", SCORE, CONFIDENCE, "country", RANK() OVER (PARTITION BY "country" ORDER BY CONFIDENCE desc) FROM "AAJULIAN"."FSI_FINAL"  ' +
            '      WHERE "region" LIKE \'' + region + '\' AND "year" = ' + year + '))) = 1	  ' +
            ' AND ("event_type" LIKE \'' + addedSQL + ')' +
            ' AND "year" = ' + year + ' ;  '

    } else {

        //SQL Query
        sql += 'SELECT COORDINATES.ST_AsGeoJSON() as COORDINATES, "event_date", "actor1", "location", "source", "event_type" FROM "AAJULIAN"."ACLED" ' +
            ' WHERE COORDINATES.ST_Within((SELECT ST_ConvexHullAggr(SHAPE) FROM   ' +
            '    (SELECT SHAPE, "capital", SCORE, CONFIDENCE, "country", RANK() OVER (PARTITION BY "country" ORDER BY CONFIDENCE desc) FROM "AAJULIAN"."FSI_FINAL"  ' +
            '      WHERE "region" LIKE \'' + region + '\' AND "year" = ' + year + '))) = 1	  ' +
            ' AND "year" = ' + year + ' ;  ';
    }

    //HANA DB Connection and call
    connection.connect(config, (err) => {
        //catches errors
        if (err) {
            return console.error('Connection error', err);
        }

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
});

module.exports = router;