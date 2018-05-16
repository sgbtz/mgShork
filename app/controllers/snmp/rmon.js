var snmp = require("net-snmp");
var common = require("../common/common");
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
	getalarms: (req, res, session) => {
		session.table(alarmTable, (error, table) => {
			if(error){
				console.log(error);
			}else
				console.log(table);
		})
	},
	events:(req,res,session) =>{
		
		var eventDescr = "An example event";
		var eventType = 4; // none(1), log(2), snmp-trap(3), log-and-trap(4)
		var eventCom = "public"; //Event community
		var eventOwner = "Fab"
		var eventStatus = 1;

		var varbinds=[
		//****EVENT VARBINDS ****//
			{
		        oid: eventTable+".1.2.15", //eventDescription
		        type: snmp.ObjectType.OctetString,
		        value: eventDescr
		    },
			{
		        oid: eventTable+".1.3.15", //eventType
		        type: snmp.ObjectType.Integer,
		        value: eventType
		    },
		    {
		        oid: eventTable+".1.4.15", //eventCommunity
		        type: snmp.ObjectType.OctetString,
		        value: eventCom
		    },
		    {
		        oid: eventTable+".1.6.15", //eventOwner
		        type: snmp.ObjectType.OctetString,
		        value: eventOwner
		    },
		    {
		        oid: eventTable+".1.7.15", //eventStatus
		        type: snmp.ObjectType.Integer,
		        value: eventStatus
		    }];

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
	alarms: (res,req,session) =>{

		/*var interval = req.body.interval; //second over which the data is compared with the rising and falling thresholds.
		var variable = req.body.variable; //object identifier of the particular variable to be sampled.
		var sampleType = req.body.sampleType; // deltaValue or absoluteValue
		var rising = req.body.rising; //rising threshold
		var falling = req.body.falling; //falling threshold

		var eventType = req.body.eventType // none(1), log(2), snmp-trap(3), log-and-trap(4)
		*/
		var interval = 1; //second over which the data is compared with the rising and falling thresholds.
		var variable = rmon + ".1.1.1.4.1" ; //object identifier of the particular variable to be sampled.
		var sampleType = 2; // deltaValue or absoluteValue
		var startup = 1; //risingAlarm(1), fallingAlarm(2), risingOrFallingAlarm(3)
		var rising = 50; //rising threshold
		var eventIndex = 15;//rising event index
		var owner = "fab"; //eventOwner
		var status = 1;


		var varbinds = [
		//****ALARM VARBINDS ****//
			{
		        oid: alarmTable+".1.2.3", // alarmInterval
		        type: snmp.ObjectType.Integer,
		        value: interval
    		}, 
    		{
		        oid: alarmTable+".1.3.3", // alarmVarible
		        type: snmp.ObjectType.OID,
		        value: variable
		    },
		    {
		        oid: alarmTable+".1.4.3", // alarmSampleType
		        type: snmp.ObjectType.Integer,
		        value: sampleType
		    },
		    {
		        oid: alarmTable+".1.7.3", // alarmRisingThreshold
		        type: snmp.ObjectType.Integer,
		        value: rising
		    },
		    {
		        oid: alarmTable+".1.9.3", //eventIndex
		        type: snmp.ObjectType.Integer,
		        value: eventIndex
		    },
		    {
		        oid: alarmTable+".1.11.3", //eventOwner
		        type: snmp.ObjectType.OctetString,
		        value: owner
		    },
		    {
		        oid: alarmTable+".1.12.3", //status
		        type: snmp.ObjectType.Integer,
		        value: status
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