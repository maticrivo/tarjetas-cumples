var App = new function() {
  var self = this,
      elScript,
      coordinates = {
        party: {
          lat: 32.187204,
          lng: 34.851346
        },
        parking: {
          lat: 32.183131,
          lng: 34.852891
        },
        paidParking: {
          lat: 32.185374,
          lng: 34.853084
        }
      },
      map, geocoder, directionsService, directionsDisplay,
      MAPS_API_KEY = "AIzaSyDeb-THK2Z4pUkL990AKo2VeHpHK8avf3c",
      FORECAST_API_KEY = "e35dffdc2d764ddb8992cdc5520f0305";

  this.init = function init() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://maps.googleapis.com/maps/api/js?key="+MAPS_API_KEY+"&sensor=true&callback=App.initGoogleMaps";
    document.body.appendChild(script);

    document.getElementById("getdirections").addEventListener("click", App.showGetDirections);

    self.getForecast();
  };

  this.getForecast = function getForecast() {
    elScript = document.createElement('script');
    elScript.src = "https://api.forecast.io/forecast/"+FORECAST_API_KEY+"/"+coordinates.party.lat+","+coordinates.party.lng+",2013-10-19T16:00:00+0300?units=si&exclude=minutely,hourly,flags&callback=App.renderForecast";
    elScript.type = 'text/javascript';

    document.body.appendChild(elScript);
  };

  this.renderForecast = function renderForecast(response) {
    console.log(response);
    elScript && elScript.parentNode && elScript.parentNode.removeChild(elScript);
    if (response && response.currently) {
      var skycon = new Skycons({"color": "#a586c5", "resizeClear": true});
          skycon.add("skycon", Skycons[response.currently.icon.replace(/[-]/g, "_").toUpperCase()]);
          skycon.play();

      var elTemperature = document.getElementById("temperature");
          elTemperature.innerHTML = Math.round(response.currently.apparentTemperature) + "&deg;C";
    }
  };

  this.initGoogleMaps = function initGoogleMaps() {
    google.maps.visualRefresh = true;
    map = new google.maps.Map(document.getElementById("map"), {
      center: new google.maps.LatLng(coordinates.party.lat, coordinates.party.lng),
      zoom: 15,
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
      content: '<div id="content"><h1>Cumple Olivia</h1><div><p>Los esperamos el Sabado 19/10 a las 16:00</p></div></div>'
    });
    partyInfoWindow.open(map,partyMarker);
    google.maps.event.addListener(partyMarker, 'click', function() {
      partyInfoWindow.open(map,partyMarker);
      parkingInfoWindow.close();
      paidParkingInfoWindow.close();
    });

    var parkingMarker = new google.maps.Marker({
      map:map,
      icon: "/images/parking.png",
      draggable:false,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(coordinates.parking.lat, coordinates.parking.lng)
    });
    var parkingInfoWindow = new google.maps.InfoWindow({
      content: '<div id="content"><h1>Estacionamiento</h1><div><p>Gratuito</p></div></div>'
    });
    google.maps.event.addListener(parkingMarker, 'click', function() {
      parkingInfoWindow.open(map,parkingMarker);
      partyInfoWindow.close();
      paidParkingInfoWindow.close();
    });

    var paidParkingMarker = new google.maps.Marker({
      map:map,
      icon: "/images/parking-meter.png",
      draggable:false,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(coordinates.paidParking.lat, coordinates.paidParking.lng)
    });
    var paidParkingInfoWindow = new google.maps.InfoWindow({
      content: '<div id="content"><h1>Estacionamiento</h1><div><p>Gratuito para los toshavei Ra\'anana o con parquimetro / Pango</p></div></div>'
    });
    google.maps.event.addListener(paidParkingMarker, 'click', function() {
      paidParkingInfoWindow.open(map,paidParkingMarker);
      partyInfoWindow.close();
      parkingInfoWindow.close();
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
