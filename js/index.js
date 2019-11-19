//tells the server to allow for the express library to be used
const express = require('express');
//assigns the constant "app" the entire express library's methods
const app = express();

//tells the server to listen to localhost at port 3000, then prints a message in the console
app.listen(3000, () => console.log('Moonscape is now running at localhost:3000!'));
//allows the server access to the "public" subfolder
app.use(express.static('public'));

