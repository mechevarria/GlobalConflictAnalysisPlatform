'use strict';

// control that shows tract mapInfo on hover
var mapInfo = L.control();

mapInfo.onAdd = function () {
    this._div = L.DomUtil.create('div', 'map-info');
    this.update();
    return this._div;
};


//Updates the mapInfo shown in the top-right
mapInfo.update = function (props) {

    this._div.innerHTML = '<h4>FSI map</h4>' + (props ?
        '<b> Country : ' + props.COUNTRY + '</b><br />' + '<b>GBRF RESULT : ' + props.SCORE + '</b><br />' + '<b>CONFIDENCE : ' + props.CONFIDENCE.toFixed(3).toString() + '</b><br />'
        : 'Hover over a country');
};

//Updates mapInfo to focus on mapInformation about specific crimes on hover over the point
mapInfo.updatePoint = function (props) {

    this._div.innerHTML = '<h4>Event map</h4>' +
        (props ?
            '<b>Event Type: ' + props.EVENT_TYPE + '</b><br />' + '<b> Location: ' + props.LOCATION + '</b><br /><b>Actor 1: ' + props.ACTOR1 + '</b><br />' +
            '</b><br /><b>Date: ' + props.EVENT_DATE + '</b><br /><b>Source: ' + props.SOURCE + '</b><br />'
            : 'Hover over an event<br />location');
};

mapInfo.updateDBSCAN = function () {

    this._div.innerHTML = '<h4>DBSCAN map</h4>'; //+  (props ?
    // '<b> Country : ' + props.COUNTRY + '</b><br />' + '<b>GBRF RESULT : '+ props.SCORE +'</b><br />'+ '<b>CONFIDENCE : '+ props.CONFIDENCE.toFixed(3).toString() +'</b><br />'
    // : 'Hover over a country');
};





