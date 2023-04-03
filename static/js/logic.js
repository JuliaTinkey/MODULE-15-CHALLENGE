// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {

    // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    // Give each feature a popup describing the place and time of the earthquakes
    function onEachFeature(feature, layer){}
        layer.bindPopup(`<h3>Where: ${feature.properties.place}</h3><hr><p>Time: ${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}`);
    }

    // Create a GeoJSON layer
    function createCircleMarker(feature, latlng){
        var options = {
            radius:feature.properties.mag*5,
            fillColor: chooseColor(feature.properties.mag),
            color: chooseColor(feature.properties.mag),
            weight: 1,
            opacity: 0.8,
            fillOpacity: 0.35
        } 
        return L.circleMarker(latlng,options);
    }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createCircleMarker
    });

    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
}

console.log(earthquakes);

// Color circles based on mag
function chooseColor(mag) {
    switch(true) {
        case (1.0 <= mag && mag <= 2.5):
          return "#0071BC";
        case (2.5 <= mag && mag <= 4.0):
          return "#35BC00";
        case (4.0 <= mag && mag <= 5.5):
          return "#BCBC00";
        case (5.5 <= mag && mag <= 8.0):
          return "#BC3500";
        case (8.0 <= mag && mag <= 20.0):
          return "#BC0000";
        default:
          return "#E2FFAE";
    }
  }
  
// Create map legend to provide context for map data
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend'),
        grades = [1.0, 2.5, 4.0, 5.5, 8.0],
        labels = [];
    
    // loop 
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};

    
// Create map
function createMap(earthquakes) {

    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a baseMaps object.
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // Create an overlay object to hold our overlay.
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
        center: [
            37.05, -95.75
        ],
        zoom: 5,
        layers: [street, earthquakes]
    });

    // Create a layer control.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
    legend.addTo(myMap);

}