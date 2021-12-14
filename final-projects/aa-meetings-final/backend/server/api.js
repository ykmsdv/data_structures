// general modules
const express = require("express");
const _ = require("underscore");
const cors = require('cors');
const mcache = require('memory-cache');

const cache = (duration) => {
	//https://medium.com/the-node-js-collection/simple-server-side-cache-for-express-js-with-node-js-45ff296ca0f0
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      res.send(cachedBody)
      console.log('API sends cached version');
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body)
        console.log('API makes request');
      }
      next()
    }
  }
}
// general setup
const port = 8084;
const app = express();

const corsOptions = {
  origin: 'http://localhost:8081',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

app.get('/', (req, res) => {
	console.log(req.query);
	res.send({str: "API is running!"});
});


//###################################################
// Postgres Setup
//###################################################
const dotenv = require('dotenv');
	  dotenv.config({path: "server/.env"});
const { Client } = require('pg');

// AWS RDS POSTGRESQL INSTANCE
let db_credentials = new Object();
	db_credentials.user = process.env.AWS_USER;
	db_credentials.host = process.env.AWS_HOST;
	db_credentials.database = process.env.AWS_DATABASE;
	db_credentials.password = process.env.AWS_PASSWORD;
	db_credentials.port = process.env.POSTRGESS_PORT;


	//###################################################
	// Get all filters
	//###################################################

	let sortMeetings = (data) => {
	  	data.map(location => {
	  		// sort the meeting days
	  		if(location.meetings.length === 1) {
	  			// nothing to sort
	  			location.meetings = location.meetings;
	  		} else {
	  			location.meetings = sortDaysOfWeek(location.meetings, true);
	  		}
	  	});

	  	return data;
	}

	let formatTimes = (data) => {
	  	function moveToBeginningOfArr(arr, fromIndex) {
	  		return [].concat(arr.splice(fromIndex, 1), arr);
			}

		// sort the time by hour and am_pm
	  	let times = _.chain(data)
		  	.sortBy('start_hour')
		  	.sortBy('start_ampm')
		  	.value();
			// 12 am and 12 pm are exceptions: split the array
			let am = _.filter(times, t => t['start_ampm'] == 'AM');
			let pm = _.filter(times, t => t['start_ampm'] == 'PM');
			// put them at the right array position
				am = moveToBeginningOfArr(am, am.length-1);
				pm = moveToBeginningOfArr(pm, pm.length-1);
			// put the arr of obj back together
				times = [].concat(am, pm);
			// turn it into an array
			let timesWithMins = [];

				times.map(t => {

					timesWithMins.push( `${t['start_hour']}:00 ${t['start_ampm']}` );

					return`${t['start_hour']} ${t['start_ampm']}`;

			  	});

				return timesWithMins;
	};

	let sortDaysOfWeek = (arr, isObject) => {
		const sorter = {
			"Mondays": 1,
			"Tuesdays": 2,
			"Wednesdays": 3,
			"Thursdays": 4,
			"Fridays": 5,
			"Saturdays": 6,
			"Sundays": 7
		};

		if(!isObject) {
			return arr.sort((a,b) => {
				return sorter[a] - sorter[b];
			});			
		} else {
			return arr.sort((a,b) => {
				return sorter[a.day] - sorter[b.day];
			});				
		}


	}

	app.get('/filters', cache(60 * 60 * 24), (req, res) => {

		const client = new Client(db_credentials);
			  client.connect();


		const filters = `SELECT
							DISTINCT start_hour, start_ampm
						FROM aameetings
						;
						SELECT
							array_agg(DISTINCT meeting_type) AS meetings,
							array_agg(DISTINCT special_interest) AS special,
							array_agg(DISTINCT day) AS days
						FROM aameetings
						;
						SELECT array_agg(DISTINCT wheelchair) AS isaccessible FROM aalocations;
						`;

		client
		  .query(filters)
		  .then(response => {
		  	let times = response[0].rows,
		  		filters = response[1].rows[0],
		  		accessibility = response[2].rows[0];

		  	filters['times'] = formatTimes(times);
		  	filters['isaccessible'] = accessibility['isaccessible'];
		  	filters['days'] = sortDaysOfWeek(filters['days'], false);
		  	filters['special'] = filters['special'].filter(f => f != 'false');
		  	filters['meetings'] = filters['meetings'].filter(m => m != 'false');


		  	res.send(filters);
		  })
		  .then(() => {
		  	console.log('End connection to DB');
		  	client.end();
		  })
		  .catch(e => {console.error(e); client.end();});
	});

	//###################################################
	// Get unique locations
	//###################################################


	app.get('/alllocations', cache(60 * 60 * 24), (req, res) => {

		const client = new Client(db_credentials);
			  client.connect();

		const query = `
			SELECT array_agg(DISTINCT l.id) AS ids,
				MAX(DISTINCT l.lat) AS lat,
				MAX(DISTINCT l.long) AS long,
				bool_and(DISTINCT l.wheelchair) as accessible,
				(SELECT DISTINCT l.full_address) AS address,
				json_agg(m.*) AS meetings
			FROM aalocations l
				JOIN aameetings m ON l.id = m.id
			GROUP BY address
		;
						`;
		client
		  .query(query)
		  .then(response => {

				response.rows = sortMeetings(response.rows);

		  	res.send(response.rows);

		  })
		  .then(() => {
		  	console.log('End connection to DB');
		  	client.end();
		  })
		  .catch(e => {console.error(e); client.end();});
	});


	//###################################################
	// Get filtered meetings
	//###################################################


	app.get('/filteredlocations', cache(60 * 60 * 24),  (req, res) => {

		const client = new Client(db_credentials);
			  client.connect();


		console.log(req.query);

		const filterCriteria = () => {
			let where = "",
				  params = req.query;

			let evalParam = (p) => {
				if(params.hasOwnProperty(p) && params[p]) {
					return true;
				}
			}


			if(evalParam('day')) {
				if(where) where += ' AND ';

				 where += ` day = '${params.day}' `
			}

			if(evalParam('start_time_1') && evalParam('start_time_2')) {
				let start = params.start_time_1.split(' '),
					hour_1 = start[0].split(':')[0],
					ampm_1 = start[1];

				let end = params.start_time_2.split(' '),
					hour_2 = end[0].split(':')[0],
					ampm_2 = end[1];

				if(where) where += ' AND ';
					where += `(start_hour >= '${ hour_1 }' AND start_ampm = '${ampm_1}')
						  OR
						  (start_hour <= '${ hour_2 }' AND start_ampm = '${ampm_2}') `								
			}
			if(evalParam('special_interest')) {
				if(where) where += ' AND ';
				where += ` special_interest = '${params.special_interest}' `
			}
			if(evalParam('meeting_type')) {
				if(where) where += ' AND ';
				where += ` meeting_type = '${params.meeting_type}' `
			}
			if(evalParam('accessible')) {
				if(where) where += ' AND ';
				where += ` wheelchair = '${params.accessible}' `
			}
			return where;
		}

			const query = `
				SELECT array_agg(DISTINCT l.id) AS ids,
					MAX(DISTINCT l.lat) AS lat,
					MAX(DISTINCT l.long) AS long,
					bool_and(DISTINCT l.wheelchair) as accessible,
					(SELECT DISTINCT l.full_address) AS address,
					json_agg(m.*) AS meetings
				FROM aalocations l
					JOIN aameetings m ON l.id = m.id
				WHERE ${filterCriteria()}
				GROUP BY address
				;
			`;

		client
		  .query(query)
		  .then(response => {

				response.rows = sortMeetings(response.rows);

		  	res.send(response.rows);

		  })
		  .then(() => {
		  	console.log('End connection to DB');
		  	client.end();
		  })
		  .catch(e => {console.error(e); client.end();});
	});



	//###################################################
	// Get all meeetings for location with location details
	//###################################################

	app.get('/emergency', (req, res) => {

		const client = new Client(db_credentials);
			  client.connect();

		const date = new Date().toLocaleTimeString([], {weekday: 'long', hour: '2-digit', minute:'2-digit'});
			  day = new Date().getDay(),
			  hour = +date.split(' ')[1].split(':')[0],
			  mins = +date.split(' ')[1].split(' ')[0].split(':')[1],
			  ampm = date.split(' ')[2];

		const weekday = new Array(7);
				weekday[0] = "Sunday";
				weekday[1] = "Monday";
				weekday[2] = "Tuesday";
				weekday[3] = "Wednesday";
				weekday[4] = "Thursday";
				weekday[5] = "Friday";
				weekday[6] = "Saturday";

		let where = "";

		if(ampm = 'PM') {
			if(hour != 12) {
				// remove 12PM as it is an outlier and greater than any other hour
				where += `day = '${weekday[day]}s' AND start_hour >= '${hour}' AND start_hour!='12' AND start_ampm = '${ampm}'`;
			} else {
				// it is 12PM so show all hours that are PM
				where += `day = '${weekday[day]}s' AND start_ampm = '${ampm}'`;
			}
		} else {
			// it is AM
				where += `day = '${weekday[day]}s' AND start_hour >= '${hour}' AND start_hour!='12' AND start_ampm = '${ampm}'`;
		}



		const query = `
			SELECT MAX(l.id) AS ids,
				MAX(l.full_address) AS address,
				bool_and(l.wheelchair) AS accessible,
				(SELECT DISTINCT l.display_address) AS display_address,
			json_agg(m.*) AS meetings
				FROM aalocations l
			JOIN aameetings m ON l.id = m.id
			WHERE ${where}
				GROUP BY display_address
			;
		`;
		client
		  .query(query)
		  .then(response => {

		  	let r = _.chain(response.rows)
		  	.pluck('meetings')
		  	.flatten()
		  	.groupBy('start_hour')
		  	.mapObject(d => _.groupBy(d, 'start_mins') )
		  	.mapObject(d => {return _.mapObject(d, p => p.length )})
		  	.value();

		  	res.send(r);

		  })
		  .then(() => {
		  	console.log('End connection to DB');
		  	client.end();
		  })
		  .catch(e => {console.error(e); client.end();});
	});

app.listen(port, () => {
	console.log('Api is running ON ', port);
});
