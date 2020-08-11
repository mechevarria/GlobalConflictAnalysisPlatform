'use strict'

//FOR GRABBING PARENT ID FOR SECOND LAYER
const secondParentSort = (dataElement) => {

    console.log(dataElement);

    return /protest/.test(dataElement) ? 1.1 :
    /battle/.test(dataElement) ? 1.3 :
    /explosion/.test(dataElement) ? 1.4 :
    /riots/.test(dataElement) ? 1.5 :
    /strategic/.test(dataElement) ? 1.6 :
    /violence/.test(dataElement) ? 1.2 :
        console.log('SECONDARY SORT ERROR') 
}

//FOR CLEANING TEXT OF SECOND AND THIRD LAYERS
const antecedentClean = (dataElement, parentID, secondaryID, tertiaryID) => {

    console.log('INSIDE ANTECEDENTCLEAN');
    console.log(dataElement);

    var dollarTextPattern = /\$([a-z]|[0-9]| \( | \) | \s| -) {0,40}\$/;
    var ampPattern = /\$[^*]{0,35}&/;
 
    if(/&/.test(dataElement.ANTECEDENT)){

        console.log('IF')
        
        var extractedDirty = /\$(.*?) &/.exec(dataElement.ANTECEDENT)
        console.log(extractedDirty[0]);

        var secondLevelDirty = /\$(.*?)\$/.exec(extractedDirty[0])
        console.log(secondLevelDirty);
        var secondLevelClean = secondLevelDirty[0].replace(/\$/ig, '');

        var thirdLevelDirty = /&\$(.*?)\$/.exec(dataElement.ANTECEDENT)
        console.log(thirdLevelDirty);
        var thirdLevelClean = thirdLevelDirty[0].replace(/(\$|&)/ig,'');





        return [{id: ((secondaryID+0.001).toFixed(3)).toString(), parent: parentID.toString(), name: secondLevelClean}, 
            {id: ((tertiaryID+0.001).toFixed(3)).toString(), parent: ((secondaryID+0.001).toFixed(3)).toString(), name: thirdLevelClean, value: dataElement.SCORE}]
    

    }else{

        console.log('ELSE')

        secondLevelDirty = dataElement.ANTECEDENT;//dollarTextPattern.exec(dataElement.ANTECEDENT);

        //console.log(secondLevelDirty);
        secondLevelClean = secondLevelDirty.replace(/\$/ig, '');
        return [{id: ((secondaryID+0.001).toFixed(3)).toString(), parent: parentID.toString(), name: secondLevelClean},
        {id: ((tertiaryID+0.001).toFixed(3)).toString(), parent: ((secondaryID+0.001).toFixed(3)).toString(), name: secondLevelClean, value: dataElement.SCORE}];

    }

}


const addViz = (dataList) => {

    // Splice in transparent for the center circle
Highcharts.getOptions().colors.splice(0, 0, 'transparent');


Highcharts.chart('container', {

    chart: {
        height: '100%'
    },

    title: {
        text: 'Event Group Analysis'
    },
    subtitle: {
        text: 'Apriori Association Algorithm on ACLED events data has produced this visualization'
    },
    series: [{
        type: 'sunburst',
        data: dataList,
        allowDrillToNode: true,
        cursor: 'pointer',
        dataLabels: {
            format: '{point.name}',
            filter: {
                property: 'innerArcLength',
                operator: '>',
                value: 16
            },
            rotationMode: 'circular'
        },
        levels: [{
            level: 1,
            levelIsConstant: false,
            dataLabels: {
                filter: {
                    property: 'outerArcLength',
                    operator: '>',
                    value: 64
                }
            }
        }, {
            level: 2,
            colorByPoint: true
        },
        {
            level: 3,
            colorVariation: {
                key: 'brightness',
                to: -0.5
            }
        }, {
            level: 4,
            colorVariation: {
                key: 'brightness',
                to: 0.5
            }
        }]

    }],
    tooltip: {
        headerFormat: '',
        pointFormat: 'The total Relevance Score of <b>{point.name}</b> is <b>{point.value}</b>'
    }
});


}



