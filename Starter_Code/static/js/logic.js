//store the URL for the GeoJSON data
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Add a tile layer.
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
//define the earthquake layergroup 
let Edata = new L.LayerGroup();



// Create map object.
let Mapobj = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [streetmap]
});


//define base
let baseMaps = {
    "streetmap": streetmap
};

//define the overlays
let overlays = {
    "Earthquakes": Edata,

};
//add a control layer 
L.control.layers(baseMaps, overlays).addTo(Mapobj);

//Styling
function styling(feature) {
    return {
        fillColor: depthColor(feature.geometry.coordinates[2]),
        color: depthColor(feature.geometry.coordinates[2]),
        radius: Radius(feature.properties.mag)
    }
};

//conditionals for depth colors
function depthColor(depth) {
    if (depth <= 10){
         return "red"
    }
        else if (depth > 10 & depth <= 25){
            return "green"
        }
        else if (depth > 25 & depth <= 40){
             return "purple"
        }
        else if (depth > 40 & depth <= 55) {
            return "blue"
        }
        else if (depth > 55 & depth <= 70) {
            return "orange"
        }
        else return "green";
};

//magnitudes
function Radius(magnitude) {
    let rad= magnitude*5;
    return rad;
};

d3.json(url).then(function (data) {
    L.geoJson(data, {
        pointToLayer: function (feature, latlon) {  
            return L.circleMarker(latlon).bindPopup(feature.id); 
        },
        style: styling
    }).addTo(Edata);
    Edata.addTo(Mapobj);
})
// with Help from Chat GPT
let legend = L.control({ position: "bottomright" });
legend.onAdd = function(Mapobj) {
    var div = L.DomUtil.create("div", "legend");
       div.innerHTML += "<h3>Earthquake Depth</h3>";
       div.innerHTML += '<span>(Depth < 10) red</span><br>';
       div.innerHTML += '<span>(10 < Depth <= 25) green</span><br>';
       div.innerHTML += '<span>(25 < Depth <= 40) purple</span><br>';
       div.innerHTML += '<span>(40 < Depth <= 55) blue</span><br>';
       div.innerHTML += '<span>(55 < Depth <= 70) orange</span><br>';
       div.innerHTML += '<span>(Depth > 70) green</span><br>';
  
    return div;
  };
  //add the legend to the map
  legend.addTo(Mapobj);