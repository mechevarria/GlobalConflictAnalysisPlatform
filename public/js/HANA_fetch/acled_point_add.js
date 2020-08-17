'use strict';

const acled_point_get = (capital) => { // eslint-disable-line no-unused-vars
    // console.log(capital);

    // colors from theme https://coreui.io/demo/3.1.0/#colors.html
    const acledColor = (d) => {
        let color;
        switch (d) {
            case 'Battles':
                color = '#e55353'; // danger
                break;
            case 'Explosions/Remote violence':
                color = '#f9b115'; // warning
                break;
            case 'Protests':
                color = '#ced2d8'; // brand secondary
                break;
            case 'Riots':
                color = '#321fdb'; // primary
                break;
            case 'Strategic developments':
                color = '#2eb85c'; // success
                break;
            case 'Violence against civilians':
                color = '#3399ff'; // info
                break;
            default:
                console.warn(`No color match for ${d}`);
                color = '#636f83'; // brand dark
        }
        return color;
    };

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
        });

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
            fillOpacity: 0.9
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

            radius: 6,
            fillColor: acledColor(feature.properties.EVENT_TYPE),
            color: 'white',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.5
        };
    }

    var events_obj = {
        'battles': document.getElementById('battles-check').value,
        'explosions': document.getElementById('explosions-check').value,
        'protests': document.getElementById('protests-check').value,
        'riots': document.getElementById('riots-check').value,
        'strategic': document.getElementById('strategic-check').value,
        'violence': document.getElementById('violence-check').value,
        'region': document.getElementById('select-region').value,
        'year': document.getElementById('select-year').value
    };

    const covidSwitch = document.getElementById('covid-switch').value;

    var url = '/acledEvents?battles=' + encodeURIComponent(events_obj.battles) + '&explosions=' + encodeURIComponent(events_obj.explosions) +
        '&protests=' + encodeURIComponent(events_obj.protests) + '&riots=' + encodeURIComponent(events_obj.riots) + '&strategic=' + encodeURIComponent(events_obj.strategic) +
        '&violence=' + encodeURIComponent(events_obj.violence) + '&region=' + encodeURIComponent(events_obj.region) + '&year=' + encodeURIComponent(events_obj.year) + '&capital=' +
        encodeURIComponent(capital) + '&slider=' + encodeURIComponent(covidSwitch) + ' ';



    btnHandlers.toggleBusy();
    fetch(url).then((response) => {
        btnHandlers.toggleBusy();

        response.json().then((data) => {
            if (data.error) {
                return console.error(data.error);
            }



            var acledData = [];
            var geos = [];



            data.data.forEach((data) => {
                acledData.push({
                    'type': 'Feature',
                    'properties': {
                        'ACTOR1': data.actor1,
                        'EVENT_DATE': data.event_date,
                        'EVENT_TYPE': data.event_type,
                        'LOCATION': data.location,
                        'SOURCE': data.source,
                        'popupContent': 'LOCATION: ' + data.location + '\nEVENT: ' + data.event_type + '\nSOURCE: ' + data.source + '\nDATE: ' + data.event_date + ' ' + data.country
                    },
                    'geometry': JSON.parse(data.COORDINATES),
                });

                geos.push(JSON.parse(data.COORDINATES));
            });


            var coords = geos.map(a => a.coordinates.reverse());


            console.log(acledData);
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

            });

            acledLayerGroup.addLayer(acledLayer);




            let options = {
                'minOpacity': 0.24,
                'maxZoom': 9,
                'radius': 12,
                'gradient': { 0.35: 'blue', 0.45: 'lime', 1: 'red' }
            };
            var heat = L.heatLayer(coords, options);

            acledHeatLayer.addLayer(heat);

            dbscan_polygon_get(events_obj, capital);



        });

    });

};
