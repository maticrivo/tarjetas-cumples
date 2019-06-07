var App = new (function() {
  var self = this,
    elScript,
    coordinates = {
      party: {
        lat: 32.172732,
        lng: 34.9229528
      },
      parking: {
        lat: 32.172491,
        lng: 34.9216468
      }
    },
    map,
    MAPS_API_KEY = "AIzaSyDeb-THK2Z4pUkL990AKo2VeHpHK8avf3c",
    FORECAST_API_KEY = "43172a329aa16dfa17bdfed86101eb4e";

  this.rsvp = false;

  this.init = function init() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=" +
      MAPS_API_KEY +
      "&callback=App.initGoogleMaps";
    document.body.appendChild(script);

    document
      .getElementById("ifrm")
      .setAttribute("onload", "if(App.rsvp) {App.rsvpSent();}");

    $("#rsvp").on("hidden.bs.modal", function() {
      document.getElementById("ss-form").reset();
      document.getElementById("rsvp.submit").removeAttribute("disabled");
      document.getElementById("rsvp.message").classList.remove("in");
      self.rsvp = false;
    });

    self.getForecast();
  };

  this.getForecast = function getForecast() {
    elScript = document.createElement("script");
    elScript.src =
      "https://api.darksky.net/forecast/" +
      FORECAST_API_KEY +
      "/" +
      coordinates.party.lat +
      "," +
      coordinates.party.lng +
      ",2018-06-15T16:30:00+0300?units=si&exclude=minutely,hourly,flags&callback=App.renderForecast";
    elScript.type = "text/javascript";

    document.body.appendChild(elScript);
  };

  this.renderForecast = function renderForecast(response) {
    elScript &&
      elScript.parentNode &&
      elScript.parentNode.removeChild(elScript);
    if (response && response.currently) {
      var skycon = new Skycons({ color: "#93d074", resizeClear: true });
      skycon.add(
        "skycon",
        Skycons[response.currently.icon.replace(/[-]/g, "_").toUpperCase()]
      );
      skycon.play();

      var elTemperature = document.getElementById("temperature");
      elTemperature.innerHTML =
        Math.round(response.currently.apparentTemperature) + "&deg;C";
    }
  };

  this.initGoogleMaps = function initGoogleMaps() {
    google.maps.visualRefresh = true;
    map = new google.maps.Map(document.getElementById("map"), {
      center: new google.maps.LatLng(
        coordinates.party.lat,
        coordinates.party.lng
      ),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      keyboardShortcuts: false,
      scrollwheel: false
    });

    var parkingMarker = new google.maps.Marker({
      map: map,
      icon: "images/parking.png",
      draggable: false,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(
        coordinates.parking.lat,
        coordinates.parking.lng
      )
    });
    var parkingInfoWindow = new google.maps.InfoWindow({
      content:
        '<div id="content"><h4>Estacionamiento</h4><p>Les recomendamos estacionar aca.</p></div>'
    });
    google.maps.event.addListener(parkingMarker, "click", function() {
      parkingInfoWindow.open(map, parkingMarker);
      partyInfoWindow.close();
    });

    var partyMarker = new google.maps.Marker({
      map: map,
      icon: "images/cake.png",
      draggable: false,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(
        coordinates.party.lat,
        coordinates.party.lng
      )
    });
    var partyInfoWindow = new google.maps.InfoWindow({
      content:
        '<div id="content"><h4>Cumple Amanda</h4><p>Los esperamos el <strong>Sabado 15/6</strong> a las <strong>16:30</strong></p></div>'
    });
    partyInfoWindow.open(map, partyMarker);
    google.maps.event.addListener(partyMarker, "click", function() {
      partyInfoWindow.open(map, partyMarker);
      parkingInfoWindow.close();
    });
  };

  this.validateRsvp = function validateRsvp() {
    if (!document.getElementById("nombre").value.trim().length) {
      alert("¿Quien sos?");
      return false;
    }
    if (
      !document.getElementById("venis").checked &&
      !document.getElementById("novenis").checked
    ) {
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
})();

window.onload = App.init;
