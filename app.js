//reference: https://www.youtube.com/watch?v=k1_sUMw8kwg

var map;
var infowindow;

var request;
var service;
var markers = [];

function initialize(){
	//center is necessary to center map somewhere (in div?)
	var center = new google.maps.LatLng(45.502057,-73.571539,17); //lat and long of google coordinates
	map = new google.maps.Map(document.getElementById('map'), {
		center: center,
		zoom: 15
	}); //zoom if you put 1, you look at whole globe

	//8047m / 5mile radius around center of map for coffee shops
	request = {
		location: center,
		radius: 8047,
		types: ['shoe_store']
	};

	infowindow = new google.maps.InfoWindow();

	service = new google.maps.places.PlacesService(map);

	service.nearbySearch(request,callback);

	//added in part 4. NOT WORKING.
	//this allows map to update and recall service.nearbySearch, if user right clicks and moves pointer to another location
	google.maps.event.addListener(map, 'rightclick', function(event){
		map.setCenter(event.latLng);
		clearResults(markers);

		var request = {
			location: event.latLng,
			radius: 8047,
			types: ['cafe']
		};
		service.nearbySearch(request, callback);
	});

}

//ensures we get back good results and that no error connecting to server
//gets all the results into array, and gives them a marker
function callback(results, status){
	if(status == google.maps.places.PlacesServiceStatus.OK){
		for(var i = 0; i < results.length; i++){
			markers.push(createMarker(results[i]));
		}
	}
}

function createMarker(place){
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});

	google.maps.event.addListener(marker, 'click', function(){
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});

	return marker;
}

//Added in part 4. this isn't working for me
function clearResults(markers){
	for (var m in markers){
		markers[m].setMap(null);
	}
	markers = [];
}

//on status load, will call function "initialize", and target that to browser window
google.maps.event.addDomListener(window, 'load', initialize);