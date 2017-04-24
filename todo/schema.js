
var mongoose = require('mongoose')
// connet to mongodb server
const server = 'mongodb://admin:admin@ds129600.mlab.com:29600/167240885'
console.log('connect to server: '+server)

mongoose.connect(server)
const db = mongoose.connection
var Schema = mongoose.Schema

var listSchema = new Schema({
    name: { type: String, required: true },
    items: [ {type: String} ]
})

// Set weather API Json format
var weatherSchema = new Schema({
        coord: {
          lon: Number,
          lat:  Number
        },
        weather: [{ 
            id:  String,
            main: String,
            description:   String,
            icon: String
        }],
        base: String,
          main: {
            temp: Number,
            pressure: Number,
            humidity: Number,
            temp_min: Number,
            temp_max: Number
          },
          visibility: Number,
          wind: {
            speed: Number,
            deg: Number
          },
          clouds: {
            all: Number
          },
//   Set timestamp primary key for update data in live time
          dt: {type: Number, unique: true},
          sys: {
            type: Number,
            id: Number,
            message: Number,
            country: String,
            sunrise: Number,
            sunset: Number
          },
          id: Number,
          name: String,
          cod: Number
    }, { collection: 'weather' });

// set weatherList connect to mongodb weather table
exports.weatherList = mongoose.model('weather', weatherSchema)
// add weather data to mongodb
exports.addWeather = function(json){
  db.collection('weather').insert(json)
}


exports.List = mongoose.model('list2', listSchema)
exports.addItem = function(json){
  db.collection('list2').insert(json)
}
// Create var for http
var http = require("http");
url = "http://api.openweathermap.org/data/2.5/weather?q=hongkong,hk&appid=79b054e7e83553cd000e5d530ab6e174"; 
// get is a simple wrapper for request()
// which sets the http method to GET
var request = http.get(url, function (response) {
    // data is streamed in chunks from the server
    // so we have to handle the "data" event    
    var buffer = "", 
        data,
        route;

    response.on("data", function (chunk) {
        buffer += chunk;
    }); 

    response.on("end", function (err) {
        // finished transferring data
        // dump the raw data
        console.log(buffer);
        console.log("\n");
        data = JSON.parse(buffer);
        exports.addWeather(data);
        
   })
   
})

//  set UserSchema json type
var UserSchema = new Schema({name:String, password:String});
// set User connect to mongodb users table
exports.User = mongoose.model('users',UserSchema);

//  set favoriteSchema json type
var favoriteSchema = new Schema({
    name: { type: String },
    favorite: [{type: String}],
    history: [{type: String}]
});

// set FavoriteList connect to mongodb weather table
exports.FavoriteList = mongoose.model('favorite', favoriteSchema);


