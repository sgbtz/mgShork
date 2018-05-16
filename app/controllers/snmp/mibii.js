var snmp = require("net-snmp");
var common = require("../common/common");
var mib2, system, interfaces, ip;
var sysDescr, sysUpTime, sysContact, sysName, sysLocation;
var ifTable;
var ipRouteTable;


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
		session.get(oids, (error, varbinds) => {
			if (error) {
					console.error(error);
					res.json({
						success: false,
						message: "Error getting system info"
					});
			} else {
				for (var i = 0; i < varbinds.length; i++){
					if (snmp.isVarbindError(varbinds[i]))
						console.error(snmp.varbindError(varbinds[i]))
					else
						sysInfo.push(varbinds[i].value.toString());
				}

				res.json({ sysInfo: sysInfo });
			}
		});
	},
	interfaces: (req, res, session) => {
		// oid needed
		oid = ifTable;
		interfaces = {};

		// get sorted table
		interfaces = common.sortTable(oid, session);
		
		res.json(interfaces);
	},
	ip: (req, res, session) => {
		// oid needed
		oid = ipRouteTable;
		ips = [];

		// get info from agent
		session.table(oid, (error, table) => {
			if (error) {
				console.error(error.toString ());
			} else {
				res.json(table);
			}
		})
	}
}