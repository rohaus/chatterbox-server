/* You should implement your request handler function in this file.
 * But you need to pass the function to http.createServer() in
 * basic-server.js.  So you must figure out how to export the function
 * from this file and include it in basic-server.js. Check out the
 * node module documentation at http://nodejs.org/api/modules.html. */

var querystring = require("querystring");
var messages = [];
// var messages = require('./message-data.js');
var handleRequest = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);
  var message, statusCode = 200;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "text/plain";
  if (request.method === "OPTIONS") {
    console.log('options');
    message = "options";
  } else if (request.method === "GET" && request.url.split("?")[0] === "/1/classes/chatterbox") {
    var query = request.url.split("?")[1];
    var queries = query.split('&');
    var queryHash = {};
    for (var i=0; i<queries.length; i++){
      var temp = queries[i].split('=');
      queryHash[temp[0]] = temp[1];
    }
    var tempMessages = messages.slice(parseInt(queryHash["limit"], 10) * -1);
    message = JSON.stringify({results: tempMessages});
  } else if (request.method === "POST" && request.url === "/1/classes/chatterbox"){
    request.on('data', function(data){
      message = querystring.parse(querystring.escape(data));
      message = JSON.parse(Object.keys(message)[0]);
      var defaults = {
        "createdAt": Date(),
        "objectID": "abc",
        "roomname": message.roomname,
        "text": message.text,
        "updatedAt": Date(),
        "username": message.username
      };
      messages.push(JSON.stringify(defaults));
      console.log("message is: ", defaults);
    });
  }
  response.writeHead(statusCode, headers);
  response.end(message);
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

module.exports.handleRequest = handleRequest;