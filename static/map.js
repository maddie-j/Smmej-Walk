let map, infoWindow;

function initMap() {

    var testPoint = {
        lat: -33.8836309,
        lng: 151.1967069,
    }
    var testLL = new google.maps.LatLng(testPoint.lat, testPoint.lng);

    var home = {
        lat: -33.8817861,
        lng: 151.1952391
    };
    var homeLL = new google.maps.LatLng(home.lat, home.lng);

    map = new google.maps.Map(document.getElementById('map'), {
        center: homeLL,
        zoom: 17
    });

    infoWindow = new google.maps.InfoWindow;

    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('You are currently here.');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

}


function closerToStartThanNow(current_location, new_position, start_position) {

    service = new google.maps.places.PlacesService(map);


    getDistance(start_position, new_position, function(distStartNew) {
        getDistance(start_position, current_location, function(distStartCurrent) {
            if (distStartNew < distStartCurrent) {
                return true;
            } else {
                return false;
            }
        })
    })


}

// Find the points of interest within 'dist' metres of current_location
function pointsWithinMetres(dist, current_location, callback) {

    var service = new google.maps.places.PlacesService(map);

    var request = {
        location: current_location, // Needs to be LatLng type
        radius: dist,
        type: [],
    };

    service.nearbySearch(request, function(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            callback(results);
        }

    })
}

// Distance Between two points A and B
function getDistance(A, B, callback) {
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
        origins: [A, ],
        destinations: [B, ],
        travelMode: 'WALKING'
    }, function(response, status) {
        if (status == 'OK') {
            callback(response.rows[0].elements[0].distance.value);
        }
    });
}

function generatePath(startLocation, distance, radius) {
    let currentLocation = startLocation;

    let distMin = distance - (distance * 0.2);
    let distMax = distance + (distance * 0.2);

    let journey = 0;

    // location list outlines the locations on the final path
    // visited locations includes failed location attempts as well as successful ones
    let locationList = [];
    let visitedLocations = [];


    // Wandering between locations
    while (true) {
        let dist = 0;
        let nextStopOptions = [];

        // Generate next stops
        while (nextStopOptions.length < 2) {
            dist += radius;
            pointsWithinMetres(dist, currentLocation, function(nextStopOptions) {
                nextStopOptions = nextStopOptions.filter(function(loc) {
                    if (!visitedLocations.includes(loc)){
                        return loc;
                    }
                });
                // Test the above:
                // console.log(nextStopOptions);

                // if past the halfway point, start heading back
                let temp = 0;
                getDistance(currentLocation, startLocation, function(result) {
                    temp = result;
                })
                if (journey + temp > distMin) {
                    nextStopOptions = nextStopOptions.filter(function(loc) {
                        if (closerToStartThanNow(currentLocation, loc, startLocation)) {
                            return loc;
                        }
                    });
                }
            })
        }

        while (true) {
            if (nextStopOptions.length > 0) {
                // randomiser snippet from https://css-tricks.com/snippets/javascript/select-random-item-array/
                let newLocation = nextStopOptions[Math.floor(Math.random() * nextStopOptions.length)];
                getDistance(currentLocation, newLocation, function(addedDist) {

                    if (journey + addedDist > distMax) {
                        // Remove that location and try again
                        let index = nextStopOptions.indexOf(newLocation);
                        if (index > -1) {
                            array.splice(index, 1);
                        }

                    } else {
                        // Add the location and move on
                        journey += addedDist;
                        currentLocation = newLocation;

                        locationList.push(currentLocation);
                        visitedLocations.push(currentLocation);
                        break;
                    }

                })
            } else {
                // Remove the current location so it goes back and tries again with the prev location
                locationList.splice(-1, 1);
                currentLocation = locationList[locationList.length - 1];
            }

            if (currentLocation == startLocation) {
                return;
            }
        }
    }
}

document.onLoad = function() {
    var value = document.getElementById("totalDistance");
}
