// app/controllers/auth.js
// ESTO HAY QUE CAMBIARLO PORQUE ESTÁ HECHO PARA MI OTRA APLICACION
var jwt = require("jsonwebtoken");

module.exports = {
	// Route to authenticate a user
	getToken: function(req, res, app) {

		modHostel.findOne({
			email: req.body.email
		}, function(err, hostel) {

			if(err) res.send(err);

			if(!hostel){
				res.json({success: false, message: "Authentication failed. User not found."});
			} else if(hostel) {
				// Check if password matches
				if(hostel.password != req.body.password) {
					res.json({ success: false, message: "Authentication failed. Wrong password."});
				} else {
					// If all right, create a token with only our given payload
					const payload = {
						sub: hostel._id
					};
				
					var token = jwt.sign(payload, app.get("superSecret"), {
						expiresIn: "1440m" // expires in 24 hours
					});

					res.json({
						success: true,
						message: "Enjoy your token!",
						token: token
					});
				}
			}

		});
	},

	// Route middleware to verify a token
	checkToken: function(req, res, app, next) {

		// Chceck header or url parameters or post parametrers for token
		var token = req.body.token || req.query.token || req.headers["x-access-token"];

		if(token) {
			// Verifies secret and checks exp
			jwt.verify(token, app.get("superSecret"), function(err, decoded) {

				if(err) 
					return res.json({ success: false, message: "Failed to authenticate token." });
				else {
					// If everything is good, save to request for use in other routes
					req.decoded = decoded;
					next();
				}
			});

		} else {
			// If there is no token return an error
			return res.status(403).send({
				succes: false,
				message: "No token provided."
			});
		}
	}
}