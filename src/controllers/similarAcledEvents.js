'use strict';

module.exports = (req, res) => {
    const hdb = req.db;

    var point =  decodeURIComponent(req.query.point);
    var timestamp = req.query.timestamp;
    var actor = decodeURIComponent(req.query.actor);
    
    console.log(actor);
    var sql = `
    SELECT TOP 100 COORDINATES.ST_AsGeoJSON() as COORDINATES, "event_date", "actor1", "location", "source", "event_type", "fatalities", "timestamp"
    FROM "ACLED_FULL"
    WHERE COORDINATES.ST_SRID(4326).ST_DISTANCE(NEW ST_POINT( 'POINT(${point})', 4326), 'kilometer') < 15
    AND ABS("timestamp" - ${timestamp}) <= 200200
    AND "actor1" LIKE ?; 
    `;

    console.log(sql);
    const bindParams = [actor];
    
    // bindParams.push(year);
    // bindParams.push(parseInt(covid_data));

    //HANA DB Connection and call
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