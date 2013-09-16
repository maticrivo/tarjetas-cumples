var App = new function() {
  var self = this,
      coordinates = {
        party: {
          lat: 32.182387,
          lng: 34.921941
        },
        parking: {
          lat: 32.182659,
          lng: 34.919520
        }
      },
      map, geocoder, directionsService, directionsDisplay,
      MAPS_API_KEY = "AIzaSyDeb-THK2Z4pUkL990AKo2VeHpHK8avf3c";

  this.init = function init() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://maps.googleapis.com/maps/api/js?key="+MAPS_API_KEY+"&sensor=true&callback=App.initGoogleMaps";
    document.body.appendChild(script);

    document.getElementById("getdirections").addEventListener("click", App.showGetDirections);
  };

  this.initGoogleMaps = function initGoogleMaps() {
    google.maps.visualRefresh = true;
    map = new google.maps.Map(document.getElementById("map"), {
      center: new google.maps.LatLng(coordinates.party.lat, coordinates.party.lng),
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      keyboardShortcuts: false,
      scrollwheel: false
    });

    var partyMarker = new google.maps.Marker({
      map:map,
      icon: "/images/balloons.png",
      draggable:false,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(coordinates.party.lat, coordinates.party.lng)
    });
    var partyInfoWindow = new google.maps.InfoWindow({
      content: '<div id="content"><h1>Cumple Oli</h1><div><p>Los esperamos a las  el Sabado 19/10 a las 16:00</p></div></div>'
    });
    google.maps.event.addListener(partyMarker, 'click', function() {
      partyInfoWindow.open(map,partyMarker);
      parkingInfoWindow.close();
    });

    var parkingMarker = new google.maps.Marker({
      map:map,
      icon: "/images/parking.png",
      draggable:false,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(coordinates.parking.lat, coordinates.parking.lng)
    });
    var parkingInfoWindow = new google.maps.InfoWindow({
      content: '<div id="content"><h1>Estacionamiento</h1><div><p>Aca hay mucho lugar para estacionar</p></div></div>'
    });
    google.maps.event.addListener(parkingMarker, 'click', function() {
      parkingInfoWindow.open(map,parkingMarker);
      partyInfoWindow.close();
    });

    geocoder = new google.maps.Geocoder();
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer({
      draggable: true,
    });
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));
  };

  this.showGetDirections = function showGetDirections(e) {
    e.preventDefault();

    var directionsDiv = document.getElementById("directions");
        directionsDiv.style.display = "block";

    directionsDiv.querySelector("input").focus();
    return false;
  };

  this.getDirections = function getDirections() {
    var address = document.getElementById('address');
    geocoder.geocode( { 'address': address.value}, function(geoResults, geoStatus) {
      if (geoStatus == google.maps.GeocoderStatus.OK) {
        directionsService.route({
          origin: geoResults[0].geometry.location,
          destination: new google.maps.LatLng(coordinates.parking.lat, coordinates.parking.lng),
          travelMode: google.maps.DirectionsTravelMode.DRIVING
        }, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            address.blur();
          }
        });
      }
    });
    return false;
  };
};
window.onload = App.init;
