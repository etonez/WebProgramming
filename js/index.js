//tells the server to allow for the express library to be used
const express = require('express');
//assigns the constant "app" the entire express library's functionality
const app = express();
//assigns the constant "serv" the entire socket.io library's functionality
const serv = require('http').Server(app);
//tells the server to allow for the socket.io library to be used
const io = require('socket.io')(serv,{});
//whenever a connection is detected to the server, print a message in the console
io.sockets.on('connection', function(socket){
    console.log('socket connection');

    //the below function tells the server to get the username and password from the index.html file
    socket.on('user',function(data){
        console.log('username: ' + data.username + ' password: ' + data.password);
    });
});

//tells the server to listen to localhost at port 3000, then prints a message in the console
serv.listen(3000, () => console.log('Moonscape is now running at localhost:3000!'));



//allows the server access to the "public" subfolder
app.use(express.static('public'));

//tells the server that if no specific directory is specified, open index.html
app.get('/', function(req, res){
    res.sendFile('/public/index.html');
});
