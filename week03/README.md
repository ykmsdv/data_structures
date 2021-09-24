#### Data Structures - Wekly Assignment 3

Assignment requirements:

Continue work on the file you parsed in Weekly Assignment 2. If you haven't already, organize your data into a mixture of Objects and Arrays that can be ‘parsed’ and ‘stringified’ as JSON.

Write a script that makes a request to the Texas A&M Geoservices Geocoding APIs for each address, using the address data you parsed in Weekly Assignment 2.

Your final output should be a .json file that contains an array that contains an object for each meeting (which may or may not nest other arrays and objects). The array should have a length equal to the number of meetings. Each object should hold the relevant data for each meeting. For now, we're focusing on the addresses and geographic coordinates. An example:

	[ 
	  { address: '63 Fifth Ave, New York, NY', latLong: { lat: 40.7353041, lng: -73.99413539999999 } },
	  { address: '16 E 16th St, New York, NY', latLong: { lat: 40.736765, lng: -73.9919024 } },
	  { address: '2 W 13th St, New York, NY', latLong: { lat: 40.7353297, lng: -73.99447889999999 } } 
	]
	

Starter code:

	// npm install async dotenv querystring
	"use strict"

	// dependencies
	const fs = require('fs'),
	      querystring = require('querystring'),
	      got = require('got'),
	      async = require('async'),
	      dotenv = require('dotenv');
	
	// TAMU api key
	dotenv.config();
	const API_KEY = process.env.TAMU_KEY;
	const API_URL = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx'
	
	// geocode addresses
	let meetingsData = [];
	let addresses = ["63 Fifth Ave", "16 E 16th St", "2 W 13th St"];
	
	// eachSeries in the async module iterates over an array and operates on each item in the array in series
	async.eachSeries(addresses, function(value, callback) {
	    let query = {
	        streetAddress: value,
	        city: "New York",
	        state: "NY",
	        apikey: API_KEY,
	        format: "json",
	        version: "4.01"
	    };
	
    // construct a querystring from the `query` object's values and append it to the api URL
    let apiRequest = API_URL + '?' + querystring.stringify(query);

    (async () => {
    	try {
    		const response = await got(apiRequest);
    		let tamuGeo = JSON.parse(response.body);
    		console.log(tamuGeo['FeatureMatchingResultType'], apiRequest);
    		meetingsData.push(tamuGeo);
    	} catch (error) {
    		console.log(error.response.body);
    	}
    })();

    // sleep for a couple seconds before making the next request
    setTimeout(callback, 2000);
	}, function() {
	    fs.writeFileSync('data/first.json', JSON.stringify(meetingsData));
	    console.log('*** *** *** *** ***');
	    console.log(`Number of meetings in this zone: ${meetingsData.length}`);
	});
	

##### Solution:
As required in the assignment, I stored my API key in a .env file, using npm dotenv. I created a readFile function, which takes the addresses file from assignment 2, and returns the parsed result to a callback function. Next, I looped over the addresses and used them to fill in the query object. Next, I constructed the API request link with the API URL, API key, and the query string. Then, I made the API call and saved the response to a tamuGeo variable, and instantiated a new empty object formatted-address, which would hold the structured data from the API. As part of the request, I implemented checks for the success or failure of the API response, and pushed the results from the successful responses to the formatted-address object: address, clean-address, latLong. Finally, I pushed the formatted addresses to the meetingsData array, and saved it into a new file 'addresses-lat-lon-03.json'.