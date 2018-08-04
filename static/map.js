function initMap() {

  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);

  var home = {lat:-33.8818423,lng: 151.1946505};
  var homeLL = new google.maps.LatLng(home.lat,home.lng);

  var map = new google.maps.Map(document.getElementById('map'), {
    center: home,
    zoom: 15
  });

  var request = {
    location: homeLL,
    radius: '100',
    type: []
  };

  service = new google.maps.places.PlacesService(map);

  var randPlace = service.nearbySearch(request, callback);
/*
  var request = {
    origin: homeLL,
    destination: randPlace,
    travelMode: 'WALKING'
  };
  directionsService.route(request, function(result, status) {
    if (status == 'OK') {
      directionsDisplay.setDirections(result);
    }
  });
*/


}


function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      //createMarker(results[i]);
      console.log(results[i])
    }
    return results[0];
  }
}
