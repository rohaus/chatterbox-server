var http = require("http");
var requestHandler = require("./request-handler.js");
var url = require("url");

var port = 8081;
var ip = "127.0.0.1";

var router = {"/classes/room": requestHandler};
var server = http.createServer(function(request, response){
     var handler = router[url.parse(request.url).pathname];
     if (handler){
       handler.handleRequest(request, response);
     } else {
       handler.sendResponse(response, "", 404);
     }
});
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);
