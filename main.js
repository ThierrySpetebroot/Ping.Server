var express = require('express');
var bodyParser = require('body-parser')

var app = express();


// CONFIGURATION
var PORT = 8020;


// DataSet
var pings = [];

// find a ping by Id
function findPingByUUID (uuid) {
	for (var i = pings.length - 1; i >= 0; i--) {
		var ping = pings[i]
		if(ping.uuid == uuid)
			return ping;
	}
	return null;
}


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// insert the results of a ping in the dataset (if it exist append results, if not create new object in dataset)
app.post('/pings/', function(req, res){
	var _ping = JSON.parse(req.body.ping);

	var uuid = _ping.uuid;
	var results = _ping.data;
	var ping;

	console.log("POST pings: received " + uuid + " data (" + results.length + ")");

	if((ping = findPingByUUID(uuid)) === null) {
		ping = {
			'uuid': uuid,
			'data': results
		};
		pings.push(ping);
	} else {
		for (var i = results.length - 1; i >= 0; i--) {
			ping.data.push(results[i]);
		}

		console.log("pings[\"" + uuid + "\"].length = " + ping.data.length);
	}

	res.end();
	console.log("success");
});

// get all ping Ids
app.get('/pings/', function(req, res){
  
  console.log("GET pings");

  var ids = []
  for (var i = pings.length - 1; i >= 0; i--) {
  	ids.push(pings[i].uuid);
  };

  serializedIds = JSON.stringify(ids);
  res.send(serializedIds);

  console.log("success");
});

// get ping by Id
app.get('/pings/:uuid', function(req, res){
  var uuid = req.params.uuid;

  console.log("GET ping[" + uuid + "]");

  ping = findPingByUUID(uuid);

  if(ping === null) {
  	res.status(404).end();
    console.log("fail - 404 Not Found");
  } else {
  	var serializedPing = JSON.stringify(ping);
  	res.send(serializedPing);
    console.log("success");
  }
});

var server = app.listen(8020, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});
