var map;
function initMap() {

  var home = {lat: -33.881904, lng: 151.195156};

  map = new google.maps.Map(document.getElementById('map'), {
    center: home,
    zoom: 18
  });

  var marker = new google.maps.Marker({
    position: home,
    map: map,
    title: "Here we are",
  })
}
