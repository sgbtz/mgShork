var snmp = require("net-snmp");
var common = require("common");
var rmon,alarm,even;
var alarmTable, eventTable;

module.exports={
	init: (app) =>{
		//configures oids needed
		rmon = app.get("rmon");
		alarm = rmon +".3";
		even = rmon + ".9";
		//alarmTable & eventTable oids
		alarmTable = alarm +".1";
		eventTable = even +".1";
	},
	alarm: (res,req,session,app) =>{
		oid = alarmTable;

		//create alarm

	},
	event: (res,req,session,app) =>{
		oid = eventTable;

		//create event

	}

}