const { Client } = require('pg');
const async = require('async');
const dotenv = require('dotenv');
const fs = require('fs');
const _ = require('underscore');
dotenv.config();

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = process.env.AWS_USER;
db_credentials.host = process.env.AWS_HOST;
db_credentials.database = process.env.AWS_DATABASE;
db_credentials.password = process.env.AWS_PASSWORD;
db_credentials.port = process.env.POSTRGESS_PORT;



const dataFolder = 'data/'
const fileName = 'locations-lat-long.json';

let aaMeetings = JSON.parse( fs.readFileSync(`${dataFolder}${fileName}`, 'utf-8') );

const deleteAllRows = (table) => {
	// delete all rows
	const client = new Client(db_credentials);
	client.connect();
	client.query(`DELETE FROM ${table}`, (err, res) => {
		console.log(err, res);
		client.end();
	});
}

// deleteAllRows('aalocations');

insertLocations();
// insertMeeting();


function insertMeeting() {

    const allMeetings = _.chain(aaMeetings)
        .map(d => {
            let meetings = [...d.meetings];
                _.map(meetings, m => m.id = d.id);
            return meetings;
        })
        .flatten()
        .value();

    async.eachSeries(allMeetings, function(meeting, callback) {

        // Connect to the AWS RDS Postgres database
        const client = new Client(db_credentials);
              client.connect();
        function escape(str) {
            return str ? str.replace(/'/g, "\\'") : "";
        }
        const insertMeeting = `INSERT INTO aameetings (id, day, start_hour, start_mins, start_ampm, end_hour, end_mins, end_ampm, meeting_type, special_interest) VALUES (
            E'${meeting.id}',
            E'${meeting.day}',
            E'${+meeting.start_time[0]}',
            E'${+meeting.start_time[1]}',
            E'${meeting.start_time[2]}',
            E'${+meeting.end_time[0]}',
            E'${+meeting.end_time[1]}',
            E'${meeting.end_time[2]}',
            E'${meeting.meeting_type}',
            E'${meeting.special_interest}'
        );`;

        // console.log(insertMeeting)

        client.query(insertMeeting, (err, res) => {
            if(err) {
                console.log(err);
            }

            console.log('Inserting', ' id ', meeting.id );

            // console.log(res);
            // console.log('Inserted ', res.rowCount, ' value');
            client.end();
        });

        setTimeout(callback, 1000);
    });
}



// insert locations
function insertLocations() {
    async.eachSeries(aaMeetings, function(location, callback) {

        // Connect to the AWS RDS Postgres database
        const client = new Client(db_credentials);
              client.connect();
        function escape(str) {
            return str ? str.replace(/'/g, "\\'") : "";
        }
        const insertAddress = `INSERT INTO aalocations (id, location_name, address_name, display_address, clean_address, full_address, zip_code, details, wheelchair, lat, long) VALUES (
            E'${location.id}',
            E'${escape(location.location_name)}',
            E'${escape(location.address_name)}',
            E'${escape(location.display_address)}',
            E'${escape(location.clean_address)}',
            E'${escape(location.tamuGeoAddress)}',
            E'${location.zip_code}',
            E'${escape(location.details)}',
            E'${location.wheelchair}',
            ${location.latLong.lat},
            ${location.latLong.long}
        );`;

        // console.log(insertAddress)

        client.query(insertAddress, (err, res) => {
            if(err) {
                console.log(err);
            }

            console.log('Inserting', ' id ', location.id, ' Inserting ', location.tamuGeoAddress );

            // console.log(res);
            // console.log('Inserted ', res.rowCount, ' value');
            client.end();
        });

        setTimeout(callback, 1000);
    });
}

