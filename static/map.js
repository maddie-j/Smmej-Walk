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




}


function closerToStartThanNow(currentLocation, newPosition, startPosition) {

    // dist start to current
    let xa = Math.abs(startPosition.lat() - currentLocation.lat());
    let ya = Math.abs(startPosition.lng() - currentLocation.lng());
    let distA = (xa * xa) + (ya * ya);

    // dist start to new
    let xb = Math.abs(startPosition.lat() - newPosition.lat());
    let yb = Math.abs(startPosition.lng() - newPosition.lng());
    let distB = (xb * xb) + (yb * yb);

    return distB < distA;
    //
    //
    // service = new google.maps.places.PlacesService(map);
    //
    //
    // getDistance(start_position, new_position, function(distStartNew) {
    //     getDistance(start_position, current_location, function(distStartCurrent) {
    //         if (distStartNew < distStartCurrent) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     })
    // })
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
            callback(results.filter(function(loc) {
                if (!loc.types.includes('locality')) {
                    return loc;
                }
            }).map(x => x.geometry.location));
        }

    })
}

// Distance Between two points A and B
function getDistance(A, B, callback) {
    console.log(A);
    console.log(B);
    if (B == null) {
        debugger;
    }
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


function generatePathBackup(startLocation, distance, radius) {
    let stops = []
    let numStops;


}


document.onload = function() {
    var value = document.getElementById("distanceButton");

    value.addEventListener("click", function(e) {
        e.preventDefault();
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

                generatePath(position, value.val(), 100);

            }, function() {
                handleLocationError(true, infoWindow, map.getCenter());

            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    });
}

function linkPositions() {

    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);

    directionsService.route({

        origin: startLocation,
        destination: startLocation,
        waypoints: locationList.map(x => ({
            "location": x,
            "stopover": true
        })),
        optimizeWaypoints: false,
        travelMode: 'WALKING',

    }, function(response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);


        } else {

        }
    });

}

let locationList, visitedLocations, journey, distMin, distMax, currentLocation, startLocation, radius;

function generatePath(start, distance, rad) {
    startLocation = start;
    currentLocation = startLocation;

    let marker = new google.maps.Marker({
        position: startLocation,
        map: map,

    });

    radius = rad;

    distMin = distance - (distance * 0.2);
    distMax = distance + (distance * 0.2);

    journey = 0;

    // location list outlines the locations on the final path
    // visited locations includes failed location attempts as well as successful ones
    locationList = [];
    visitedLocations = [];


    // Wandering between locations
    // while (true) {
    let dist = 0;
    let nextStopOptions = [];

    // Generate next stops
    dist += radius;
    pointsWithinMetres(dist, currentLocation, selectNextDest);

    // while (true) {}
    // }
}

selectNextDest = function(nextStopOptions) {
    nextStopOptions = nextStopOptions.filter(function(loc) {
        if (!visitedLocations.includes(loc)) {
            return loc;
        }
    });
    // Test the above:
    // console.log(nextStopOptions);
    let dist = 0;

    if (journey + dist > distMin) {
        nextStopOptions = nextStopOptions.filter(function(loc) {
            if (closerToStartThanNow(currentLocation, loc, startLocation)) {
                return loc;
            }
        });
    }

    if (nextStopOptions.length > 0) {
        // randomiser snippet from https://css-tricks.com/snippets/javascript/select-random-item-array/
        let newLocation = nextStopOptions[Math.floor(Math.random() * nextStopOptions.length)];
        //if newLocation
        getDistance(currentLocation, newLocation, function(addedDist) {

            // if (journey + addedDist > distMax) {
            //     // Remove that location and try again
            //     let index = nextStopOptions.indexOf(newLocation);
            //     if (index > -1) {
            //         array.splice(index, 1);
            //     }
            //
            // } else {
            // Add the location and move on
            journey += addedDist;
            currentLocation = newLocation;

            let marker = new google.maps.Marker({
                position: currentLocation,
                map: map,

            });

            locationList.push(currentLocation);
            visitedLocations.push(currentLocation);


            let xa = Math.abs(startLocation.lat() - currentLocation.lat());
            let ya = Math.abs(startLocation.lng() - currentLocation.lng());
            let distA = (xa * xa) + (ya * ya);

            // Generate next stops
            if (distA < 1) {
                dist += radius;
                pointsWithinMetres(dist, currentLocation, selectNextDest);
            }


            // }

        })
    } else {
        return;
        //     // Remove the current location so it goes back and tries again with the prev location
        //     locationList.splice(-1, 1);
        //     currentLocation = locationList[locationList.length - 1];
        // }

        // if past the halfway point, start heading back
        // getDistance(currentLocation, startLocation, function(result) {
        //         dist = result;
        //
        //
        //         if (nextStopOptions.length < 2) {
        //             pointsWithinMetres(dist, currentLocation, selectNextDest(nextStopOptions));
        //         }
        //     }
    }
}
