/**
* Module dependencies.
*/

var express = require('express')
  , app = express()

  , path = require('path')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , session = require('express-session')
  , methodOverride = require('method-override')

  , http = require('http')
  , env = process.env.NODE_ENV || 'development';

// CONFIGURATION ======================================================================

// view engine setup
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/public');

//app.use(express.favicon("public/assets/images/favicon.ico"));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use("/", express.static(path.join(__dirname, 'public')));


// ROUTES ======================================================================
app.post('/checkTrains', function(req, res){

  http.get('http://developer.mbta.com/lib/gtrtfs/Departures.csv', function(response) {
    console.log(response);
    var str = '';
    response.on('data', function(chunk) {
        str += chunk;
    });
    response.on('end', function() {
        res.send(csvToJsonList(str));
    });
  }).on('error', function(e) {
    // error sending the request here
    console.log(e);
  });
});

// LAUNCH ======================================================================

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// HELPER FUNCTIONS ======================================================================

function csvToJsonList(data){
  // Parses csv content into json object
  var result = [],
    lines = data.split('\n'),
    headers = lines[0].replace('\r', '').split(',');

  // Start at i = 1 to skip header row
  for(var i=1; i < lines.length-1; i++){
    var obj = {};
    var lineData = lines[i].replace('\r', '').split(',');

    // Can alternatively create the rows here
    // I'm mimicing a backend return (JSON Object) call instead

    headers.forEach(function(item, index){
      obj[item] = typeConversion(lineData[index]);
    });

    result.push(obj);
  }

  return result;
  }

  function typeConversion(str){

  if(str === "" || !str){
    return undefined;
  }

  if(str[0] === '"' && str[str.length-1] === '"'){
    // Strip string of spare quotes
    return str.substring(1, str.length-1);
  } 

  if(!isNaN(str)) {
    // Recognized as number
    return parseInt(str);
  }

  return str;
  }