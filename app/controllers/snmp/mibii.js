var snmp = require("net-snmp");
var mib2, system, interfaces, ip;
var sysDescr, sysUpTime, sysContact, sysName, sysLocation;
var ifTable;
var ipRouteTable;

// function to sort ints
function sortInt (a, b) {
	if (a > b)
		return 1;
	else if (b > a)
		return -1;
	else
		return 0;
}

module.exports = {
	init: (app) => {
		// configures oids needed
		mib2 = app.get("mib-2");
		system = mib2 + ".1";
		interfaces = mib2 + ".2";
		ip = mib2 + ".4";

		// system group oids
		sysDescr = system + ".1.0";
		sysUpTime = system + ".3.0";
		sysContact = system + ".4.0";
		sysName = system + ".5.0";
		sysLocation = system + ".6.0";
		// interfaces group oids
		ifTable = interfaces + ".2";
		// ip group oids
		ipRouteTable = ip + ".21";

	},
	system: (req, res, session, app) => {
		// oids needed
		oids = [sysDescr, sysUpTime, sysContact, sysName, sysLocation];
		sysInfo = [];

		// get info from agent
		session.get (oids, (error, varbinds) => {
			if (error) {
					console.error(error);
					res.json({
						success: false,
						message: "Error getting system info"
					});
			} else {
				for (var i = 0; i < varbinds.length; i++){
					if (snmp.isVarbindError (varbinds[i]))
						console.error(snmp.varbindError (varbinds[i]))
					else
						sysInfo[i] = varbinds[i].value.toString();
				}

				res.json({ sysInfo: sysInfo });
			}
		});
	},
	interfaces: (req, res, session) => {
		// oid needed
		oid = ifTable;
		
		// get info from agent
		session.table(oid, (error, table) => {
			if (error) {
				console.error (error.toString ());
			} else {
				// This code is purely used to print rows out in index order,
				// ifIndex's are integers so we'll sort them numerically using
				// the sortInt() function above
				var indexes = [];
				for (index in table)
						indexes.push (parseInt (index));
				indexes.sort (sortInt);
				
				// Use the sorted indexes we've calculated to walk through each
				// row in order
				for (var i = 0; i < indexes.length; i++) {
					// Like indexes we sort by column, so use the same trick here,
					// some rows may not have the same columns as other rows, so
					// we calculate this per row
					var columns = [];
					for (column in table[indexes[i]])
							columns.push (parseInt (column));
					columns.sort (sortInt);
					
					// Print index, then each column indented under the index
					console.log ("row for index = " + indexes[i]);
					for (var j = 0; j < columns.length; j++) {
							console.log ("   column " + columns[j] + " = "
											+ table[indexes[i]][columns[j]]);
					}
				}
			}
		})

	},
	ip: (req, res, session) => {

	}
}