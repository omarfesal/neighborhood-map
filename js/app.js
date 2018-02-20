var places = [
    {
        name: "karnak",
        location: {lat: 25.7188,lng: 32.6573},
        wikiName: "karnak"
    },
    {
        name: "Ramesseum",
        location: {lat: 25.7280,lng: 32.6105},
        wikiName: "Ramesseum"
    },
    {
        name: "Valley of the kings",
        location: {lat: 25.7402,lng: 32.6014},
        wikiName: "Valley_of_the_Kings"
    },
    {
        name: "Colossi of Memon",
        location: {lat: 25.7206,lng: 32.6105},
        wikiName: "Colossi_of_Memnon"
    },
    {
        name: "Valley of the Queens",
        location: {lat: 25.7286,lng: 32.5929},
        wikiName: "Valley_of_the_Queens"
    },
    {
        name: "Mortuary temple of hatshepsut",
        location: {lat: 25.7308,lng: 32.6074},
        wikiName: "Mortuary_Temple_of_Hatshepsut"
    },
    {
        name: "deir el bahri",
        location: {lat: 25.7373,lng: 32.6077},
        wikiName: "Deir_el-Bahari"
    },
    {
        name: "Tombs of the Nobles",
        location: {lat: 25.7278,lng: 32.595},
        wikiName: "Tombs_of_the_Nobles_(Luxor)"
    },
    {
        name: "Mummification Museum",
        location: {lat: 25.702222,lng: 32.639722},
        wikiName: "Mummification_Museum"
    },

];
// intilize map
var map,markers = [];


var ViewModel = function(){
    var self = this;
    
    self.placesList = ko.observableArray([]);
    

  // add places to observable array
    places.forEach(function(placeObj){
      self.placesList.push(placeObj);
    });

  // dispaly marker

  self.displayLiMarker = function(place){
    markers.push(place.marker);
    DisplayDetails(place.marker,place.wikiName);
  };



  // toggle sideBar

  self.toggleSideBar = function(){
    console.log('test');
    var sidebar = $("div.sidebar");

    if(sidebar.hasClass("close")){
      $(sidebar).removeClass("close");
      $(".sidebarContent").removeClass("removeContent");
    }else{
      $(sidebar).addClass("close");
      $(".sidebarContent").addClass("removeContent");

    }
  };      


  // fillter for places    
    
    // user Input fillter
    self.Uinput = ko.observable("");

    self.searchPlaces = function (){
       var placeName = self.Uinput().toString().toLowerCase();

       self.placesList.removeAll();

      // remove all previous markers
      for(var x = 0 ; x < markers.length ; x++){
        markers[x].setMap(null);
      }

      places.forEach(function(place){
           if(place.name.toLowerCase().indexOf(placeName) !== -1){
               self.placesList.push(place);
               displayMarkers(place);
           }
       });
    };

};



function makeMarker(place){
    var position =  place.location;
    var name = place.name;
    var wikiName = place.wikiName;

    var marker = new google.maps.Marker
    ({
      position: position,
      map: map,
      title: name,
      animation: google.maps.Animation.DROP,
      wikiName: wikiName
    });

    place.marker = marker;

    return place.marker;
}


function displayMarkers(place){
    var marker = makeMarker(place);
    markers.push(marker);
    marker.addListener('click', function(){
      DisplayDetails(this,this.wikiName);
    });
}




// map

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 25.7070,lng: 32.5900}
  });

  places.forEach(function(place){
      displayMarkers(place);
   });

  
}


function DisplayDetails(marker,wikiName){
    var infowindow = new google.maps.InfoWindow();

    $.ajax({
    url: 'https://en.wikipedia.org/w/api.php',
    data: {
        action:'parse',
        format:'json',
        prop: 'text',
        page: wikiName,
    },
    dataType:'jsonp', 
    success: function(data) {
    var dataArr = $(data.parse.text['*']).find("p").text().split("."),
        link = "... </br> <a href='http://en.wikipedia.org/wiki/"+wikiName+"' target='wikipedia'>Read more on Wikipedia</a>";
    var contentdata =  dataArr.splice(0,10) + link;

    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent(contentdata);
        infowindow.open(map, marker);
        infowindow.addListener('closeclick',function(){
        infowindow.setMarker = null;
        });

      }       
    }
  }).fail(function(){
        
        var infowindow = new google.maps.InfoWindow({
            content: "wiki fail to get data"
        }); 
    
    });
}
    
ko.applyBindings( new ViewModel() );
