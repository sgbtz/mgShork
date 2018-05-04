// server.js


// modules ======================================

var express		     = require("express");
var app			   		 = express();
var snmp					 = require("net-snmp");
var bodyParser 	   = require("body-parser");
var methodOverride = require("method-override");
var morgan		     = require("morgan");

// configuration ================================

// config files
var config = require("./config/config");

// connect to MongoDB database
// mongoose.connect(config.db.url);

// set secret variable
app.set("token-secret", config.token.secret);

// start connection with snmp agent
var session = snmp.createSession (config.ip, config.community);
// create global variables to access oids
app.set("mib-2", "1.3.6.1.2.1");
app.set("rmon", "1.3.6.1.2.1.16");

// set our port
var port = process.env.PORT || 8080;

// get all data of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// parse application/x-www-formurlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride("X-HTTP-Method-Override"));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + "/public"));

// use morgan to log requests to the console
app.use(morgan("dev"));

// routes =======================================

require("./app/routes")(app, session); /* configure our routes injecting app and session variables to define
																			 **	http and snmp requests */

// start app ====================================
// startup our app at http://localhost:8080

app.listen(port);

// shoutout to the user
console.log("Magic happens on port " + port);

// expose app
exports = module.exports = app;
