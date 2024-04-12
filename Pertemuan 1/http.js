var http = require("http");

http.createServer(function(request, response){
    //Mengirim HTTP
    response.writeHead(200, {'Content-Type' : 'text/plain'})
    
})