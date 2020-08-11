'use strict';
module.exports = (req, res) => {
    const connection = req.db.connection;
    const config = req.db.config;


    //HANA DB Connection and call
    connection.connect(config, (err) => {
        //catches errors
        if (err) {
            return res.status(500).json({ error: `[Connection error]: ${err.message}` });
        }

        const year = req.query.year;
        const capital = decodeURIComponent(req.query.capital);
        const slider = decodeURIComponent(req.query.slider);

        const covid_data = slider == 'true' ? 8000000 : 0;

        console.log(capital, slider);

        const eventsList = [
            { name: 'battles', type: req.query.battles },
            { name: 'explosions%', type: req.query.explosions },
            { name: 'protests', type: req.query.protests },
            { name: 'riots', type: req.query.riots },
            { name: 'strategic%', type: req.query.strategic },
            { name: 'violence%', type: req.query.violence }
        ].filter((input) => {
            return input.type === 'true'
        });

        console.log(eventsList);

        let sql = '';

        const bindParams = [parseInt(year), capital, parseInt(covid_data)];
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
                `SELECT TOP 100 ANTECEDENT, CONSEQUENT, (SUPPORT + LIFT)*0.25+CONFIDENCE*0.5 as SCORE FROM ACLED_APRIORI_VIEW (PLACEHOLDER."$$yr$$"=>?, PLACEHOLDER."$$capital$$" =>  ?, PLACEHOLDER."$$covid$$"=>?)
                WHERE CONSEQUENT LIKE ${addedSQL}
                ORDER BY SCORE DESC;
                `

        } else {

            //SQL Query
            sql +=
                `SELECT TOP 30 * FROM ACLED_APRIORI_VIEW (PLACEHOLDER."$$yr$$"=>?, PLACEHOLDER."$$capital$$" => ?, PLACEHOLDER."$$covid$$"=>?)
            ORDER BY LIFT, CONFIDENCE DESC;
            `
        }
        console.log(sql, bindParams)
        connection.exec(sql, bindParams, (err, rows) => {
            // console.log('Here')
            connection.disconnect();

            if (err) {
                res.status(500).json({ error: `[SQL execute error]: ${err.message}` });
            } else {
                res.status(200).send({ data: rows });
            }
        });
    });
};