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


// Sample SQL statement to create a table: 
const createDb = "CREATE TABLE aalocations (address varchar(100), lat double precision, long double precision);";
// Sample SQL statement to delete a table: 
const deleteDb = "DROP TABLE aalocations;"; 
const checkTable = "SELECT * FROM aalocations";

// delete the table
// client.query(deleteDb, function(err, res) {
//     console.log('error', err);
//     console.log('response', res)
//     client.end();
// });

// create the databased
client
  .query(createDb)
  .then(res => console.log('Database created'))
  .catch(e => console.error(e))


// check if db was created
client
  .query(checkTable)
  .then(res => console.log('Database exists with the following fields: \n', res.fields))
  .then(() => client.end())
  .catch(e => console.error(e))





