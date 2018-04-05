// app/routes.js

var router = require("express").Router();

// grab the models


// grab the controllers

module.exports = function(app){

	// server routes =============================


	// handle api calls
		/* GET api listing. */

		/**************** CRUD FUNCTIONS ******************/
		
		/**************************************************/

	app.use("/api", router);

	// frontend routes =============================

	// route to handle all angular requests
	app.get("/", function(req, res, err){
		res.sendFile("./public/index.html"); // load our public/index.html file
	});

	app.use(function(req, res){
    res.sendStatus(404);
  });
	
}