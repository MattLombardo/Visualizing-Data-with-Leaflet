var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl, function(data) {
  createFeatures(data.features);
});

function magColor(mag) {
  if (mag > 0 && mag < 1) {
    return "Green";
  }
  if (mag >= 1 && mag < 2) {
    return "LightGreen";
  }
  if (mag >= 2 && mag < 3) {
    return "Yellow";
  }
  if (mag >= 3 && mag < 4) {
    return "Orange";
  }
  if (mag >= 4 && mag < 5) {
    return "Red";
  }
  if (mag >= 5) {
    return "DarkRed";
  }
}

function createFeatures(earthquakeData) {
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "<p> Magnitude: " + feature.properties.mag + "</p>");
  }

  function circleStyling(feature) {
  	return {
      color: "black",
      radius: feature.properties.mag * 4,
      fillColor: magColor(feature.properties.mag),
      fillOpacity: 1,
      weight: 0.75,
  	};
  }
  function pointToLayer(feature, coord) {
    return L.circleMarker(coord, circleStyling(feature)); 
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer:pointToLayer,
    onEachFeature: onEachFeature
  });
  createMap(earthquakes);
}

function createMap(earthquakes) {
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var baseMaps = {
    "Street Map": streetmap,
    "Light Map": lightmap
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };

  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3.5,
    layers: [streetmap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: "bottomright"});
  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend"),
        categories = ["0-1","1-2","2-3","3-4","4-5","5+"],
        colors = ["Green","LightGreen","Yellow","Orange","Red","DarkRed"]
    for (var i = 0; i < categories.length; i++) {
      div.innerHTML +=
        '<i class="circle" style="background:' + colors[i] + '"></i> ' + categories[i] + "<br>";
    }
    return div;
  };
  legend.addTo(myMap);
}
