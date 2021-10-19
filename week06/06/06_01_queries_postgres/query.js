const { Client } = require('pg');
const cTable = require('console.table');
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

// select all entries, limit to 5 (remove LIMIT 5 for all entries)
const queryAll = "SELECT * FROM aalocations LIMIT 5;";
// select all addresses equal to '10 Union Square East'
const queryExactMatch = "SELECT * FROM aalocations WHERE address = '10 Union Square East';";
// select all addresses which contain 'Avenue'
const queryContains = "SELECT * FROM aalocations WHERE address LIKE '%Avenue%';"

// change the query (queryAll, queryExactMatch, queryContains)
client.query(queryContains, (err, res) => {
    if (err) {throw err}
    else {
        console.log(`Table contains ${res.rowCount} rows`);
        console.table(res.rows);
        client.end();
    }
});






