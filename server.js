var twitter = require('twitter'),
    express = require('express'),
    app     = express(),
    http    = require('http'),
    server  = http.createServer(app),
    io      = require('socket.io').listen(server);

var twit = new twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: '',
  request_options: {
       proxy: ''
   } 
}),

stream = null;
var count = 0;
var country_list = [];
var current = null;
var output = [];
server.listen(process.env.PORT || 8081);

app.use(express.static(__dirname + '/'));
app.get('/')

io.sockets.on('connection', function (socket) {

  socket.on("start tweets", function() {

    if (stream === null) {

      twit.stream('statuses/filter', {'locations':'-180,-90,180,90'}, function(stream) {
          stream.on('data', function(data) {
              if (data.coordinates){
                if (data.coordinates !== null){
                  // if (data.place.country !== null) {
                  //   country_list.push(data.place.country);
                  //    countTweetsPerCountry();
                  // }
                  var coordinatesPoint = {"lat": data.coordinates.coordinates[0],"lng": data.coordinates.coordinates[1], "text" : data.text};

                  socket.broadcast.emit("twitter-stream", coordinatesPoint);
                  socket.emit('twitter-stream', coordinatesPoint);
                }
              }
          });
      });
    }
  });

  socket.emit("connected");
});

// function countTweetsPerCountry() {
//   var cnt = {};
//   country_list.forEach(function(i) { cnt[i] = (cnt[i]||0) + 1;  });
//   for (key in cnt) {
//     console.log(key + " " + cnt);
//   }
// }




