function initMap() {

  var home = {lat:-33.8817861,lng: 151.1952391};
  var homeLL = new google.maps.LatLng(home.lat,home.lng);

  var map = new google.maps.Map(document.getElementById('map'), {
    center: homeLL,
    zoom: 17
  });

  var request = {
    location: homeLL,
    radius: '300',
    type: []
  };

  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);


}

function closerToStartThanNow(current_location, new_position, start_position){

  service = new google.maps.places.PlacesService(map);

  if(getDistance(start_position,new_position) < getDistance(start_position,current_location)){
    return true;
  }
  else{
    return false;
  }

}

// Find the points of interest within 'dist' metres of current_location
function pointsWithinMetres(dist, current_location){

  var service = new google.maps.places.PlacesService(map);

  var request = {
    location: current_location, // Needs to be LatLng type
    radius: dist,
    type: [],
  };

  service.nearbySearch(request, function(results,status){
    if (status == google.maps.places.PlacesServiceStatus.OK) {

      return results
    }

  })
}

// Distance Between two points A and B
function getDistance(A,B){
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [A,],
      destinations: [B,],
      travelMode: 'WALKING'
    }, function(response,status){
      if(status == 'OK'){
        return response.rows[0].elements[0].distance.value;
      }
    });
}
