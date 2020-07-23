'use strict';

module.exports = (req, res) => {
  let connection = req.db.connection;
  let config = req.db.config;

  const year = req.query.year;
  const region = req.query.region;

  let fsi_year = year;

  // if (fsi_year == 2020) {
  //   fsi_year = 2019;
  // }

  var slider = req.query.slider;

  var covid_data = slider == 'true' ? 8000000 : 0;

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

  const bindParams = [region, parseInt(fsi_year)-1, region, parseInt(fsi_year)-1];
  let sql = '';

  if (eventsList.length >= 1) {

    let addedSQL = '';

    eventsList.forEach((event, index) => {
      if (index === 0) {
        addedSQL += '?';
      } else {
        addedSQL += ' OR "event_type" LIKE ?';
      }
      bindParams.push(event.name);
    });

    sql = `
  
        SELECT "cluster_id", st_unionAggr("COORDINATES").ST_AlphaShape(0.655).ST_AsGeoJSON() as "cluster" FROM (
          (SELECT ST_ClusterID() OVER (CLUSTER BY "COORDINATES" USING DBSCAN EPS 0.481 MINPTS 6) AS "cluster_id" , COORDINATES FROM "AAJULIAN"."ACLED_FULL"
            WHERE COORDINATES.ST_Within((SELECT ST_ConvexHullAggr(SHAPE) FROM 
                (SELECT SHAPE, "capital", SCORE, CONFIDENCE, "country", RANK() OVER (PARTITION BY "country" ORDER BY CONFIDENCE desc) FROM "AAJULIAN"."FSI_FINAL"   
                  WHERE "region" LIKE ? AND "year" = ?))) = 1	AND
                COORDINATES.ST_CoveredBy((SELECT ST_ConvexHullAggr(SHAPE) FROM 
                (SELECT SHAPE, "capital", SCORE, CONFIDENCE, "country", RANK() OVER (PARTITION BY "country" ORDER BY CONFIDENCE desc) FROM "AAJULIAN"."FSI_FINAL"   
                  WHERE "region" LIKE ? AND "year" = ?))) = 1
            AND ("event_type" LIKE ${addedSQL})
            AND "year" =?
            AND "data_id" >= ?
            )
            )
            where "cluster_id" <> 0
            group by "cluster_id"
        
        `

  } else {

    sql = `
        SELECT "cluster_id", st_unionAggr("COORDINATES").ST_AlphaShape(0.655).ST_AsGeoJSON() as "cluster" FROM (
          (SELECT ST_ClusterID() OVER (CLUSTER BY "COORDINATES" USING DBSCAN EPS 0.481 MINPTS 6) AS "cluster_id" , COORDINATES FROM "AAJULIAN"."ACLED"
            WHERE COORDINATES.ST_Within((SELECT ST_ConvexHullAggr(SHAPE) FROM 
                (SELECT SHAPE, "capital", SCORE, CONFIDENCE, "country", RANK() OVER (PARTITION BY "country" ORDER BY CONFIDENCE desc) FROM "AAJULIAN"."FSI_FINAL"   
                  WHERE "region" LIKE ? AND "year" = ?))) = 1	AND
                COORDINATES.ST_CoveredBy((SELECT ST_ConvexHullAggr(SHAPE) FROM 
                (SELECT SHAPE, "capital", SCORE, CONFIDENCE, "country", RANK() OVER (PARTITION BY "country" ORDER BY CONFIDENCE desc) FROM "AAJULIAN"."FSI_FINAL"   
                  WHERE "region" LIKE ? AND "year" = ?))) = 1
            AND "year" = ?
            AND "data_id" >= ?
            )		
            )
            where "cluster_id" <> 0
            group by "cluster_id"
        
        `
  }

  console.log(sql);
  bindParams.push(parseInt(year));
  bindParams.push(parseInt(covid_data))
  //HANA DB Connection and call
  connection.connect(config, (err) => {
    //catches errors
    if (err) {
      res.status(500).json({ error: `[Connection error]: ${err.message}` });
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