## Choose points to connect to
def route(start_location, points) :
    location = start_location

    while True :
        next_stop = points.within_meters_of(500, location)
        location = random.choice(next_stop)

        if location = start_location :
            break


## Choose points to form a journey around distance in length
def route2(start_location, distance, dist_inc) :
    location = start_location

    dist_min = distance - (distance * 0.2)
    dist_max = distance + (distance * 0.2)

    journey = 0

    while True :
        dist = 0
        next_stop_options = []

        while len(next_stop_options) < 2 :
            dist += dist_inc
            next_stop_options = points_within_meters_of(dist, location)            

        new_location = random.choice(next_stop_options)
        journey += location.distance_to(new_location)

        location = new_location

        if journey + location.distance_to(start_location) > dist_min :
            break


## Choose points to form a journey at least (distance - 20%) which returns to the start
def route3(start_location, distance, dist_inc) :
    current_location = start_location

    dist_min = distance - (distance * 0.2)
    dist_max = distance + (distance * 0.2)

    journey = 0

    # Wandering between locations
    while True :
        dist = 0
        next_stop_options = []

        # Generate next stops
        while len(next_stop_options) < 2 :
            dist += dist_inc
            next_stop_options = points_within_meters_of(dist, current_location)

            # If past halfway point, make sure points are on the way home
            if journey + current_location.distance_to(start_location) > dist_min :
                next_stop_options = [loc for loc in next_stop_options if loc.closer_to_start_than_now(start_location, current_location)]

        while len(next_stop_options) > 0:
            new_location = random.choice(next_stop_options)
            added_dist = current_location.distance_to(new_location)

            journey += added_dist
            current_location = new_location
            break

        if current_location == start_location :
            return

## Choose points to form a journey about distance (+- 20%) which returns to the start without revisiting any points
def route4(start_location, distance, dist_inc) :
    current_location = start_location

    dist_min = distance - (distance * 0.2)
    dist_max = distance + (distance * 0.2)

    journey = 0

    # location list outlines the locations on the final path
    # visited locations includes failed location attempts as well as successful ones
    location_list = [start_location]
    visited_locations = []

    # Wandering between locations
    while True :
        dist = 0
        next_stop_options = []

        # Generate next stops
        while len(next_stop_options) < 2 :
            dist += dist_inc
            next_stop_options = [loc for loc in points_within_meters_of(dist, current_location) if loc not in visited_locations]

            # If past halfway point, make sure points are on the way home
            if journey + current_location.distance_to(start_location) > dist_min :
                next_stop_options = [loc for loc in next_stop_options if loc.closer_to_start_than_now(start_location, current_location)]

        while True:
            if len(next_stop_options) > 0:
                new_location = random.choice(next_stop_options)
                added_dist = current_location.distance_to(new_location)

                if journey + added_dist > dist_max :
                    next_stop_options.remove(new_location)

                else :
                    journey += added_dist
                    current_location = new_location

                    location_list.append(current_location)
                    visited_locations.append(current_location)
                    break
            else :
                location_list.pop()
                current_location = location_list[-1]

        if current_location == start_location :
            return