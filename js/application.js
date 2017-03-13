var socket = io.connect();

var Gmaps = React.createClass({
  render: function() {
    return (
      <div id="map"></div>
    );
  }
});


var HeaderDiv = React.createClass({
    render: function() {
      return (
        <div id="header">
          <h1> Live Visualization of Public Tweets (Twitter) Around the World </h1>
        </div>
      )
    }
})

var App = React.createClass({

  componentDidMount: function() {
    
    var myLatlng = new google.maps.LatLng(17.7850,-12.4183);
    var grey_style = [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}];
    var myOptions = {
      zoom: 2,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      styles: grey_style
    };

    var map = new google.maps.Map(document.getElementById("map"), myOptions);
    var tweet = document.getElementById("tweets-div");

    var heatmap;
    var liveTweets = new google.maps.MVCArray();
    
    heatmap = new google.maps.visualization.HeatmapLayer({
      data: liveTweets,
      radius: 25
    });

    heatmap.setMap(map);

    if (io !== undefined) {

      var socket = io.connect('/');

      socket.on('twitter-stream', function (data) {

        var tweetLocation = new google.maps.LatLng(data.lng,data.lat);
        
        liveTweets.push(tweetLocation);

        var image = "css/tweet.png";
        var marker = new google.maps.Marker({
          position: tweetLocation,
          map: map,
          icon: image,
          title: data.text
        });
        var infowindow = new google.maps.InfoWindow({
            content: data.text
        });

        marker.addListener('click', function() {
            infowindow.open(map, this);
        }); 
        setTimeout(function(){
          marker.setMap(null);
        },6000);

        //tweet.innerHTML = "name:" + data.name + " tweet: " + data.text;
      });

      socket.on("connected", function(r) {
        socket.emit("start tweets");
      });
    }
  },
  
  render : function() {
    return (
      <div>
        <HeaderDiv/>
        <Gmaps />
      </div> 
    )
  }
});

React.render(<App />, document.getElementById('main-container'));