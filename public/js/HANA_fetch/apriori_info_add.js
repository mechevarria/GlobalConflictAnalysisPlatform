'use strict';

//FOR GRABBING PARENT ID FOR SECOND LAYER
const secondParentSort = (dataElement) => {

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
};

//FOR CLEANING TEXT OF SECOND AND THIRD LAYERS
const antecedentClean = (dataElement, parentID, secondaryID, tertiaryID) => {

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

};



const jsonRegextoViz = (data) => {

    // console.log('JSONTOREGEX');
    // console.log(data);

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
    }]; //array to add final data for SunBurst Viz init with center piece and secondary piece

    const uniqueEvents = [...new Set(data.map(item => item.CONSEQUENT))]; //getting unique event types
    console.log(uniqueEvents);

    var secondaryID = 2.000;
    var tertiaryID = 3.000;

    for (var i = 0; i < uniqueEvents.length; i++) {



        var parentID = secondParentSort(uniqueEvents[i]);

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

};

// UNUSED...trying out different ways to sort the sunburst data
// eslint-disable-next-line no-unused-vars
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
        obj.parent = secondParentSort(obj.CONSEQUENT);
        obj.id = `2.${index}`;

        if (obj.ANTECEDENT.includes('&')) {
            console.log('adding third level object');
            obj.name = obj.ANTECEDENT.substr(0, obj.ANTECEDENT.indexOf('&')).replaceAll('$', '');
            const thirdObj = {
                parent: obj.id,
                id: `3.${index}`,
                name: obj.ANTECEDENT.substr(obj.ANTECEDENT.indexOf('&') + 1, obj.ANTECEDENT.length).replaceAll('$', ''),
                value: obj.SCORE
            };
            thirdLevel.push(thirdObj);
        } else {
            obj.name = obj.ANTECEDENT.replaceAll('$', '');
            obj.value = obj.SCORE;
        }
    });

    const chartData = firstLevel.concat(secondLevel).concat(thirdLevel);

    const seen = new Map();
    const parentReplace = new Map();
    chartData.filter((obj) => {
        if (seen.has(obj.name)) {
            // console.log(`Found duplicate with value ${obj.name}`);
            parentReplace.set(obj.id, seen.get(obj.name).id);
            return false;
        } else {
            seen.set(obj.name, obj);
            return true;
        }
    });
    chartData.forEach((obj) => {
        if (parentReplace.has(obj.parent)) {
            // console.log(`Replacing ${obj.parent}`);
            obj.parent = parentReplace.get(obj.parent);
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

    var slider_on = document.getElementsByClassName('c-switch-input')[0].checked;



    console.log(country_capital, slider_on);

    const url = `/acledApriori?battles=${events_obj.battles}&explosions=${events_obj.explosions}&protests=${events_obj.protests}&riots=${events_obj.riots}&strategic=${events_obj.strategic}&violence=${events_obj.violence}&year=${events_obj.year}&capital=${encodeURIComponent(country_capital)}&slider=${encodeURIComponent(slider_on)}
    `;

    btnHandlers.toggleBusy();
    fetch(url)
        .then(res => res.json())
        .then(res => {
            btnHandlers.toggleBusy();
            if (res.error) {
                throw new Error(res.error);
            }

            //dataToViz(res.data);
            jsonRegextoViz(res.data);
            btnHandlers.eventBtn.disabled = false;
            lda_info_get(country_capital);

        }).catch(error => {
            console.error('Error fetching data from /acledApriori', error);
        });
};