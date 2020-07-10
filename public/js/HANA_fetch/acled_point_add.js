'use strict';

const acled_point_get = (capital) => { // eslint-disable-line no-unused-vars


    //The color scheme for all points with this specific crime category
    const acledColor = (d) => { 

        return d == 'Battles' ? '#00b8e6' :
        d == 'Explosions'  ? '#2eb82e' :
        d == 'Protests'  ? '#ff9900' :
        d == 'Riots'  ? '#ff3300' :
        d == 'Strategic Developments'   ? '#ff3399' :
        d == 'Violence Against Civilians'   ? '#9900cc' :
                   '#b32400';
    }    
           
        //Filter criteria
        var acledLayer;
  
        //resets highlighting when mouse comes off the shape
        function resetHighlight(e) {
            acledLayer.resetStyle(e.target);
            mapInfo.updatePoint();
        }

        function zoomToFeature(e) { // eslint-disable-line no-unused-vars
        
            map.fitBounds(e.target.getBounds());
        
            // acledLayer.bringToBack();
        
        }
    
            //What functions are run on each feature for interaction
            function onEachFeature(feature, layer) {
                // does this feature have a property named popupContent?
                if (feature.properties && feature.properties.popupContent) {
                    layer.bindPopup(feature.properties.popupContent);
                }
    
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight
                })

                // coords.push(feature.geometry.coordinates);
            }
        
        
             //highlights the object when hovering over it
             function highlightFeature(e) {
                var layer = e.target;
        
                layer.setStyle({
                    radius: 8,
                    fillColor: acledColor(layer.feature.properties.EVENT_TYPE),
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
        
                //error checking depending on the browser
                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    layer.bringToFront();
                }
        
                mapInfo.updatePoint(layer.feature.properties);
            }
        
        
            //Styles the polygons and colors based on population
            function style(feature) {
                return {
                    // weight: 2,
                    // opacity: 1,
                    // color: 'white',
                    // dashArray: '3',
                    // fillOpacity: 0.5,
                    // fillColor: perc2color(parseFloat(feature.properties.CPP), 1)
                    radius: 6,
                    fillColor: acledColor(feature.properties.EVENT_TYPE),
                    color: 'white',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.5
                };
            }

            var events_obj = {
                'battles' : document.getElementById('battles-check').value,
                'explosions' : document.getElementById('explosions-check').value,
                'protests' : document.getElementById('protests-check').value,
                'riots' : document.getElementById('riots-check').value,
                'strategic': document.getElementById('strategic-check').value,
                'violence' : document.getElementById('violence-check').value,
                'region' : document.getElementById('select-region').value,
                'year' : document.getElementById('select-year').value
            }

            var url = '/acledEvents?battles='+encodeURIComponent(events_obj.battles)+'&explosions='+encodeURIComponent(events_obj.explosions)+
            '&protests='+encodeURIComponent(events_obj.protests)+'&riots='+encodeURIComponent(events_obj.riots)+'&strategic='+encodeURIComponent(events_obj.strategic)+
            '&violence='+encodeURIComponent(events_obj.violence)+'&region='+encodeURIComponent(events_obj.region)+'&year='+encodeURIComponent(events_obj.year)+'&capital='+
            encodeURIComponent(capital)+' ';
            

            
    
    fetch(url).then((response) => {

        response.json().then((data) => {
            if(data.error){
                return console.log(data.error)
            }

           

            var acledData = [];
            var geos = [];
            


            data.data.forEach((data) => {
                acledData.push({
                    'type': 'Feature',
                    'properties': {
                        'ACTOR1' : data.actor1,
                        'EVENT_DATE': data.event_date,
                        'EVENT_TYPE': data.event_type,
                        'LOCATION': data.location,
                        'SOURCE': data.source,
                        'popupContent': 'LOCATION: ' + data.location + '\nEVENT: ' + data.event_type + '\nSOURCE: ' + data.source + '\nDATE: ' + data.event_date + ''
                    },
                    'geometry':JSON.parse(data.COORDINATES), 
                })

                geos.push(JSON.parse(data.COORDINATES))
            });


            var coords = geos.map(a => a.coordinates.reverse());

            

            acledLayer = L.geoJSON(acledData, {
                style: style,
                pointToLayer: function (feature, latlng) {

                    var geojsonMarkerOptions = {
                        radius: 6,
                        fillColor: acledColor(feature.properties.EVENT_TYPE),
                        color: 'white',
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.5
                    };

                    return L.circleMarker(latlng, geojsonMarkerOptions);
                },
                onEachFeature: onEachFeature
            
            })
            
            acledLayerGroup.addLayer(acledLayer);

            
            let options = {
                'minOpacity': 0.24,
                'maxZoom' : 9,
                'radius': 10,
                'gradient' : {0.4: 'blue', 0.60: 'lime', 1: 'red'}
            }
            var heat = L.heatLayer(coords, options);

            acledHeatLayer.addLayer(heat);

            dbscan_polygon_get(events_obj);
        
        
        
        });

    });        

}