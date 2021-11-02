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
const createLocationsTable = `CREATE TABLE aalocations (
  id varchar(20),
  location_name varchar(100),
  address_name varchar(100),
  display_address varchar(200),
  clean_address varchar(50),
  full_address varchar(100),
  zip_code varchar(20),
  details varchar(250),
  wheelchair boolean,
  lat double precision,
  long double precision
);`;

const createMeetingsTable = `CREATE TABLE aameetings (
  id varchar(10),
  day varchar(10),
  start_hour smallint,
  start_mins smallint,
  start_ampm varchar(2),
  end_hour smallint,
  end_mins smallint,
  end_ampm varchar(2),
  meeting_type varchar(50),
  special_interest varchar(50)
);`;

// Sample SQL statement to delete a table:
const deleteDb = "DROP TABLE aameetings;";
const checkLocationsTable = "SELECT * FROM aalocations";
const checkMeetingsTable = "SELECT * FROM aameetings";


// delete the table
// client.query(deleteDb, function(error, response) {
//   if(error) {
//     console.log('error', error);
//   }
//     console.log('response', response)
//     client.end();
// });

// create the locations table
client
  .query(createLocationsTable)
  .then(res => console.log('Locations Table Created'))
  .catch(e => console.error(e));

// check if db was created
client
  .query(checkLocationsTable)
  .then(res => console.log('Database locations exists with the following fields: \n', res.fields))
  .then(() => client.end())
  .catch(e => console.error(e));


// create the meetings table
client
  .query(createMeetingsTable)
  .then(res => console.log('Locations Table Created'))
  .catch(e => console.error(e));

// // check if db was created
client
  .query(checkMeetingsTable)
  .then(res => console.log('Database meetings exists with the following fields: \n', res.fields))
  .then(() => client.end())
  .catch(e => console.error(e));






