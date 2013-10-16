/* You should implement your request handler function in this file.
 * But you need to pass the function to http.createServer() in
 * basic-server.js.  So you must figure out how to export the function
 * from this file and include it in basic-server.js. Check out the
 * node module documentation at http://nodejs.org/api/modules.html. */
var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  "Content-Type": "application/json"
};
var messages = [];

var objectID = 0;

var sendResponse = exports.sendResponse =  function(response, msg, status){
  status = status || 200;
  response.writeHead(status, headers);
  response.end(msg);
};


var handleRequest = exports.handleRequest = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);
  var message;
  var caseObj = {};

  caseObj.options = function(){
    sendResponse(response, '');
  };

  caseObj.get = function(){
    sendResponse(response, JSON.stringify(messages));
  };

  caseObj.post = function(){
    var data = '';
    request.on('data', function(chunk){
      data += chunk;
    });
    request.on('end', function(){
      message = JSON.parse(data);
      objectID++;
      message.objectID = objectID;
      message.createdAt = Date();
      messages.push(message);
      sendResponse(response, "{}");
    });
  };

  var key = request.method.toLowerCase();

  caseObj[key]();
};