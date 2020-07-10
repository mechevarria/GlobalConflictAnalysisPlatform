// 'use strict';

// const express = require('express');
// const router = express.Router();

// router.get('/', (req, res) => {
//     let connection = req.db.connection;
//     let config = req.db.config;

//     var year = req.query.year
//     var capital = req.query.capital

//     var eventsList = [
//         { name: 'Battles', type: req.query.battles },
//         { name: 'Explosions%', type: req.query.explosions },
//         { name: 'Protests', type: req.query.protests },
//         { name: 'Riots', type: req.query.riots },
//         { name: 'Strategic%', type: req.query.strategic },
//         { name: 'Violence%', type: req.query.violence }
//     ].filter((input) => {
//         return input.type === 'true'
//     });

//     var sql = ''

//     if (eventsList.length >= 1) {

//         let addedSQL = ''

//         for (let i = 0; i < eventsList.length; i++) {

//             if (i == 0) {
//                 addedSQL += ` '%${eventsList[i].name}%'  `;
//             } else {

//                 addedSQL += ` OR CONSEQUENT LIKE '%${eventsList[i].name}%' `;
//             }

//         }

//         //SQL Query
//         sql += 
//             `SELECT TOP 30 * FROM ACLED_APRIORI_VIEW (PLACEHOLDER."$$yr$$"=>${year}, PLACEHOLDER."$$capital$$" => '${capital}')
//             WHERE CONSEQUENT LIKE ${addedSQL}
//             ORDER BY LIFT, CONFIDENCE DESC;
//             `

//     } else {

//         //SQL Query
//         sql += 
//         `SELECT TOP 30 * FROM ACLED_APRIORI_VIEW (PLACEHOLDER."$$yr$$"=>${year}, PLACEHOLDER."$$capital$$" => ${capital})
//         ORDER BY LIFT, CONFIDENCE DESC;
//         `
//     }

//     //HANA DB Connection and call
//     connection.connect(config, (err) => {
//         //catches errors
//         if (err) {
//             return console.error('Connection error', err);
//         }

//         console.log(sql)
//         connection.exec(sql, (err, rows) => {
//             // console.log('Here')
//             connection.disconnect();

//             if (err) {
//                 return console.error('SQL execute error:', err);
//             }

//             //Sends the data to the client

//             //  console.log("Results:", rows);
//             //  console.log(`Query '${sql}' returned ${rows.length} items`);

//             res.send({
//                 data: rows
//             })
//         });
//     });
// });

// module.exports = router;



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

        console.log(eventsList);
    
        var sql = ''
    
        if (eventsList.length >= 1) {
    
            let addedSQL = ''
    
            for (let i = 0; i < eventsList.length; i++) {
    
                if (i == 0) {
                    addedSQL += ` '%${eventsList[i].name}%'  `;
                } else {
    
                    addedSQL += ` OR CONSEQUENT LIKE '%${eventsList[i].name}%' `;
                }
    
            }
    
            //SQL Query
            sql += 
                `SELECT TOP 30 ANTECEDENT, CONSEQUENT, CONFIDENCE FROM ACLED_APRIORI_VIEW (PLACEHOLDER."$$yr$$"=>${year}, PLACEHOLDER."$$capital$$" =>  '${capital}' )
                WHERE CONSEQUENT LIKE ${addedSQL}
                ORDER BY LIFT, CONFIDENCE DESC;
                `
    
        } else {
    
            //SQL Query
            sql += 
            `SELECT TOP 30 * FROM ACLED_APRIORI_VIEW (PLACEHOLDER."$$yr$$"=>${year}, PLACEHOLDER."$$capital$$" => '${capital}')
            ORDER BY LIFT, CONFIDENCE DESC;
            `
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
};