'use strict'


const apriori_info_get = (country_capital) => {   

    console.log(country_capital);

    var events_obj = {
        'battles' : document.getElementById('battles-check').value,
        'explosions' : document.getElementById('explosions-check').value,
        'protests' : document.getElementById('protests-check').value,
        'riots' : document.getElementById('riots-check').value,
        'strategic': document.getElementById('strategic-check').value,
        'violence' : document.getElementById('violence-check').value,
        'year' : document.getElementById('select-year').value
    }

    console.log(events_obj);

    var url = '/acledApriori?battles='+encodeURIComponent(events_obj.battles)+'&explosions='+encodeURIComponent(events_obj.explosions)+
    '&protests='+encodeURIComponent(events_obj.protests)+'&riots='+encodeURIComponent(events_obj.riots)+'&strategic='+encodeURIComponent(events_obj.strategic)+
    '&violence='+encodeURIComponent(events_obj.violence)+'&year='+encodeURIComponent(events_obj.year)+'&capital=' +
    encodeURIComponent(country_capital)+' ';



    fetch(url).then((response) => {

        response.json().then((data) => {
            if(data.error){
                return console.log(data.error)
            }

        

            //aprioriData = []; // eslint-disable-line no-undef
            console.log(data.data);


        })

    })
    
        

}