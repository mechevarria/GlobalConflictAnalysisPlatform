//Setting the map in Detroit and displaying it

var map = L.map('mapid').setView([33.3152, 44.3661], 4);

//Building the tile and the geojson layers
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-v9',//'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoiYWFyanVsaWFuIiwiYSI6ImNrNGExamhpMjBiZHMzbW83YnMzNWZvYzQifQ.O1krsNsWSnr1W6VgC465zA'
}).addTo(map);