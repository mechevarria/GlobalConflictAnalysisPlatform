// control that shows tract info on hover
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};


//Updates the info shown in the top-right
info.update = function (props) {

    this._div.innerHTML = '<h4>FSI Info</h4>' +  (props ?
        '<b> Country : ' + props.COUNTRY + '</b><br />' + '<b>GBRF RESULT : '+ props.SCORE +'</b><br />'+ '<b>CONFIDENCE : '+ props.CONFIDENCE.toFixed(3).toString() +'</b><br />'
        : 'Hover over a country');
};

    //Updates info to focus on information about specific crimes on hover over the point
    info.updatePoint = function (props) {
    
        this._div.innerHTML = '<h4>Crime Info</h4>' //+  
            // (props ?
            // '<b>Category: ' + props.CrimeCat + '</b><br />' + '<b> Crime: '+ props.Crime +'</b><br /><b>Date: '+props.Date+ '</b><br />'
            // : 'Hover over a crime<br />location');
    };





