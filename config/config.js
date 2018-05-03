// config/config.js

// configuration parameters are exported
module.exports = {
	// IP where we can found the snmp agent
	ip: "127.0.0.1",
	// SNMP community name used as password
	community: "public",
	// Database configuration
	db: {
		url: "mongodb://localhost:27017/mgshork",
		user: "",
		pass: ""
	},
	// Token authentication configuration
	token: {
		secret: "simpatico"
	}
}