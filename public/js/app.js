const baseMaps = {
    '<span style="color: gray">Open Street Map</span>': L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }),
    '<span style="color: gray">Esri Street Map</span>': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
    })
};

const map = L.map('mapid', {
    center: [33.3152, 44.3661],
    zoom: 3,
    layers: [baseMaps['<span style="color: gray">Esri Street Map</span>']]
});

const fsiLayerGroup = new L.LayerGroup();
fsiLayerGroup.addTo(map);

const acledLayerGroup = new L.LayerGroup();
const acledHeatLayer = new L.LayerGroup();
const dbscanLayerGroup = new L.LayerGroup();

const overlayMaps = {

    '<span style="color: gray">FSI</span>': fsiLayerGroup,
    '<span style="color: gray">Heat Layer</span>': acledHeatLayer,
    '<span style="color: gray">CLUSTER</span>': dbscanLayerGroup,
    '<span style="color: gray">ACLED</span>': acledLayerGroup
};

const controlLayer = new L.control.layers(baseMaps, overlayMaps);

mapInfo.addTo(map);

controlLayer.addTo(map);

const searchModal = new coreui.Modal(document.getElementById('searchModal'));

document.getElementById('search').onclick = () => {
    searchModal.show();
};

document.getElementById('cancel').onclick = () => {
    searchModal.hide();
};

document.getElementById('update').onclick = () => {
    fsi_polygon_get();
    searchModal.hide();
};