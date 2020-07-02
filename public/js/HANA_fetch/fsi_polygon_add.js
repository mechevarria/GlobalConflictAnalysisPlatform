//resets highlighting when mouse comes off the shape
function resetHighlight(e) {
    fsiLayer.resetStyle(e.target);
    info.update();
} 
    
radioValueFinder = (element_id) => {
    document.getElementById(element_id).value === 'true' ?
        document.getElementById(element_id).value = "false" :
        document.getElementById(element_id).value = "true"
    
}


fsi_polygon_get = () => {

    

    //MAPPING FUNCTIONS

    //The color scheme for all points with this specific crime category
fsiColor = (d) => { 

    return d === "high" ? '#CA3907' :
    d === "medium"  ? '#DED406' :
    d === "low"   ?   '#60CA07':
        '#DAEAF3';
}


function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}


function resetHighlight(e) {
    fsiLayer.resetStyle(e.target);
    info.update();
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

        info.update(layer.feature.properties);
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
    let region = document.getElementById("select-region").value;
    let year = document.getElementById("select-year").value; 

    if(region == "" || year == "" ){
        return console.log("Empty Set BLocked")
    }

    console.log(year);
    console.log(region);

    // acled_point_get();

    fetch('/fsiMapStart?year='+encodeURIComponent(year)+'&region='+encodeURIComponent(region)+'').then((response) => {

        // console.log(response)
        acled_point_get();

        response.json().then((data) => {
            if(data.error){
                return console.log(data.error)
            }

            console.log(data.data)
            
            var fsiData = [];

            data.data.forEach((data) => {
                fsiData.push({
                    "type": 'Feature',
                    'properties': {
                        'CONFIDENCE' : data.CONFIDENCE,
                        'SCORE': data.SCORE,
                        // 'SHAPE': JSON.parse(data.SHAPE),
                        'CAPITAL': data.capital,
                        'COUNTRY': data.country,
                        'popupContent': 'Country: '+data.country+'\nCapital: '+data.capital+'\nSCORE: '+data.score
                    },
                    'geometry':JSON.parse(data.SHAPE), 
                })
            });

            

            fsiLayer = L.geoJSON(fsiData, {
                style: style,
                onEachFeature: onEachFeature
            })
            
            fsiLayerGroup.addLayer(fsiLayer);
          


        })
    })   

}

 