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
	alarms: (res,req,session) =>{

		var interval = req.body.interval; //second over which the data is compared with the rising and falling thresholds.
		var variable = req.body.variable; //object identifier of the particular variable to be sampled.
		var sampleType = req.body.sampleType; // deltaValue or absoluteValue
		var rising = req.body.rising; //rising threshold
		var falling = req.body.falling; //falling threshold

		var eventType = req.body.eventType // none(1), log(2), snmp-trap(3), log-and-trap(4)

		var varbinds = [
		//****ALARM VARBINDS ****//
			{
		        oid: alarmTable+".1.2", // alarmInterval
		        type: snmp.ObjectType.Integer,
		        value: interval
    		}, 
    		{
		        oid: alarmTable+".1.3", // alarmVarible
		        type: snmp.ObjectType.ObjectIdentifier,
		        value: variable
		    }
		    {
		        oid: alarmTable+".1.4", // alarmSampleType
		        type: snmp.ObjectType.Integer,
		        value: sampleType
		    }
		    {
		        oid: alarmTable+".1.7", // alarmRisingThreshold
		        type: snmp.ObjectType.Integer,
		        value: rising
		    }
		    {
		        oid: alarmTable+".1.8", // alarmFallingThreshold
		        type: snmp.ObjectType.Integer,
		        value: falling
		    }
		
		//****EVENT VARBINDS ****//
			{
		        oid: eventTable+".1.3",
		        type: snmp.ObjectType.Integer,
		        value: eventType
		    }
		];


		session.set (varbinds, function (error, varbinds) {
		    if (error) {
		        console.error (error.toString ());
		    } else {
		        for (var i = 0; i < varbinds.length; i++) {
		            // for version 1 we can assume all OIDs were successful
		            console.log (varbinds[i].oid + "|" + varbinds[i].value);
		        
		            // for version 2c we must check each OID for an error condition
		            if (snmp.isVarbindError (varbinds[i]))
		                console.error (snmp.varbindError (varbinds[i]));
		            else
		                console.log (varbinds[i].oid + "|" + varbinds[i].value);
		        }
		    }
		});
				
			},
}