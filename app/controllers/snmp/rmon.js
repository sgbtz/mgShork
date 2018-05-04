var snmp = require("net-snmp");
var common = require("common");
var rmon,alarm,even;
var alarmTable, eventTable;

module.exports={
	init: (app) =>{
		//configures oids needed
		rmon = "1.3.6.1.2.1.16";
		alarm = rmon +".3";
		even = rmon + ".9";
		//alarmTable & eventTable oids
		alarmTable = alarm +".1";
		eventTable = even +".1";
	},
	alarm: (res,req,session,app) =>{
		oid = alarmTable;

		//create alarm table
		common.buildTable(oid,res,req,session,app);

	},
	event: (res,req,session,app) =>{
		oid = eventTable;
		//create event table
		common.buildTable(oid,res,req,session,app);
	}

}