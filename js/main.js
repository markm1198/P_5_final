

var map;
// Create a new blank array for all the listing markers.
var markers = [];

var locations = [
  {title: 'Brickies Tavern', location: {lat: 39.52486409999999, lng: -119.82279}},
  {title: "Bully's Sport's Bar", location: {lat: 39.5342777, lng: -119.86931500000003}},
  {title: 'The Brewers Cabinet', location: {lat: 39.5205184, lng: -119.8172874}},
  {title: 'Silver Peak', location: {lat: 39.5258074, lng: -119.81478600000003}},
  {title: 'Great Basin Brewery', location: {lat: 39.5351526, lng: -119.75408600000003}},
  {title: 'Great Basin Brewery', location: {lat: 39.476226, lng: -119.790005}}
];
function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 39.5205184, lng:-119.8172874},
    zoom: 13
  });
  // These are the real estate listings that will be shown to the user.
  // Normally we'd have these in a database instead.
  var bounds = new google.maps.LatLngBounds();
  var largeInfowindow = new google.maps.InfoWindow();

  //extract locationMarker and markerListener from marker creation event
  var locationMarker = function(x, marker){
    locations[x].marker = marker;
  }

  var markerListener = function(marker){
    marker.addListener('click', function(){
      populateInfoWindow(this, largeInfowindow)
    });
  };
  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
     var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });
    // Push the marker to our array of markers.
    markers.push(marker);

    //bind markers to each location object
    locationMarker(i, marker);

    //create an onclick event to open an infowindow at each marker
    markerListener(marker);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
  var query = marker.title,
      dt = 'jsonp',
      wikiBase = 'https://en.wikipedia.org/w/api.php',
      wikiUrl = wikiBase + "?action=opensearch&search=" + query + "&format=json&callback=wikiCallback";

  $.ajax({
    url: wikiUrl,
    dataType: dt,
    success: function(response){
      var responseData = response[2][0];
      if (infowindow.marker != marker) {
        markers.forEach((marker) => {marker.setAnimation(null)})
        //set Animation
        marker.setAnimation(google.maps.Animation.BOUNCE);
        infowindow.marker = marker;
        infowindow.setContent('<div>' + response + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
          infowindow.marker = null;
          marker.setAnimation(google.maps.Animation.NONE);
        });
      }
    },
    error: function(response){
      mainApiError();
    }
  })
  // Check to make sure the infowindow is not already opened on this marker.
}


function mainApiError(){
  alert("somthing has broken please reload the page");
}
