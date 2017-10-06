//construct locations
function Location(title, location, count){
  var self = this;
  self.count = count;
  self.title = title;
  self.location = location;
// give the ko library a true / false value to base visibilty on
  self.visibility = ko.observable(true);
}

function MapViewModel(){
  var self = this;

  self.searchBar = ko.observable('');

  self.searchResults = ko.computed(function(){
    var results = "";
    results += self.searchBar().toUpperCase();
    return results;
  },(self));

  //make an observable array for locations
  self.locations = ko.observableArray();

  var counter = 0;
  locations.forEach((location) => {
    self.locations.push(new Location(location.title, location.location, counter))
    counter++;
  })

  //http://www.knockmeout.net/2011/04/utility-function-in-knockoutjs.html
  self.filteredList = ko.computed(function(){
    var lint = self.searchResults().toUpperCase();
    if(lint === ""){
      self.locations().forEach((location) => {
        location.visibility(true);
        markers.forEach((marker) => {marker.setVisible(true);});
      })
      return self.locations();
    } else {
      return ko.utils.arrayFilter(self.locations(), (location) =>{
        var string = location.title.toUpperCase();
        var result = (string.search(lint) >= 0);
        location.visibility(result);
        markers[location.count].setVisible(result);
        return result;
      })
    }
  })

  self.clickEvent = function(){
    largeInfowindow = new google.maps.InfoWindow();
    for(let i = 0; i < markers.length; i++){
      if(this.title == markers[i].title){
        populateInfoWindow(markers[i], largeInfowindow);
      }
    }
  };

}
var MapVM = new MapViewModel();
ko.applyBindings(MapVM);
