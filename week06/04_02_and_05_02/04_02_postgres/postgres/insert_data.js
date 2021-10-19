const { Client } = require('pg');
const async = require('async');  
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = process.env.AWS_USER;
db_credentials.host = process.env.AWS_HOST;
db_credentials.database = process.env.AWS_DATABASE;
db_credentials.password = process.env.AWS_PASSWORD;
db_credentials.port = process.env.POSTRGESS_PORT;



const dataFolder = 'data/'
const fileName = 'addresses-lat-lon-03.json';
// loop for all files here
// for now just load 03
let aaMeetings03 = JSON.parse( fs.readFileSync(`${dataFolder}${fileName}`, 'utf-8') );

const deleteAllRows = () => {
	// delete all rows
	const client = new Client(db_credentials);
	client.connect();
	client.query('DELETE FROM aalocations', (err, res) => {
		console.log(err, res);
		client.end();
	});
}

// deleteAllRows();

async.eachSeries(aaMeetings03, function(location, callback) {
   
    // Connect to the AWS RDS Postgres database
    const client = new Client(db_credentials);
   		  client.connect();

   		  location.address = location.address.replace(/'/g, "\\'");

    const insertAddresses = "INSERT INTO aalocations VALUES (E'" + location.address + "', " + location.latLong.lat + ", " + location.latLong.long + ");";
	
	console.log(insertAddresses)

    client.query(insertAddresses, (err, res) => {
    	if(err) {
        	console.log(err);    		
    	}
		console.log(res); 
        // console.log('Inserted ', res.rowCount, ' value');
        client.end();
    });
    
    setTimeout(callback, 1000); 
}); 
