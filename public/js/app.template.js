//Building the tile and the geojson layers
var satelliteLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-streets-v9',//'mapbox/streets-v11',
    accessToken: '${MAPBOX_TOKEN}'
})

var openstreetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
{id: 'mapbox/streets-v11',
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
accessToken: '${MAPBOX_TOKEN}'});

var map = L.map('mapid', {
    center: [33.3152, 44.3661],
    zoom: 3,
    layers: [openstreetmap, satelliteLayer]
});


var fsiLayerGroup = new L.LayerGroup();
fsiLayerGroup.addTo(map);

var acledLayerGroup = new L.LayerGroup();


var  baseMaps = {

        "<span style='color: gray'>Open Streets</span>": openstreetmap,
        "<span style='color: gray'>Satellites</span>": satelliteLayer
   
}

var overlayMaps = {

    "<span style='color: gray'>FSI</span>":  fsiLayerGroup, 
    "<span style='color: gray'>ACLED</span>":  acledLayerGroup   
}

//FROM mapInfo.js
info.addTo(map);

var controlLayer = new L.control.layers(baseMaps, overlayMaps);

controlLayer.addTo(map);






