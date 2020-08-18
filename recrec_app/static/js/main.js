// // Creating our initial map object
// // We set the longitude, latitude, and the starting zoom level
// // This gets inserted into the div with an id of 'map'
// //Commented out because tilemap handled by main
var myMap = L.map("map", {
    center: [50, 0],
    zoom: 2.5
});

// //   // Adding a tile layer (the background map image) to our map
// //   // We use the addTo method to add objects to our map
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    noWrap: true,
    accessToken: API_KEY
}).addTo(myMap);
//["7400b8","6930c3","5e60ce","5390d9","4ea8de","48bfe3","56cfe1","64dfdf","72efdd","80ffdb"]
var cuisineColor = {
    "Vietnam" : "#7400b8",
    "Italy" : "#6930c3",
    "France" : "#5e60ce",
    "Spain" : "#5390d9",
    "India" : "#4ea8de",
    "China" : "#48bfe3",
    "Korea" : "#56cfe1",
    "Thailand" : "#64dfdf",
    "Japan" : "#72efdd",
    "United States" : "#80ffdb",
    "Mexico" : "#7400b8",
    "Greece" : "#80ffdb",
    "Southern" : "#6930c3",
    "Latin America" : "#5e60ce",
    "Louisiana Creole" : "#5390d9",
    "United Kingdom" : "#4ea8de"
};

function onEachFeature(feature, layer) {
    layer.bindPopup ("Cuisine Type: " + feature.properties.name);
    layer.setStyle({
        'fillColor': cuisineColor[feature.properties.name],
        'fillOpacity' : 0.4
        });
    layer.on('mouseover', function () {
        this.setStyle({
            'fillOpacity' : 0.7
        });
    });
    layer.on('mouseout', function () {
        this.setStyle({
            'fillOpacity' : 0.4
        });
    });
};
// // Use this link to get the geojson data.
var link = "static/resources/custom.geojson";

// Grabbing our GeoJSON data..
d3.json(link, function(data) {
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
        onEachFeature: onEachFeature
    }).addTo(myMap);
  });

