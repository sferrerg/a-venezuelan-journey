const startingPoints = [{name: "Maracaibo", latlng: [10.6488, -71.6631],
    routes: [
      {
        destination: "Panama",
        latlng: [8.9824, -79.5199],
        route: "Hi there! Panama is one of the easiest routes used to get to Miami. You must take a plane from Maracaibo to Panama and then a direct flight to Miami. Since it's the fastest, most convenient route, it is one of the most expensive routes to take! If you can afford it, this is your best option."
        
      },
      {
        destination: "Santo Domingo",
        latlng: [18.4861, -69.9312],
        route: "Hey! This is one of the trickiest routes to take, but is also as convenient as the Panama route since you can only take it by plane. You'll have to take a flight from Maracaibo to Caracas, then a flight from Caracas to Santo Domingo, and then a direct flight to Miami from there! It is also part of the pricey ones, but it'll get you there with the least troubles.",
        
      },
      {
        destination: "Barranquilla",
        latlng: [10.9685, -74.7813],
        route: "Hello! This route is considered one of the most dangerous ones because you must drive through the Colombian-Venezuelan border and then find a ride in Colombia that will take you to Barranquilla. Then in Barranquilla, you can take either a direct flight to Miami or fly into Bogota to leave from there. If you've taken this route, you took because it's cheaper than normal or you're definitely a true thrill-seeker."
        
      },
      {
        destination: "Cartagena",
        latlng: [10.391, -75.4794],
        route: "Hi! This route also consists of a combination between air and land travel. You must find a ride to the Colombian-Venezuelan border and reach Barranquilla by finding another driver who'll take you there. From Cartagena, you can take a direct flight to Miami. It really isn't easy to cross the border safely, but it's one of the most affordable ways to travel outside the country! "
        
      },
      {
        destination: "Bogota",
        latlng: [4.7109, -74.0721],
        route: "Hello you! The Bogota route is one of the most versatile routes for Venezuelans. You can either fly from Maracaibo to Caracas and then catch a flight to Bogota (or you can try traveling by land, but no one really does this when going through Bogota because it's far). It is also considered one of the most expensive routes too because of the travel distances, but it is convenient because it's just a series of connecting flights taken by plane to reach Miami."
        
      },
      {
        destination: "Caracas",
        latlng: [10.4806, -66.9036],
        route: "Hola! The Caracas route is one of the most typical routes people take to get to Miami. You can take a plane from Maracaibo to Caracas and then from there either choose the Santo Domingo or Bogota route to get out of the country!"
        
      },
      {
        destination: "Rio Hacha",
        latlng: [11.5449, -72.9073],
        route: "Oh, well, hello! This is the hardest and scariest route for most Venezuelans. You need to drive to the Colombian-Venezuelan border and walk by foot across the border. Sometimes, people have to cross rivers to get to the other side, especially when the border is closed. Then, once you reach Rio Hacha, which is the closest city to the border, you can take a plane to a neighboring Colombian city, and once there, you can take a direct flight to Miami. This route is not for everyone. Beware.",
        
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
  });
  let startingPoint = startingPoints[0];
  let startingMarker = L.marker(startingPoint.latlng).addTo(map);
  startingMarker.bindPopup("<b>" + startingPoint.name + "</b><br>Hi! You just clicked " + startingPoint.name + ", Venezuela. This is your starting point. This is where I lived before moving to the US. All the pins that just appeared are different routes you will need to take to get to the US. Click on another pin to explain how to get to Miami traveling through there!");
  startingMarker.addEventListener('click', function(e) {
    map.eachLayer(function(layer) {
      if (layer instanceof L.Marker && layer !== e.target) {
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
