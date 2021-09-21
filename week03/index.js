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

// read file
function readFile(file, cb) {
    let result = fs.readFileSync(file, 'utf-8');

    return cb( JSON.parse(result) );
}

readFile('data/addresses-03.json', (addresses) => {

    // add new york, ny in case we need it
    // addresses = addresses.map(a => {
    //     return a += ', New York, NY';
    // });

    getLatLon(addresses);

});
   
    
function getLatLon(addresses) {

    // eachSeries in the async module iterates over an array and operates on each item in the array in series
    async.eachSeries(addresses, function(eachAddress, callback) {
        
        let query = {
            streetAddress: eachAddress,
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
                let formatted_address = {};

                // check if there are results
                if( parseInt(tamuGeo['FeatureMatchingResultCount']) > 0 ) {
                    // check if there are lat long
                    if( tamuGeo.hasOwnProperty('OutputGeocodes') && tamuGeo['OutputGeocodes'].length ) {
                        
                        let geoCodes = tamuGeo['OutputGeocodes'][0]['OutputGeocode'];
                        let lat, long;

                        // find and assign lat
                        if( geoCodes.hasOwnProperty('Latitude') ) {
                            lat = geoCodes['Latitude'];
                        }
                        // find and assign long
                        if( geoCodes.hasOwnProperty('Longitude') ) {
                            long = geoCodes['Longitude'];
                        }

                        // save the formatted address object
                        formatted_address['address'] = eachAddress;
                        formatted_address['clean_address'] = tamuGeo['InputAddress']['StreetAddress'];
                        formatted_address['latLong'] = {};
                        formatted_address['latLong']['lat'] = lat;
                        formatted_address['latLong']['long'] = long;

                        if( tamuGeo['FeatureMatchingResultType'] != 'Success' ) {
                            console.log('********************************');
                            console.log('Match type: ', tamuGeo['FeatureMatchingResultType'], '\nNumber of matches: ', tamuGeo['FeatureMatchingResultCount'], '\naddress: ', eachAddress, lat, long);
                        } else {
                            console.log('********************************');                            
                            console.log('Success', eachAddress, lat, long);
                        }

                    } else {
                        console.error('Output geo codes does not exist or result is 0', eachAddress);
                        formatted_address.address = eachAddress;
                        formatted_address['latLong'] = false;
                    }
                }
                
                // push formatted address to array
                meetingsData.push(formatted_address);
                // console.log(meetingsData);
            
            } catch (error) {
                console.error(error);
            }
        })();

        // sleep for a couple seconds before making the next request
        setTimeout(callback, 2000);

    }, function() {
        // write the file with the formatted addresses + lat and long (from the meetingsData arrat)
        fs.writeFileSync('data/addresses-lat-lon-03.json', JSON.stringify(meetingsData));
        console.log('*** *** *** *** ***');
        console.log(`Number of meetings in this zone: ${meetingsData.length}`);
    
    });

}
