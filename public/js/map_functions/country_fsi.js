//The color scheme for all points with this specific crime category
const fsiColor = (d) => { 

    return d === 'high' ? '#00b8e6' :
    d === 'medium'  ? '#2eb82e' :
               '#b32400';
};


function onEachFeature(feature, layer) { // eslint-disable-line no-unused-vars
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}


function resetHighlight(e) {
    fsiLayer.resetStyle(e.target);
    mapInfo.updatePoint();
}

function zoomToFeature(e) {
    
    //var censusTract = e.target.feature.properties.CensusTract; 

    map.fitBounds(e.target.getBounds());

    fsiLayer.bringToBack();

    // runLine(513700);
   
    // crimePointAdd(censusTract, crimeJSON);
}


     //highlights the object when hovering over it
     function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 3,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        //error checking depending on the browser
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        mapInfo.update(layer.feature.properties);
    }

    function style(feature) { // eslint-disable-line no-unused-vars
        return {
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5,
            fillColor: fsiColor(feature.properties.SCORE)
        };
    }







