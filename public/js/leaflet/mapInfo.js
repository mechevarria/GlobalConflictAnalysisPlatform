// control that shows tract info on hover
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};


//Updates the info shown in the top-right
info.update = function (props) {

    this._div.innerHTML = '<h4>Tract Info</h4>' +  ('Hover over a tract');
};




