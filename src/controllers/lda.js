'use strict';
module.exports = (req, res) => {
    const hdb = req.db;

    const year = req.query.year;
    const capital = decodeURIComponent(req.query.capital);
    const slider = req.query.slider;

    var covid_data = slider == 'true' ? 8000000 : 0;

    //SQL Query
    let sql = 'SELECT TOP 10 * FROM ACLED_LDA_VIEW (PLACEHOLDER."$$yr$$"=>?, PLACEHOLDER."$$capital$$" =>  ?, PLACEHOLDER."$$covid$$"=> ?)';
    const bindParams = [parseInt(year), capital, parseInt(covid_data)];

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