var places = [
    {
        name: "karnak",
        location: {lat: 25.7188,lng: 32.6573},
        wikiName: "karnak"
    },
    {
        name: "luxor temple",
        location: {lat: 25.6995,lng: 32.6391},
        wikiName: "luxor_temple"
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
];



var ViewModel = function(){
    var self = this;
    
    self.placesList = ko.observableArray([]);
    

  // add places to observable array
    places.forEach(function(placeObj){
    	self.placesList.push(placeObj);
    });


  // fillter for places    
    
    // user Input fillter
    self.Uinput = ko.observable("");

    self.searchPlaces = function (){
       var placeName = self.Uinput().toString().toLowerCase();

       self.placesList.removeAll();
       places.forEach(function(place){
           if(place.name.toLowerCase().indexOf(placeName) !== -1){
               self.placesList.push(place);
           }
       });
    }
    
}





// map

function initMap() {
  var markers = [],largeInfowindow = new google.maps.InfoWindow();

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 25.7070,lng: 32.5900}
  });
  


  for(var x= 0 ; x < places.length ; x++){

      var position =  places[x].location;
      var name = places[x].name;
      var wikiName = places[x].wikiName;
    
      var marker = new google.maps.Marker({
        position: position,
        map: map,
        title: name,
        animation: google.maps.Animation.DROP,
        id: x,
        wikiName: wikiName
      });

    
      markers.push(marker);

      marker.addListener('click', function() {
        DisplayDetails(this,largeInfowindow,this.wikiName);
      });
      
}    

}






function DisplayDetails(marker,infowindow,wikiName){
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
        link = "<a href='http://en.wikipedia.org/wiki/"+wikiName+"' target='wikipedia'>Read more on Wikipedia</a>";
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






//    
//function getAreaMetaInfo_Wikipedia(wikiName) {
//  $.ajax({
//    url: 'https://en.wikipedia.org/w/api.php',
//    data: {
//        action:'parse',
//        format:'json',
//        prop: 'text',
//        page: wikiName,
//    },
//    dataType:'jsonp', 
//    success: function(data) {
//    $(".loader").css("display","none");
//    $(popup).append($(data.parse.text['*']).find("p:first"));
//    $(popup).append("<a href='http://en.wikipedia.org/wiki/"+wikiName+"' target='wikipedia'>Read more on Wikipedia</a>");
//    }
//      
//  });
//}
//    
// getAreaMetaInfo_Wikipedia("karnak");
//    
//    
    
    
