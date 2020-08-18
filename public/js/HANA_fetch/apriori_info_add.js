'use strict';

//FOR GRABBING PARENT ID FOR SECOND LAYER
function getParentId(dataElement) {

    if (dataElement.includes('protest')) {
        return 1.1;
    } else if (dataElement.includes('battle')) {
        return 1.3;
    } else if (dataElement.includes('explosion')) {
        return 1.4;
    } else if (dataElement.includes('riots')) {
        return 1.5;
    } else if (dataElement.includes('strategic')) {
        return 1.6;
    } else if (dataElement.includes('violence')) {
        return 1.2;
    } else {
        console.error('Secondary Sort Error', `dataElement=${dataElement}`);
        return null;
    }
}

function jsonToTable(data) {

    // EXTRACT VALUE FOR HTML HEADER. 
    var col = [];
    for (var i = 0; i < data.length; i++) {
        for (var key in data[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    // CREATE DYNAMIC TABLE.
    var table = document.getElementById('apriori-info');
    // clear old data first
    table.innerHTML = '';

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
    var tr = table.insertRow(-1);                   // TABLE ROW.

    for (i = 0; i < col.length; i++) {
        var th = document.createElement('th');      // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    }

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (i = 0; i < data.length; i++) {

        tr = table.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = data[i][col[j]];
        }
    }
}

function dataToViz(secondLevel) {
    let chartData = [{
        id: '0.0',
        parent: '',
        name: 'Event Associations'
    }, {
        id: '1.1',
        parent: '0.0',
        name: 'Protests'
    }, {
        id: '1.2',
        parent: '0.0',
        name: 'Violence Against Civilians'
    }, {
        id: '1.3',
        parent: '0.0',
        name: 'Battles'
    }, {
        id: '1.4',
        parent: '0.0',
        name: 'Explosions'
    }, {
        id: '1.5',
        parent: '0.0',
        name: 'Riots'
    }, {
        id: '1.6',
        parent: '0.0',
        name: 'Strategic Developments'
    }];

    const thirdLevel = [];

    secondLevel.forEach((obj, index) => {
        const parentId = getParentId(obj.CONSEQUENT);
        obj.parent = parentId;
        obj.id = `2.${index}`;

        if (obj.ANTECEDENT.includes('&')) {
            const splitArray = obj.ANTECEDENT.split('&');
            obj.name = splitArray[0];
            const newObj = {
                parent: obj.id,
                id: `3.${index}`,
                name: splitArray[1],
                value: obj.SCORE
            };
            thirdLevel.push(newObj);

        } else {
            obj.name = obj.ANTECEDENT;
            const newObj = {
                parent: obj.id,
                id: `3.${index}`,
                name: obj.name,
                value: obj.SCORE
            };
            thirdLevel.push(newObj);
        }
    });

    // second pass to merge duplicates
    const seen = new Map();
    const mergedIds = new Map();
    secondLevel.filter(obj => {
        if (seen.has(obj.name)) {
            //console.log(`found duplicate ${obj.name}`);
            mergedIds.set(obj.id, seen.get(obj.name));
            return false;
        } else {
            seen.set(obj.name, obj.id);
            return true;
        }
    });

    // fix parent ids of third level were merged
    thirdLevel.forEach(obj => {
        if (mergedIds.has(obj.parent)) {
            obj.parent = mergedIds.get(obj.parent);
        }
    });

    chartData = chartData.concat(secondLevel).concat(thirdLevel);

    // remove dollar signs from name
    chartData = chartData.map(obj => {

        obj.name = obj.name.replace(/\$/g, '');
        return obj;

    });

    sunChart.series[0].setData(chartData);
}

// eslint-disable-next-line no-unused-vars
function apriori_info_get(country_capital) {

    console.info(country_capital);

    var events_obj = {
        'battles': document.getElementById('battles-check').value,
        'explosions': document.getElementById('explosions-check').value,
        'protests': document.getElementById('protests-check').value,
        'riots': document.getElementById('riots-check').value,
        'strategic': document.getElementById('strategic-check').value,
        'violence': document.getElementById('violence-check').value,
        'year': document.getElementById('select-year').value
    };

    const covidSwitch = document.getElementById('covid-switch').value;

    console.log(country_capital, covidSwitch);

    const url = `/acledApriori?battles=${events_obj.battles}&explosions=${events_obj.explosions}&protests=${events_obj.protests}&riots=${events_obj.riots}&strategic=${events_obj.strategic}&violence=${events_obj.violence}&year=${events_obj.year}&capital=${encodeURIComponent(country_capital)}&slider=${encodeURIComponent(covidSwitch)}`;
    console.log(url);

    btnHandlers.toggleBusy();
    fetch(url)
        .then(res => res.json())
        .then(res => {
            btnHandlers.toggleBusy();
            if (res.error) {
                throw new Error(res.error);
            }

            dataToViz(res.data);
            jsonToTable(res.data);
            btnHandlers.eventBtn.disabled = false;
            lda_info_get(country_capital);

        }).catch(error => {
            console.error('Error fetching data from /acledApriori', error);
        });
}