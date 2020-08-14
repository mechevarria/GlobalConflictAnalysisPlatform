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

//FOR CLEANING TEXT OF SECOND AND THIRD LAYERS
function antecedentClean(dataElement, parentID, secondaryID, tertiaryID) {

    console.log('INSIDE ANTECEDENTCLEAN');
    console.log(dataElement);

    var dollarTextPattern = /\$([a-z]|[0-9]| \( | \) | \s| -) {0,40}\$/;
    var ampPattern = /\$[^*]{0,35}&/;

    if (/&/.test(dataElement.ANTECEDENT)) {

        console.log('IF');

        var extractedDirty = /\$(.*?) &/.exec(dataElement.ANTECEDENT);
        console.log(extractedDirty[0]);

        var secondLevelDirty = /\$(.*?)\$/.exec(extractedDirty[0]);
        console.log(secondLevelDirty);
        var secondLevelClean = secondLevelDirty[0].replace(/\$/ig, '');

        var thirdLevelDirty = /&\$(.*?)\$/.exec(dataElement.ANTECEDENT);
        console.log(thirdLevelDirty);
        var thirdLevelClean = thirdLevelDirty[0].replace(/(\$|&)/ig, '');





        return [{ id: ((secondaryID + 0.001).toFixed(3)).toString(), parent: parentID.toString(), name: secondLevelClean },
        { id: ((tertiaryID + 0.001).toFixed(3)).toString(), parent: ((secondaryID + 0.001).toFixed(3)).toString(), name: thirdLevelClean, value: dataElement.SCORE }];


    } else {

        console.log('ELSE');

        secondLevelDirty = dataElement.ANTECEDENT;//dollarTextPattern.exec(dataElement.ANTECEDENT);

        //console.log(secondLevelDirty);
        secondLevelClean = secondLevelDirty.replace(/\$/ig, '');
        return [{ id: ((secondaryID + 0.001).toFixed(3)).toString(), parent: parentID.toString(), name: secondLevelClean },
        { id: ((tertiaryID + 0.001).toFixed(3)).toString(), parent: ((secondaryID + 0.001).toFixed(3)).toString(), name: secondLevelClean, value: dataElement.SCORE }];

    }
}

const vizArray = [{
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

function jsonRegextoViz(data) {

    // console.log('JSONTOREGEX');
    // console.log(data);

    const uniqueEvents = [...new Set(data.map(item => item.CONSEQUENT))]; //getting unique event types
    console.log(uniqueEvents);

    var secondaryID = 2.000;
    var tertiaryID = 3.000;

    for (var i = 0; i < uniqueEvents.length; i++) {

        var parentID = getParentId(uniqueEvents[i]);

        // console.log(parentID);
        //console.log(data.CONSEQUENT);

        var filteredEvent = data.filter((data) => {

            let lft = data.CONSEQUENT.trim();
            let rgt = uniqueEvents[i].trim();
            return lft == rgt;
        });

        console.log(filteredEvent);

        filteredEvent.forEach(element => {

            var cleanResults = antecedentClean(element, parentID, secondaryID, tertiaryID);
            console.log(cleanResults);

            secondaryID = Number(parseFloat(cleanResults[0].id).toFixed(3));
            tertiaryID = Number(parseFloat(cleanResults[1].id).toFixed(3));

            console.log(secondaryID);
            console.log(tertiaryID);

            //(cleanResults.length > 1) ? tertiaryID = parseInt(cleanResults[1].id) : console.log('No tertiary level detected');

            cleanResults.forEach((obj) => {
                vizArray.push(obj);
            });

            // console.log(vizArray);

        });

    }

    sunChart.series[0].setData(vizArray);
}

function dataToViz(secondLevel) {
    let chartData = vizArray;

    const thirdLevel = [];

    secondLevel.forEach((obj,index) => {
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
        if(mergedIds.has(obj.parent)) {
            obj.parent = mergedIds.get(obj.parent);
        }
    });

    chartData = chartData.concat(secondLevel).concat(thirdLevel);

    // remove dollar signs from name
    chartData = chartData.map(obj => {
        obj.name = obj.name.replaceAll('$','');
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

            //jsonRegextoViz(res.data);
            dataToViz(res.data);
            btnHandlers.eventBtn.disabled = false;
            lda_info_get(country_capital);

        }).catch(error => {
            console.error('Error fetching data from /acledApriori', error);
        });
}