/*Create the variables that require all of the necessary modules to be installed.
Express will be used to send information to the clients*/
var express = require ('express');
//Create a new instance of express called app and connect it to the http module.
var app = express();
var server = require('http').Server(app);
//require the socket.io module and make it listen to the connections of the server
var io = require('socket.io').listen(server);

/*The following code allows the client access to static files such as the css, 
javascript and any other assets needed*/
app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});
/* Tell the server which port to listen to and which page will serve as the 
root page for the client */
server.listen(8081,function(){
    console.log('Listening on '+server.address().port);
});
