const { Client } = require('pg');  
const dotenv = require('dotenv');
dotenv.config();  

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = process.env.AWS_USER;
db_credentials.host = process.env.AWS_HOST;
db_credentials.database = process.env.AWS_DATABASE;
db_credentials.password = process.env.AWS_PASSWORD;
db_credentials.port = process.env.POSTRGESS_PORT;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statement to query the entire contents of a table: 
var selectAllLocations = "SELECT * FROM aalocations;";


// check if db was created
client
  .query(selectAllLocations)
  .then(res => console.log('Database contains: \n', res.rowCount, ' locations'))
  .then(() => client.end())
  .catch(e => console.error(e));

