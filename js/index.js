const express = require('express');
const app = express();

app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));

/*var http = require('http');
 //creating a return variable that will alert us if connected to the server
var JS_Script = 'testing';

var server = http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});

//makes the server listen to port 3000 of the localhost
server.listen(3000, '127.0.0.1');
console.log("now listening to port 3000");*/