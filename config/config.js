// config/config.js

// configuration parameters are exported
module.exports = {
	// IP where we can found the snmp agent
	ip: "10.10.10.2",
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