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
    
    this._div.innerHTML = '<h4>Event Info</h4>' +  
            (props ?
            '<b>Event Type: ' + props.EVENT_TYPE + '</b><br />' + '<b> Location: '+ props.LOCATION + '</b><br /><b>Actor 1: '+props.ACTOR1+ '</b><br />' + 
            '</b><br /><b>Date: '+props.EVENT_DATE+ '</b><br /><b>Source: '+props.SOURCE+ '</b><br />'
            : 'Hover over an event<br />location');
};

info.updateDBSCAN = function (props) {

    this._div.innerHTML = '<h4>DBSCAN Info</h4>' //+  (props ?
        // '<b> Country : ' + props.COUNTRY + '</b><br />' + '<b>GBRF RESULT : '+ props.SCORE +'</b><br />'+ '<b>CONFIDENCE : '+ props.CONFIDENCE.toFixed(3).toString() +'</b><br />'
        // : 'Hover over a country');
};





