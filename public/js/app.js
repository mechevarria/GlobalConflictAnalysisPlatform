'use strict';

//Building the tile and the geojson layers
var baseMaps = {
    '<span style="color: gray">Open Street Map</span>': L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }),
    '<span style="color: gray">Esri Street Map</span>': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
    })
};

var map = L.map('mapid', {
    center: [33.3152, 44.3661],
    zoom: 3,
    layers: [baseMaps['<span style="color: gray">Esri Street Map</span>']]
});


var fsiLayerGroup = new L.LayerGroup();
fsiLayerGroup.addTo(map);

var acledLayerGroup = new L.LayerGroup();
var acledHeatLayer = new L.LayerGroup();
var dbscanLayerGroup = new L.LayerGroup();

var overlayMaps = {

    '<span style="color: gray">FSI</span>': fsiLayerGroup,
    '<span style="color: gray">Heat Layer</span>': acledHeatLayer,
    '<span style="color: gray">CLUSTER</span>': dbscanLayerGroup,
    '<span style="color: gray">ACLED</span>': acledLayerGroup
};

//FROM mapInfo.js
mapInfo.addTo(map);

var controlLayer = new L.control.layers(baseMaps, overlayMaps);

controlLayer.addTo(map);