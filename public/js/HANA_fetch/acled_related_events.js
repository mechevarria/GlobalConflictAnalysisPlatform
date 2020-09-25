'use strict';

const relatedEvents = (e) => {

    var similarEventLayer;

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

    function resetHighlight(e) {
        similarEventLayer.resetStyle(e.target);
        mapInfo.updatePoint();
    }

    //What functions are run on each feature for interaction
    function onEachFeature(feature, layer) {
        // does this feature have a property named popupContent?
        if (feature.properties && feature.properties.popupContent) {
            layer.bindPopup(feature.properties.popupContent);
        }

        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: resetAcledLayer
        });
    }

    function resetAcledLayer() {

        similarEventsGroup.clearLayers();
        acledLayerGroup.addTo(map);
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

    let url = '/similarAcledEvents?point='+encodeURIComponent(e.latlng.lng + ' ' + e.latlng.lat) + '&timestamp='+encodeURIComponent(e.target.feature.properties.TIMESTAMP)+
    '&actor='+encodeURIComponent(e.target.feature.properties.ACTOR1)+'';
    console.log(url);
    fetch(url)
    .then(res => res.json())
    .then((res) => {
        if (res.error) {
            throw new Error(res.error);
        }

        console.log(res);
        var similarAcledData = [];

        res.data.forEach((data) => {

            similarAcledData.push({
                'type': 'Feature',
                'properties': {
                    'ACTOR1': data.actor1,
                    'EVENT_DATE': data.event_date,
                    'EVENT_TYPE': data.event_type,
                    'LOCATION': data.location,
                    'SOURCE': data.source,
                    'TIMESTAMP': data.timestamp,
                    'FATALITIES': data.fatalities
                },
                'geometry': JSON.parse(data.COORDINATES),
            });
        });
        
        similarEventLayer = L.geoJSON(similarAcledData, {
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

        similarEventsGroup.addLayer(similarEventLayer);
        similarEventsGroup.addTo(map);
        
    }).catch(error => {
        console.error('Error fetching data from /acledSimilarEvents', error);
    });



};