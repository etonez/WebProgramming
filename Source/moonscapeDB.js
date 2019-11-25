// creates connection to the database
var mysql = require('mysql');

var con = mysql.createConnection({
	host: "localhost",
	user: "al113",
	password: "miAL@95DA",
});

con.connect(function(err) {
	if (err) throw err;
	console.log("Connected");

	//creates the database
	con.query("CREATE DATABASE moonscape", function (err, result){
	if (err) throw err;
	console.log("Db created");
	});

	//creates tables for the database
	var sql = "CREATE TABLE players (player_id VARCHAR(20) PRIMARY KEY, password VARCHAR(30), class VARCHAR(6)"
	var sql = "CREATE TABLE saved_games (player_id VARCHAR(20) PRIMARY KEY, xp INT, location_x INT, location_y INT, weapon_level INT, CONSTRAINT CHK_saved_games CHECK (xp<=100 AND location_x<600 AND location_y<=100 AND weapon_level<=4 AND))";



	console.log("Table created!")

	//query the database
	con.query(sql, function(err, result){
		if (err) throw err;
		console.log("Result: " + result)
	});
});

