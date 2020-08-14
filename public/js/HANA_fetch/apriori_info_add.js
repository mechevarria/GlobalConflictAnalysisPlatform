'use strict';

function getFirstLevelParent(dataElement) {

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

function dataToViz(data) {
    const firstLevel = [{
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
    const secondLevel = data;
    const thirdLevel = [];
    secondLevel.forEach((obj, index) => {
        obj.parent = getFirstLevelParent(obj.CONSEQUENT);
        obj.id = `2.${index}`;

        if (obj.ANTECEDENT.includes('&')) {
            console.log('adding third level object');
            const split = obj.ANTECEDENT.split('&');
            obj.name = split[0].replaceAll('$', '');
            const thirdObj = {
                parent: obj.id,
                id: `3.${index}`,
                name: split[1].replaceAll('$', ''),
                value: obj.SCORE
            };
            thirdLevel.push(thirdObj);
        } else {
            obj.name = obj.ANTECEDENT.replaceAll('$', '');
            obj.value = obj.SCORE;
        }
    });
    let seen = new Map();
    let valueReplace = new Map();
    // merge third level duplicates
    thirdLevel.filter((obj) => {
        if (seen.has(obj.name)) {
            console.log(`Found duplicate with value ${obj.name}`);
            valueReplace.set(seen.get(obj.name).id, obj.value);
            return false;
        } else {
            seen.set(obj.name, obj);
            return true;
        }
    });

    thirdLevel.forEach((obj) => {
        if (valueReplace.has(obj.id)) {
            console.log(`Merging in value to id=${obj.id}`);
            obj.value += valueReplace.get(obj.id).value;
        }
    });

    const chartData = firstLevel.concat(secondLevel).concat(thirdLevel);

    seen = new Map();
    valueReplace = new Map();
    chartData.filter((obj) => {
        if (seen.has(obj.name)) {
            // console.log(`Found duplicate with value ${obj.name}`);
            valueReplace.set(obj.id, seen.get(obj.name).id);
            return false;
        } else {
            seen.set(obj.name, obj);
            return true;
        }
    });
    chartData.forEach((obj) => {
        if (valueReplace.has(obj.parent)) {
            // console.log(`Replacing ${obj.parent}`);
            obj.parent = valueReplace.get(obj.parent);
        }
    });
    console.log(`chartData.length=${chartData.length}`);
    sunChart.series[0].setData(chartData);
}


// eslint-disable-next-line no-unused-vars
const apriori_info_get = (country_capital) => {

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
            btnHandlers.eventBtn.disabled = false;
            lda_info_get(country_capital);

        }).catch(error => {
            console.error('Error fetching data from /acledApriori', error);
        });
};