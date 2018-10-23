const express = require('express');
var server = express();
server.get('/', function(request, response){
    //console.log('hi');
    response.send('hi');
});
server.get('/topic', function(request, response){
    //console.log('hi2');
    response.send('hi2');
});

server.get('/topic/:title', function(request, response){
    //console.log('hi2');
    response.send('hi3 ' + request.params.title);
});
server.listen(3000);