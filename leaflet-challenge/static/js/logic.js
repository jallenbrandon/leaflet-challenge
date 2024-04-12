// Define the URL for the earthquake data
//
const link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

document.addEventListener("DOMContentLoaded", function() {
    // Fetch the earthquake data and call createMap function
    d3.json(link, function(data) {
        createMap(data);
    });
});

// Function to create the earthquake visualization
function createMap(earthquakeData) {
    // Create a map centered at [0, 0] with zoom level 2
    let myMap = L.map("map", {
        center: [0, 0],
        zoom: 2
    });

    // Add a tile layer from Mapbox
    L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token=" + API_KEY, {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18
    }).addTo(myMap);

    // Function to determine the marker size based on earthquake magnitude
    function markerSize(magnitude) {
        return magnitude * 2;
    }

    // Function to determine the marker color based on earthquake depth
    function getColor(depth) {
        return depth > 90 ? '#FF0000' :
               depth > 70 ? '#FF4500' :
               depth > 50 ? '#FFA500' :
               depth > 30 ? '#FFFF00' :
               depth > 10 ? '#ADFF2F' :
                            '#00FF00';
    }

    // Function to create a circle marker for each earthquake
    function createCircleMarker(feature, latlng) {
        return L.circleMarker(latlng, {
            radius: markerSize(feature.properties.mag),
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).bindPopup("<h3>" + feature.properties.place +
                     "</h3><hr><p>" + new Date(feature.properties.time) +
                     "</p><p>Magnitude: " + feature.properties.mag +
                     "</p><p>Depth: " + feature.geometry.coordinates[2] + "</p>");
    }

    // Create a GeoJSON layer containing the features array of the earthquakeData object
    L.geoJSON(earthquakeData, {
        pointToLayer: createCircleMarker
    }).addTo(myMap);

    // Create a legend
    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'info legend');
        let depths = [0, 10, 30, 50, 70, 90];
        let labels = [];

        // loop through our depth intervals and generate a label with a colored square for each interval
        for (let i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(myMap);
}

// Fetch the earthquake data and call createMap function
d3.json(link, function(data) {
    createMap(data);
});