const jsonRegextoViz = (data) => {

    // console.log('JSONTOREGEX');
    // console.log(data);

    const vizArray = [{
        id: '0.0',
        parent: '',
        name: 'Event\nAssociations'
    }, {
        id : '1.1',
        parent: '0.0',
        name: 'Protests'
    }, {
        id : '1.2',
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
    },{
        id: '1.6',
        parent:'0.0',
        name: 'Strategic Developments'
    }]; //array to add final data for SunBurst Viz init with center piece and secondary piece

    const uniqueEvents = [...new Set(data.map(item => item.CONSEQUENT))]; //getting unique event types
    console.log(uniqueEvents);

    var secondaryID = 2.000;
    var tertiaryID = 3.000;

    for(var i= 0; i < uniqueEvents.length; i++){



        var parentID = secondParentSort(uniqueEvents[i]);

        // console.log(parentID);
        //console.log(data.CONSEQUENT);

        var filteredEvent = data.filter((data) => {
            
            let lft = data.CONSEQUENT.trim();
            let rgt = uniqueEvents[i].trim();
            return lft == rgt;
        })

        console.log(filteredEvent);

        filteredEvent.forEach(element => {
            
            var cleanResults = antecedentClean(element, parentID, secondaryID, tertiaryID);
            console.log(cleanResults);
            
            secondaryID = Number(parseFloat(cleanResults[0].id).toFixed(3));
            tertiaryID =  Number(parseFloat(cleanResults[1].id).toFixed(3));

            console.log(secondaryID);
            console.log(tertiaryID);

            //(cleanResults.length > 1) ? tertiaryID = parseInt(cleanResults[1].id) : console.log('No tertiary level detected');

            cleanResults.forEach((obj) => {
                vizArray.push(obj);
            })

            console.log(vizArray);

        });

    }

    addViz(vizArray);

}

// function jsonToTable(data) {

//     console.log('HERE');
//     console.log(data)
//     // EXTRACT VALUE FOR HTML HEADER. 
//     // ('Book ID', 'Book Name', 'Category' and 'Price')
//     var col = [];
//     for (var i = 0; i < data.length; i++) {
//         for (var key in data[i]) {
//             if (col.indexOf(key) === -1) {
//                 col.push(key);
//             }
//         }
//     }

//     console.log(col);

//     // CREATE DYNAMIC TABLE.
//     var table = document.getElementById('apriori-info');
//     // clear old data first
//     table.innerHTML = '';

//     // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

//     var tr = table.insertRow(-1);                   // TABLE ROW.

//     for (i = 0; i < col.length; i++) {
//         var th = document.createElement('th');      // TABLE HEADER.
//         th.innerHTML = col[i];
//         tr.appendChild(th);
//     }

//     // ADD JSON DATA TO THE TABLE AS ROWS.
//     for (i = 0; i < data.length; i++) {

//         tr = table.insertRow(-1);

//         for (var j = 0; j < col.length; j++) {
//             var tabCell = tr.insertCell(-1);
//             tabCell.innerHTML = data[i][col[j]];
//         }
//     }

//     // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
//     // var divContainer = document.getElementById("showData");
//     // divContainer.innerHTML = "";
//     // divContainer.appendChild(table);
// }


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
    }

    var slider_on = document.getElementsByClassName('c-switch-input')[0].checked;



    console.log(country_capital, slider_on);

    const url = `/acledApriori?battles=${events_obj.battles}&explosions=${events_obj.explosions}&protests=${events_obj.protests}&riots=${events_obj.riots}&strategic=${events_obj.strategic}&violence=${events_obj.violence}&year=${events_obj.year}&capital=${encodeURIComponent(country_capital)}&slider=${encodeURIComponent(slider_on)}
    `;

    console.log(url);

    btnHandlers.toggleBusy();
    fetch(url)
        .then(res => res.json())
        .then(res => {
            btnHandlers.toggleBusy();
            if(res.error) {
                throw new Error(res.error);
            }
            console.log(res);
            //jsonToTable(res.data);

            jsonRegextoViz(res.data);
            btnHandlers.eventBtn.disabled = false;
            lda_info_get(country_capital);

        }).catch(error => {
            console.error('Error fetching data from /acledApriori', error);
        });
}