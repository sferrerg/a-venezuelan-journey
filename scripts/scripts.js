const startingPoints = [{name: "Maracaibo", latlng: [10.6488, -71.6631],
    routes: [
      {
        destination: "Panama",
        latlng: [8.9824, -79.5199],
        route: "Panama - Miami"
        
      },
      {
        destination: "Santo Domingo",
        latlng: [18.4861, -69.9312],
        route: "Caracas - Santo Domingo - Miami",
        
      },
      {
        destination: "Barranquilla",
        latlng: [10.9685, -74.7813],
        route: "Barranquilla - Miami"
        
      },
      {
        destination: "Cartagena",
        latlng: [10.391, -75.4794],
        route: "Cartagena - Miami"
        
      },
      {
        destination: "Bogota",
        latlng: [4.7109, -74.0721],
        route: "Rio Hacha - Bogota - Miami"
        
      },
      {
        destination: "Bogota",
        latlng: [4.7109, -74.0721],
        route: "Caracas - Bogota - Miami"
        
      },
      {
        destination: "Caracas",
        latlng: [10.4806, -66.9036],
        route: "Maracaibo - Caracas - Miami"
        
      },
      {
        destination: "Rio Hacha",
        latlng: [11.5449, -72.9073],
        route: "Maracaibo - Rio Hacha - Miami",
        
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
  startingMarker.addEventListener('click', function(e) {
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
      destinationMarker.addEventListener('click', function(e) {
        let startingLatLng = e.target._popup._source._latlng;
        let destinationLatLng = e.latlng;
        
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

const showAllRoutesBtn = document.querySelector('#show-all-routes');
const showMostExpensiveRoutesBtn = document.querySelector('#show-expensive-routes');
const showEasiestRouteBtn = document.querySelector('#show-easiest-route');
const showHardestRouteBtn = document.querySelector('#show-hardest-route');
const showPlaneRoutesBtn = document.querySelector('#show-plane-routes');
const showMixRoutesBtn = document.querySelector('#show-mix-routes');
const resetMapBtn = document.querySelector('#reset-map');

showAllRoutesBtn.addEventListener('click', showAllRoutes);
showMostExpensiveRoutesBtn.addEventListener('click', showMostExpensiveRoutes);
showEasiestRouteBtn.addEventListener('click', showEasiestRoute);
showHardestRouteBtn.addEventListener('click', showHardestRoute);
showPlaneRoutesBtn.addEventListener('click', showPlaneRoutes);
showMixRoutesBtn.addEventListener('click', showMixRoutes);
resetMapBtn.addEventListener('click', resetMap);

function showAllRoutes() {
  map.eachLayer(function(layer) {
    if (layer instanceof L.Marker || layer instanceof L.Popup) {
      map.removeLayer(layer);
    }
  });
  let bounds = [];
  for (let i = 0; i < startingPoints.length; i++) {
    let startingPoint = startingPoints[i];
    for (let j = 0; j < startingPoint.routes.length; j++) {
      let route = startingPoint.routes[j];
      let destinationMarker = L.marker(route.latlng).addTo(map);
      destinationMarker.bindPopup("<b>" + route.destination + "</b><br>" + route.route);
      bounds.push(destinationMarker.getLatLng());
    }
    ;
  }
  map.fitBounds(bounds); 
};

function showMostExpensiveRoutes() {
  map.eachLayer(function(layer) {
    if (layer instanceof L.Marker || layer instanceof L.Popup) {
      map.removeLayer(layer);
    }
  });
  let bounds = [];
  for (let i = 0; i < startingPoints.length; i++) {
    let startingPoint = startingPoints[i];
    for (let j = 0; j < startingPoint.routes.length; j++) {
      let route = startingPoint.routes[j];
      if (["Santo Domingo", "Panama", "Bogota", "Caracas"].includes(route.destination)) {
        let destinationMarker = L.marker(route.latlng).addTo(map);
        destinationMarker.bindPopup("<b>" + route.destination + "</b><br>" + route.route);
        bounds.push(route.latlng);
      }
    }
    ;
  }
  map.fitBounds(bounds);
};

function showEasiestRoute() {
  map.eachLayer(function(layer) {
    if (layer instanceof L.Marker || layer instanceof L.Popup) {
      map.removeLayer(layer);
    }
  });
  let bounds = [];
  for (let i = 0; i < startingPoints.length; i++) {
     let startingPoint = startingPoints[i];
     for (let j = 0; j < startingPoint.routes.length; j++) {
       let route = startingPoint.routes[j];
       if (["Panama"].includes(route.destination)) {
          let destinationMarker = L.marker(route.latlng).addTo(map);
          destinationMarker.bindPopup("<b>" + route.destination + "</b><br>" + route.route);
       }
       bounds.push(route.latlng);
     }
     ;
   }
    map.fitBounds(bounds);
}

function showHardestRoute() {
  map.eachLayer(function(layer) {
    if (layer instanceof L.Marker || layer instanceof L.Popup) {
      map.removeLayer(layer);
    }
  });
  let bounds = [];
  for (let i = 0; i < startingPoints.length; i++) {
    let startingPoint = startingPoints[i];
    for (let j = 0; j < startingPoint.routes.length; j++) {
      let route = startingPoint.routes[j];
      if (route.destination === "Rio Hacha") {
        let destinationMarker = L.marker(route.latlng).addTo(map);
        destinationMarker.bindPopup("<b>" + route.destination + "</b><br>" + route.route);
        bounds.push(route.latlng);
      }
    }
  }
  if (bounds.length > 0) {
    let group = new L.featureGroup(bounds);
    map.fitBounds(group.getBounds());
  }
}

function showPlaneRoutes() {
  map.eachLayer(function(layer) {
    if (layer instanceof L.Marker || layer instanceof L.Popup) {
      map.removeLayer(layer);
    }
  });
  let bounds = [];
  for (let i = 0; i < startingPoints.length; i++) {
    let startingPoint = startingPoints[i];
    for (let j = 0; j < startingPoint.routes.length; j++) {
      let route = startingPoint.routes[j];
      if (["Santo Domingo", "Panama", "Bogota", "Caracas"].includes(route.destination)) {
        let destinationMarker = L.marker(route.latlng).addTo(map);
        destinationMarker.bindPopup("<b>" + route.destination + "</b><br>" + route.route);
        bounds.push(route.latlng);
      }
    }
    ;
  }
  map.fitBounds(bounds);
};

function showMixRoutes() {
  map.eachLayer(function(layer) {
    if (layer instanceof L.Marker || layer instanceof L.Popup) {
      map.removeLayer(layer);
    }
  });
  let bounds = [];
  for (let i = 0; i < startingPoints.length; i++) {
    let startingPoint = startingPoints[i];
    for (let j = 0; j < startingPoint.routes.length; j++) {
      let route = startingPoint.routes[j];
      if (["Rio Hacha", "Barranquilla", "Cartagena"].includes(route.destination)) {
        let destinationMarker = L.marker(route.latlng).addTo(map);
        destinationMarker.bindPopup("<b>" + route.destination + "</b><br>" + route.route);
        bounds.push(route.latlng);
      }
    }
    ;
  }
};

function resetMap() {
  map.eachLayer(function(layer) {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
    if (layer instanceof L.Polyline) {
      map.removeLayer(layer);
    }
  });
  let startingPoint = startingPoints[0];
  let startingMarker = L.marker(startingPoint.latlng).addTo(map);
  startingMarker.bindPopup("<b>" + startingPoint.name + "</b><br>Hi! You just clicked " + startingPoint.name + ", Venezuela. This is your starting point. This is where I lived before moving to the US. All the pins that just appeared are different routes you will need to take to get to the US. Click on another pin to explain how to get to Miami traveling through there!");
  startingMarker.addEventListener('click', function(e) {
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
      destinationMarker.addEventListener('click', function(e) {
        let startingLatLng = e.target._popup._source._latlng;
        let destinationLatLng = e.latlng;
        
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
