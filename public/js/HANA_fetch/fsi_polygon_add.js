//resets highlighting when mouse comes off the shape
function resetHighlight(e) { // eslint-disable-line no-unused-vars
    fsiLayer.resetStyle(e.target);
    mapInfo.update();
} 

const fsi_polygon_get = () => { // eslint-disable-line no-unused-vars

    //MAPPING FUNCTIONS

    //The color scheme for all points with this specific crime category
const fsiColor = (d) => { 

    return d === 'high' ? '#CA3907' :
    d === 'medium'  ? '#DED406' :
    d === 'low'   ?   '#60CA07':
        '#DAEAF3';
};


function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}


function resetHighlight(e) {
    fsiLayer.resetStyle(e.target);
    mapInfo.update();
}

function zoomToFeature(e) {
    
    var capital = e.target.feature.properties.CAPITAL;

    map.fitBounds(e.target.getBounds());

    fsiLayer.bringToBack();
    acled_point_get(capital);
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

    function style(feature) {
        return {
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5,
            fillColor: fsiColor(feature.properties.SCORE)
        };
    }

    var fsiLayer;
    let region = document.getElementById('select-region').value;
    let year = document.getElementById('select-year').value; 

    if(region == '' || year == '' ){
        return console.log('Empty Set BLocked');
    }

    console.log(year);
    console.log(region);

    btnHandlers.toggleBusy();
    fetch('/fsiMapStart?year='+encodeURIComponent(year)+'&region='+encodeURIComponent(region)+'').then((response) => {        

        response.json().then((data) => {
            btnHandlers.toggleBusy();
            if(data.error){
                return console.error(data.error);
            }

           
            
            var fsiData = [];
            console.log(data.data);
            data.data.forEach((data) => {
                fsiData.push({
                    'type': 'Feature',
                    'properties': {
                        'CONFIDENCE' : data.CONFIDENCE,
                        'SCORE': data.SCORE,
                        'SHAPE': JSON.parse(data.SHAPE),
                        'CAPITAL': data.capital,
                        'COUNTRY': data.country,
                        'popupContent': 'Country: '+data.country+'\nCapital: '+data.capital+'\nSCORE: '+data.score
                    },
                    'geometry':JSON.parse(data.SHAPE), 
                });
            });

            

            fsiLayer = L.geoJSON(fsiData, {
                style: style,
                onEachFeature: onEachFeature
          
            });
            
            fsiLayerGroup.addLayer(fsiLayer);
          


        });
    });

};

 