// // Creating our initial map object
// // We set the longitude, latitude, and the starting zoom level
// // This gets inserted into the div with an id of 'map'
// //Commented out because tilemap handled by main
var myMap = L.map("map", {
    center: [30, 20],
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
    "Vietnam" : "red",
    "Italy" : "#51f374",
    "France" : "#6bd1e0",
    "Spain" : "#c6e759",
    "India" : "#44c18b",
    "China" : "#8e47b5",
    "Korea" : "#c6e759",
    "Thailand" : "#34ebeb",
    "Japan" : "#5f74ee",
    "United States" : "#6bd1e0",
    "Mexico" : "#44c18b",
    "Greece" : "#df2a17",
    "Southern" : "yellow",
    "Latin America" : "#8e90b7",
    "Louisiana Creole" : "red",
    "United Kingdom" : "#730ae4"
};

function onEachFeature(feature, layer) {
    layer.bindPopup (`<a href='/ingredients/${feature.properties.name}'>Cuisine Type:  ${feature.properties.name}</a>`);//Put a link to ingredients?
    layer.setStyle({
        'fillColor': cuisineColor[feature.properties.name],
        'fillOpacity' : 0.4,
        // 'stroke' : false,
        'weight' : 1,
        'color' : '#8e90b7'
        });
    layer.on('mouseover', function () {
        this.setStyle({
            'fillOpacity' : 0.7
        });
        this.popupopen;
    });
    layer.on('mouseout', function () {
        this.setStyle({
            'fillOpacity' : 0.4
        });
        this.popupclose;
    });

    // layer.on('click', function(){
    //     // window.open() returns the new window's window object
    //     window.open('/ingredients');
    // })
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

