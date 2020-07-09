apriori_info_get = (country_capital, shape) => {

    var aprioriLayer;
    console.log(country_capital);

    var events_obj = {
        'battles' : document.getElementById("battles-check").value,
        'explosions' : document.getElementById("explosions-check").value,
        'protests' : document.getElementById("protests-check").value,
        'riots' : document.getElementById("riots-check").value,
        'strategic': document.getElementById("strategic-check").value,
        'violence' : document.getElementById("violence-check").value,
        'region' : document.getElementById("select-region").value,
        'year' : document.getElementById("select-year").value
    }

    var url = '/acledApriori?battles='+encodeURIComponent(events_obj.battles)+'&explosions='+encodeURIComponent(events_obj.explosions)+
    '&protests='+encodeURIComponent(events_obj.protests)+'&riots='+encodeURIComponent(events_obj.riots)+'&strategic='+encodeURIComponent(events_obj.strategic)+
    '&violence='+encodeURIComponent(events_obj.violence)+'&region='+encodeURIComponent(events_obj.region)+'&year='+encodeURIComponent(events_obj.year)+'&capital=' +
    encodeURIComponent(country_capital)+' ';


    aprioriColor = (d) => { 

        return '#DAEAF3';
    }
    
    
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }
    
    
    function resetHighlight(e) {
        aprioriLayer.resetStyle(e.target);
        info.updateApriori();
    }
    
    function zoomToFeature(e) {
        
       
    
        map.fitBounds(e.target.getBounds());
    
        fsiLayer.bringToBack();
       
    }
    
    
    //highlights the object when hovering over it
    function highlightFeature(e) {
        var layer = e.target;
    
        layer.setStyle({
            weight: 3,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.0
        });
    
        //error checking depending on the browser
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    
        //info.updateApriori(layer.feature.properties);
        info.updateApriori(aprioriData);
    }
    
    function style(feature) {
        return {
            weight: 2,
            opacity: 0.0,
            color: null,
            dashArray: '3',
            fillOpacity: 0.0,
            fillColor: null//aprioriColor('blue')
        };
    }


    fetch(url).then((response) => {

        response.json().then((data) => {
            if(data.error){
                return console.log(data.error)
            }

        

            aprioriData = [];
            console.log(data.data);
            data.data.forEach((data) => {
                aprioriData.push({
                    "type": 'Feature',
                    'properties': {
                        'ANTECEDENT' : data.ANTECEDENT,
                        'CONFIDENCE' : data.CONFIDENCE,
                        'CONSEQUENT' : data.CONSEQUENT,
                        'LIFT'       : data.LIFT,
                        'SUPPORT'    : data.SUPPORT         
                    },
                    'geometry':shape, 
                })
            });

            //TODO: SET Z INDEX OF EACH OF THE LAYERGROUPS SO THAT THIS IS ONE ABOVE FSI BUT BEHIND ALL OTHER GROUPS
            aprioriLayer = L.geoJSON(aprioriData[0], {
                style: style,
                onEachFeature: onEachFeature
        
            }).addTo(map);

        })

    })
    
        

}