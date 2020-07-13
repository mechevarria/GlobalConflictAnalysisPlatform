'use strict'

function jsonToTable(data) {


    // EXTRACT VALUE FOR HTML HEADER. 
    // ('Book ID', 'Book Name', 'Category' and 'Price')
    var col = [];
    for (var i = 0; i < data.length; i++) {
        for (var key in data[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    console.log(col);

    // CREATE DYNAMIC TABLE.
    var table = document.getElementById('apriori-info');

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = table.insertRow(-1);                   // TABLE ROW.

    for ( i = 0; i < col.length; i++) {
        var th = document.createElement('th');      // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    }

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for ( i = 0; i < data.length; i++) {

        tr = table.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = data[i][col[j]];
        }
    }

    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    // var divContainer = document.getElementById("showData");
    // divContainer.innerHTML = "";
    // divContainer.appendChild(table);
}


const apriori_info_get = (country_capital) => {   

    console.log(country_capital);

    var events_obj = {
        'battles' : document.getElementById('battles-check').value,
        'explosions' : document.getElementById('explosions-check').value,
        'protests' : document.getElementById('protests-check').value,
        'riots' : document.getElementById('riots-check').value,
        'strategic': document.getElementById('strategic-check').value,
        'violence' : document.getElementById('violence-check').value,
        'year' : document.getElementById('select-year').value
    }

    console.log(events_obj);

    var url = '/acledApriori?battles='+encodeURIComponent(events_obj.battles)+'&explosions='+encodeURIComponent(events_obj.explosions)+
    '&protests='+encodeURIComponent(events_obj.protests)+'&riots='+encodeURIComponent(events_obj.riots)+'&strategic='+encodeURIComponent(events_obj.strategic)+
    '&violence='+encodeURIComponent(events_obj.violence)+'&year='+encodeURIComponent(events_obj.year)+'&capital=' +
    encodeURIComponent(country_capital)+' ';



    fetch(url).then((response) => {

        response.json().then((data) => {
            if(data.error){
                return console.log(data.error)
            }
            console.log(data.data);

            lda_info_get(country_capital);

            jsonToTable(data.data);

        });

        

    });
    
        

}