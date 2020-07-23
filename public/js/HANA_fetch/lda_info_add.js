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

    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    // var divContainer = document.getElementById("showData");
    // divContainer.innerHTML = "";
    // divContainer.appendChild(table);
}


// eslint-disable-next-line no-unused-vars
const lda_info_get = (country_capital) => {

    const year = document.getElementById('select-year').value;
    var slider_on = document.getElementsByClassName('c-switch-input')[0].checked;
    const url = `/acledLDA?&year=${year}&capital=${country_capital}&slider=${slider_on}`;

    btnHandlers.toggleBusy();
    fetch(encodeURI(url))
        .then(res => res.json())
        .then((res) => {
            btnHandlers.toggleBusy();
            if (res.error) {
                throw new Error(res.error);
            }
            btnHandlers.notesBtn.disabled = false;

            ldaJSONToTable(res.data);
        }).catch(error => {
            console.error('Error fetching data from /acledLDA', error);
        });
}