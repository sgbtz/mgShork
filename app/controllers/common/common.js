//common function defined here
var snmp = require("net-snmp");
// function to sort ints
function sortInt(a, b) {
	if (a > b)
		return 1;
	else if (b > a)
		return -1;
	else
		return 0;
}

module.exports={
	sortTable: (oid, session) => {
		var varbinds = {};
		
		session.table(oid, (error,table) => {
			if(error){
				console.error(error.toString());
				return error;
			}else{
				var indexes = [];
				for (index in table)
					indexes.push(parseInt(index));
				indexes.sort(sortInt);
				
				// Use the sorted indexes we've calculated to walk through each
				// row in order
				for(var i=0;i< indexes.length;i++){
					var columns =[];
					for(column in table[indexes[i]])
						columns.push(parseInt(column));
					columns.sort(sortInt);

				//Save table as an object sorted by index
				varbinds[indexes[i]]=table[indexes[i]];
				for(var j=0;j<columns.length;j++)
					varbinds[indexes[i]][columns[j]]= table[indexes[i]][columns[j]];

					return varbinds;
				}
			}
		});
	}
}