var App = new function() {
  var self = this,
      elScript,
      coordinates = {
        party: {
          lat: 32.181830,
          lng: 34.925617
        },
        paidParking: {
          lat: 32.182456,
          lng: 34.927065
        }
      },
      map, geocoder, directionsService, directionsDisplay,
      MAPS_API_KEY = "AIzaSyDeb-THK2Z4pUkL990AKo2VeHpHK8avf3c",
      FORECAST_API_KEY = "e35dffdc2d764ddb8992cdc5520f0305";

  this.rsvp = false;

  this.init = function init() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://maps.googleapis.com/maps/api/js?key="+MAPS_API_KEY+"&sensor=true&callback=App.initGoogleMaps";
    document.body.appendChild(script);

    document.getElementById("getdirections").addEventListener("click", App.showGetDirections);

    document.getElementById("ifrm").setAttribute("onload", "if(App.rsvp) {App.rsvpSent();}");

    $('#rsvp').on('hidden.bs.modal', function () {
      document.getElementById("ss-form").reset();
      document.getElementById("rsvp.submit").removeAttribute("disabled");
      document.getElementById("rsvp.message").classList.remove("in");
      self.rsvp = false;
    });

    self.getForecast();
  };

  this.getForecast = function getForecast() {
    elScript = document.createElement('script');
    elScript.src = "https://api.forecast.io/forecast/"+FORECAST_API_KEY+"/"+coordinates.party.lat+","+coordinates.party.lng+",2014-10-16T15:30:00+0300?units=si&exclude=minutely,hourly,flags&callback=App.renderForecast";
    elScript.type = 'text/javascript';

    document.body.appendChild(elScript);
  };

  this.renderForecast = function renderForecast(response) {
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
      icon: "/images/cake.png",
      draggable:false,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(coordinates.party.lat, coordinates.party.lng)
    });
    var partyInfoWindow = new google.maps.InfoWindow({
      content: '<div id="content"><h3>Cumple Olivia</h3><div><p>Los esperamos el <strong>Jueves 16/10</strong> a las <strong>15:30</strong></p></div></div>'
    });
    partyInfoWindow.open(map,partyMarker);
    google.maps.event.addListener(partyMarker, 'click', function() {
      partyInfoWindow.open(map,partyMarker);
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
      content: '<div id="content"><h3>Estacionamiento</h3><div><p>Les recomendamos estacionar aca.</p></div></div>'
    });
    google.maps.event.addListener(paidParkingMarker, 'click', function() {
      paidParkingInfoWindow.open(map,paidParkingMarker);
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
    var directionsDiv = document.getElementById("directions");
        directionsDiv.style.display = "block";

    directionsDiv.querySelector("input").focus();
  };

  this.getDirections = function getDirections() {
    var address = document.getElementById('address');
    geocoder.geocode( { 'address': address.value}, function(geoResults, geoStatus) {
      if (geoStatus == google.maps.GeocoderStatus.OK) {
        directionsService.route({
          origin: geoResults[0].geometry.location,
          destination: new google.maps.LatLng(coordinates.paidParking.lat, coordinates.paidParking.lng),
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

  this.validateRsvp = function validateRsvp() {
    if (!document.getElementById("nombre").value.trim().length) {
      alert('¿Quien sos?');
      return false;
    }
    if (!document.getElementById("venis").checked && !document.getElementById("novenis").checked) {
      alert("¿Venis o no?");
      return false;
    }
    document.getElementById("rsvp.submit").setAttribute("disabled", "disabled");
    self.rsvp = true;
    return true;
  };

  this.rsvpSent = function rsvpSent() {
    document.getElementById("rsvp.message").classList.add("in");
  };
};
window.onload = App.init;
