var App = new function() {
  var self = this,
      coordinates = {
        lat: 32.182387,
        lng: 34.921941
      }
      MAPS_API_KEY = "AIzaSyDeb-THK2Z4pUkL990AKo2VeHpHK8avf3c";

  this.init = function init() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://maps.googleapis.com/maps/api/js?key="+MAPS_API_KEY+"&sensor=true&callback=App.initMap";
    document.body.appendChild(script);
  };

  this.initMap = function initMap() {
    google.maps.visualRefresh = true;
    var mapOptions = {
      center: new google.maps.LatLng(coordinates.lat, coordinates.lng),
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      keyboardShortcuts: false,
      mapTypeControl: false,
      overviewMapControl: false,
      rotateControl: false,
      scaleControl: false,
      scrollwheel: false,
      streetViewControl: false,
    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    marker = new google.maps.Marker({
      map:map,
      draggable:false,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(coordinates.lat, coordinates.lng)
    });
  };

  
};
window.onload = App.init;