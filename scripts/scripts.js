let startingPoints = [{name: "Maracaibo", latlng: [10.6488, -71.6631],
    routes: [
      {
        destination: "Panama",
        route: "Panama - Miami",
        latlng: [8.9824, -79.5199]
      },
      {
        destination: "Santo Domingo",
        route: "Caracas - Santo Domingo - Miami",
        latlng: [18.4861, -69.9312]
      },
      {
        destination: "Barranquilla",
        route: "Barranquilla - Miami",
        latlng: [10.9685, -74.7813]
      },
      {
        destination: "Cartagena",
        route: "Cartagena - Miami",
        latlng: [10.391, -75.4794]
      },
      {
        destination: "Bogota",
        route: "Rio Hacha - Bogota - Miami",
        latlng: [4.7109, -74.0721]
      },
      {
        destination: "Bogota",
        route: "Caracas - Bogota - Miami",
        latlng: [4.7109, -74.0721]
      },
      {
        destination: "Caracas",
        route: "Maracaibo - Caracas - Miami",
        latlng: [10.4806, -66.9036]
      },
      {
        destination: "Rio Hacha",
        route: "Maracaibo - Rio Hacha - Miami",
        latlng: [11.5449, -72.9073]
      }
    ]
  }
  ];
  
  let map = L.map('map', {dragging: true}).setView([10.6488, -71.6631], 6);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);
  
for (let i = 0; i < startingPoints.length; i++) {
  let startingPoint = startingPoints[i];
  let startingMarker = L.marker(startingPoint.latlng).addTo(map);
  startingMarker.bindPopup("<b>" + startingPoint.name + "</b><br>Hi! You just clicked " + startingPoint.name + ", Venezuela. This is your starting point. This is where I lived before moving to the US. All the pins that just appeared are different routes you will need to take to get to the US. Click on another pin to explain how to get to Miami traveling through there!");
  startingMarker.on('click', function(e) {
    map.eachLayer(function(layer) {
      if (layer instanceof L.Marker && layer !== e.target) {
        map.removeLayer(layer);
      }
      if (layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    let selectedDestinationMarker;
    let destinationMarkers = [];
    for (let j = 0; j < startingPoint.routes.length; j++) {
      let route = startingPoint.routes[j];
      let destinationMarker = L.marker(route.latlng).addTo(map);
      destinationMarker.bindPopup("<b>" + route.destination + "</b><br>" + route.route);
      destinationMarker.on('click', function(e) {
        let startingLatLng = e.target._popup._source._latlng;
        let destinationLatLng = e.latlng;
        let polyline = L.polyline([startingLatLng, destinationLatLng], {color: 'blue'}).addTo(map);
        
        map.eachLayer(function(layer) {
          if (layer instanceof L.Marker && (layer !== e.target && layer !== selectedDestinationMarker && layer !== startingMarker)) {
            if ((startingPoint.name === "Caracas" && (route.destination === "Santo Domingo" || route.destination === "Bogota")) ||
                (startingPoint.name === "Rio Hacha" && (route.destination === "Bogota" || route.destination === "Cartagena" || route.destination === "Barranquilla"))) {
            } else {
              map.removeLayer(layer);
            }
          }
        });
        
        selectedDestinationMarker = e.target;
      });
      destinationMarkers.push(destinationMarker);
    }

    let allMarkers = [startingMarker, ...destinationMarkers];
    let bounds = L.latLngBounds(allMarkers.map(marker => marker.getLatLng()));
    map.fitBounds(bounds);
  });
}

function showAllRoutes() {
  for (let i = 0; i < startingPoints.length; i++) {
    let startingPoint = startingPoints[i];
    for (let j = 0; j < startingPoint.routes.length; j++) {
      let route = startingPoint.routes[j];

      let destinationMarker = L.marker(route.latlng).addTo(map);
      destinationMarker.bindPopup("<b>" + route.destination + "</b><br>" + route.route);

      let startingLatLng = startingPoint.latlng;
      let destinationLatLng = route.latlng;
    }
  }

  let allMarkers = startingPoints.flatMap(startingPoint => startingPoint.routes.map(route => L.marker(route.latlng)));
  allMarkers.push(L.marker(startingPoints[0].latlng)); 
  let bounds = L.latLngBounds(allMarkers.map(marker => marker.getLatLng()));
  map.fitBounds(bounds);
}

function showMostExpensiveRoutes() {
  let secondDestinations = ["Santo Domingo", "Panama", "Bogota", "Caracas"];
  let allMarkers = [];

  for (let i = 0; i < startingPoints.length; i++) {
    let startingPoint = startingPoints[i];
    for (let j = 0; j < startingPoint.routes.length; j++) {
      let route = startingPoint.routes[j];

      if (secondDestinations.includes(route.destination)) {
        let destinationMarker = L.marker(route.latlng).addTo(map);
        destinationMarker.bindPopup("<b>" + route.destination + "</b><br>" + route.route);

        let startingLatLng = startingPoint.latlng;
        let destinationLatLng = route.latlng;

        allMarkers.push(destinationMarker);
      }
    }
  }

  allMarkers.push(L.marker(startingPoints[0].latlng));

  let bounds = L.latLngBounds(allMarkers.map(marker => marker.getLatLng()));
  map.fitBounds(bounds);
}



function showEasiestRoute() {
}

function showPlaneRoutes() {
}

function showMixRoutes() {
}
