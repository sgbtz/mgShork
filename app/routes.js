// app/routes.js

var router = require("express").Router();

// grab the models
/* to-do */

// grab the controllers
/* to-finish */
var auth = require("./controllers/auth/auth");
var mibii = require("./controllers/snmp/mibii");
var rmon = require("./controllers/snmp/rmon");
var smon = require("./controllers/snmp/smon");
var radius = require("./controllers/snmp/radius");


module.exports = function(app, session){

	// server routes =============================
		
		// authentication routes
		router.post("/auth", (req, res) => {
			auth.getToken(req, res, app);
		});

		router.use((req, res, next) => {
			auth.checkToken(req, res, app, next);
		});
		// every route defined from here to app.use("/api", router)
		// will be checked to know if the user is authenticated

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