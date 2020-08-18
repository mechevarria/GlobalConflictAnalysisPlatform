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

// eslint-disable-next-line no-unused-vars
let sunChart = new Highcharts.chart('sun-chart', {

    chart: {
        height: '100%'
    },

    colors: ['#FFFFFF', '#321fdb', '#f9b115', '#e55353', '#3399ff', '#2eb85c', '#636f83'],

    title: {
        text: 'Event Group Analysis'
    },
    subtitle: {
        text: 'Apriori Association Algorithm on ACLED events data has produced this visualization'
    },
    series: [{
        type: 'sunburst',
        data: null,
        allowDrillToNode: true,
        cursor: 'pointer',
        dataLabels: {
            format: '{point.name}',
            filter: {
                property: 'innerArcLength',
                operator: '>',
                value: 16
            },
            rotationMode: 'circular'
        },
        levels: [{
            level: 1,
            levelIsConstant: false,
            dataLabels: {
                filter: {
                    property: 'outerArcLength',
                    operator: '>',
                    value: 64
                }
            }
        }, {
            level: 2,
            colorByPoint: true
        },
        {
            level: 3,
            colorVariation: {
                key: 'brightness',
                to: -0.5
            }
        }, {
            level: 4,
            colorVariation: {
                key: 'brightness',
                to: 0.5
            }
        }]

    }],
    tooltip: {
        headerFormat: '',
        pointFormat: 'The total Relevance Score of <b>{point.name}</b> is <b>{point.value}</b>'
    }
});

// eslint-disable-next-line no-unused-vars
let wordCloudChart = new Highcharts.chart('word-cloud-chart', {
    accessibility: {
        screenReaderSection: {
            beforeChartFormat: '<h5>{chartTitle}</h5>' +
                '<div>{chartSubtitle}</div>' +
                '<div>{chartLongdesc}</div>' +
                '<div>{viewTableButton}</div>'
        }
    },
    series: [{
        type: 'wordcloud',
        data: null,
        name: 'Occurrences'
    }],
    title: {
        text: 'Notes Word Cloud'
    }
});