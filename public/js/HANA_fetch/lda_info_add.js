'use strict'

function ldaJSONToTable(data) {


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
    var table = document.getElementById('lda-info');

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


// eslint-disable-next-line no-unused-vars
const lda_info_get = (country_capital) => {   

 

    var year = document.getElementById('select-year').value;

    var url = '/acledLDA?'+'&year='+encodeURIComponent(year)+'&capital=' +
    encodeURIComponent(country_capital)+' ';


    btnHandlers.toggleBusy();
    fetch(url).then((response) => {
        btnHandlers.toggleBusy();

        response.json().then((data) => {
            if(data.error){
                return console.log(data.error)
            }

            console.log(data.data)
           

            ldaJSONToTable(data.data);

        });

    });
    
        

}