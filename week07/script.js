const fs = require('fs'),
      got = require('got'),
      cheerio = require('cheerio'),
      querystring = require('querystring'),
      async = require('async'),
      dotenv = require('dotenv'),
      _ = require('underscore');

// TAMU api key
dotenv.config();
const API_KEY = process.env.TAMU_KEY;
const API_URL = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx';

const cache = "data/cache";
const data = "data/clean";
const geocoded = "data/geocoded";
const all_locations = "data/clean/locations.json";


// cacheData();
// extractAddresses();
// checkAddresses();
// extractAllLocationData();
// extractGeoLocation();

    // read file
    function readFile(file, cb) {
        let result = fs.readFileSync(file, 'utf-8');

        return cb( JSON.parse(result) );
    }

    let sp = []
    readFile('data/geocoded/locations-lat-long.json', (data) => {
      _.map(data, m => { sp.push(_.pluck(m.meetings, 'meeting_type')) })
    });

    console.log(_.uniq(_.flatten(sp)))

function cacheData() {

  // add all URLs to a new array
  const aa_meetings = ["https://parsons.nyc/aa/m01.html",
  "https://parsons.nyc/aa/m02.html",
  "https://parsons.nyc/aa/m03.html",
  "https://parsons.nyc/aa/m04.html",
  "https://parsons.nyc/aa/m05.html",
  "https://parsons.nyc/aa/m06.html",
  "https://parsons.nyc/aa/m07.html",
  "https://parsons.nyc/aa/m08.html",
  "https://parsons.nyc/aa/m09.html",
  "https://parsons.nyc/aa/m10.html"
  ];


  // get the data from the html files and save them as txt files
  function asyncRequest(source, file_number, file_name) {
    console.log("Caching ", file_name);

      (async () => {
        try {
          const response = await got(source[file_number]);

          fs.writeFileSync(`${cache}/${file_name}.txt`, response.body); //`data/${file_name}.txt`

        } catch (error) {
          console.error('error', error);
        }
      })();
  }

  function collectData() {
    // loop through the urls array
    const n_meetings = aa_meetings.length;
    let file_name = "";

    for (let i=0; i<n_meetings; i++) {

        if(i <= 8) {
          file_name = `aa-0${i+1}`;
        } else {
          file_name = `aa-${i+1}`;
        }

        asyncRequest(aa_meetings, i, file_name);
    }
  }

  collectData();

}

function extractAddresses() {
  let addresses = [];

  // loop through files in folder
  let filenames = fs.readdirSync(cache);

      filenames.forEach((file) => {

        // it is not a hidden system file
        if(file.indexOf(".DS_Store") == -1) {
            console.log("Cheerio processing: ", file);
            cheerioData(file);
          }

      });

    // check how many addresses
    console.log('number of extracted addresses: ', addresses.length);
    
    fs.writeFileSync(`${data}/addresses.json`, JSON.stringify(addresses, null, 2));


    function cheerioData(file) {
        // load the text file
        const content = fs.readFileSync(`${cache}/${file}`, 'utf-8');
        // load `content` into a cheerio object
        const $ = cheerio.load(content);

        $('form + table tbody tr > td:first-child').each(function(i, elem) {

            let $el = $(elem);

            let address = $el.find("b + br").get(0).nextSibling.nodeValue;
                address = address.split(",")[0];
                address = address.split("- ")[0];
                address = address.replace(/(\r\n|\n|\t|\r)/gm, "");
                address = address.split('(')[0];
                address = address.split(' Rm')[0];
                address = address.replace('@', '&');
                address = address.replace('Strert', 'Street');
                address = address.replace('Shepard', 'Shepherd');
                address = address.split(' Meeting')[0];
                address = address.replace('West165th', 'West 165th');

            // remove final trailing spaces
            address = address.trim();
            // console.log(address);

            if(addresses.indexOf(address) === -1) {
              addresses.push(address);
            }

        });

        console.log('done!');
    }
}


function checkAddresses() {
    let addresses = fs.readFileSync(`${data}/addresses.json`, 'utf-8');
        addresses = JSON.parse(addresses);


    addresses.forEach(address => {
      if(address.indexOf('@') >= 0) {
        console.log('@ ', address);
      }
      if(address.indexOf(".") >= 0) {
        console.log('. ', address);
      }
      if(address.indexOf("&") >= 0) {
        console.log('& ', address);
      }
      if(address.indexOf("(") >= 0) {
        console.log('( ', address);
      }
      if(address.indexOf("Rm") >= 0) {
        console.log('Rm ', address);
      }
      if(address.indexOf("Strert") >= 0) {
        console.log('Strert ', address)
      }

    });

}

function extractAllLocationData() {
  let locations = [];

  // loop through files in folder
  let filenames = fs.readdirSync(cache);

      filenames.forEach((file) => {

        // it is not a hidden system file
        if(file.indexOf(".DS_Store") == -1) {
            console.log("Cheerio processing: ", file);
            cheerioData(file);
          }

      });

    // check how many addresses
    console.log('number of extracted locations: ', locations.length);
    fs.writeFileSync(`${data}/locations.json`, JSON.stringify(locations, null, 2));


    function cheerioData(file) {
        // load the text file
        const content = fs.readFileSync(`${cache}/${file}`, 'utf-8');
        // load `content` into a cheerio object
        const $ = cheerio.load(content);


        function cleanAddress(address) {
            address = address.split(",")[0];
            address = address.split("- ")[0];
            address = address.replace(/(\r\n|\n|\t|\r)/gm, "");
            address = address.split('(')[0];
            address = address.split(' Rm')[0];
            address = address.replace('@', '&');
            address = address.replace('Strert', 'Street');
            address = address.replace('Shepard', 'Shepherd');
            address = address.split(' Meeting')[0];
            address = address.replace('West165th', 'West 165th');
            return address.trim();
        }
        function removeCharacters(str) {
            return str.replace(/(\r\n|\n|\t|\r)/gm, "").replace(/\s+/g, ' ').trim();
        }


          $('form + table tbody tr').each(function(i, tr) {
              let $tr = $(tr);

            let obj = {
                    id: `${file.split('-')[1].split('.')[0]}_${i}`,
                    location_name: "",
                    address_name: "",
                    display_address: "",
                    clean_address: "",
                    zip_code: "",
                    details: false,
                    wheelchair: false,
                    meetings: []
                };


                // find the first child aka sibling of td 2
               $tr.children().eq(0).each(function(j, elem) {

                    let $el = $(elem);


                    // console.log("*************************************")

                    obj.location_name = $el.find("h4").text();
                    obj.address_name = removeCharacters($el.find("b").text());
                    obj.clean_address = $el.find("b + br").get(0).nextSibling.nodeValue;
                    obj.clean_address = cleanAddress(obj.clean_address);
                    obj.clean_address = obj.clean_address.split(",")[0].split("- ")[0];
                    obj.display_address = $el.html().split('/h4>')[1].split('/b>')[1].split('<span')[0].split('<div')[0].replace(/<br>/g, '');
                    obj.display_address = removeCharacters(obj.display_address);
                    // https://stackoverflow.com/questions/21074812/extracting-a-zip-code-from-an-address-string


                    obj.zip_code = $el.html().match(/\d{5}(-\d{4})?/);

                    if(obj['zip_code'] && obj['zip_code'].length) {
                      obj.zip_code = obj.zip_code[0];
                    } else {
                      console.log('no zip code',obj.location_name, obj.clean_address, obj.zip_code);
                      obj.zip_code = false;
                    }


                    obj.details = $el.find(".detailsBox").text();
                    obj.details = removeCharacters(obj.details);

                    if( typeof $el.find('img').attr() === 'object') {
                        obj.wheelchair = true;
                    }

            // find the second child aka sibling of td 1
                 $tr.children().eq(1).each(function(i, elem) {

                    let $el = $(elem),
                        $el_html = $el.html();


                    // console.log("************************* ", i, " ************************")

                    $el.find('br').remove();

                    // console.log($el.html())

                    $el.children("b:contains('From')").each(function(j, b) {
                        let $b = $(b),
                            $bhtml = $b.html();

                        let o = {
                            day: "",
                            start_time: "",
                            end_time: "", //[h, m, a/p]
                            meeting_type: false,
                            special_interest: false
                        };


                        let day = $bhtml.split(' ')[0];
                            o.day = day.length >= 2 ? day : false;
                            o.start_time = $b.get(0).nextSibling.nodeValue;
                            o.start_time = removeCharacters( o.start_time ).replace(':', ' ').split(' ');
                            o.end_time = $b.next().get(0).nextSibling.nodeValue
                            o.end_time = removeCharacters( o.end_time ).replace(':', ' ').split(' ');

                            if($(b).next().next().text() == 'Meeting Type') {
                                o.meeting_type = $b.next().next().get(0).nextSibling.nodeValue
                                o.meeting_type = removeCharacters( o.meeting_type );
                            } else if ($(b).next().next().text() == 'Special Interest') {
                                o.special_interest = $b.next().next().get(0).nextSibling.nodeValue
                                o.special_interest = removeCharacters( o.special_interest );
                            }

                            if($(b).next().next().next().text() == 'Special Interest') {
                                o.special_interest = $b.next().next().next().get(0).nextSibling.nodeValue
                                o.special_interest = removeCharacters( o.special_interest );
                            }

                            if(o.day) {
                                obj.meetings.push(o);
                            }


                        });


                    // console.log(obj.meetings);


                    });

                });

                locations.push(obj);

          });

        console.log('done!');

        return locations;

    }
}

function extractGeoLocation() {

    // geocode addresses
    let meetingsData = [];

    // read file
    function readFile(file, cb) {
        let result = fs.readFileSync(file, 'utf-8');

        return cb( JSON.parse(result) );
    }

    readFile(`${all_locations}`, (addresses) => {
      getLatLon(addresses);
   });



    function getLatLon(addresses) {

        // eachSeries in the async module iterates over an array and operates on each item in the array in series
        async.eachSeries(addresses, function(eachAddress, callback) {

            let query = {
                streetAddress: eachAddress.clean_address,
                city: "New York",
                state: "NY"
            };
            // add a zip code if we know it to make the api call more specific
            if(eachAddress.zip_code) { query.zip = eachAddress.zip_code }

            query['apikey'] = API_KEY;
            query['format'] = "json";
            query['version'] = "4.01";

            // construct a querystring from the `query` object's values and append it to the api URL
            let apiRequest = API_URL + '?' + querystring.stringify(query);

            (async () => {
                try {
                    const response = await got(apiRequest);
                    let tamuGeo = JSON.parse(response.body);

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
                            eachAddress['tamuGeoAddress'] = tamuGeo['InputAddress']['StreetAddress'];
                            eachAddress['latLong'] = {};
                            eachAddress['latLong']['lat'] = lat;
                            eachAddress['latLong']['long'] = long;

                            if( tamuGeo['FeatureMatchingResultType'] != 'Success' ) {
                                console.log('********************************');
                                console.log('Match type: ', tamuGeo['FeatureMatchingResultType'], '\nNumber of matches: ', tamuGeo['FeatureMatchingResultCount'], '\naddress: ', eachAddress.clean_address, lat, long);

                                eachAddress['matchingStrategy'] = tamuGeo['FeatureMatchingResultType'];
                                eachAddress['matchScore'] = tamuGeo['OutputGeocodes'];


                            } else {
                                console.log('********************************');
                                console.log('Success', eachAddress.clean_address, lat, long);
                            }

                        } else {
                            console.error('Output geo codes does not exist or result is 0', eachAddress);

                            eachAddress['tamuGeoAddress'] = eachAddress;
                            eachAddress['latLong'] = false;

                        }
                    }

                    // push formatted address to array
                    meetingsData.push(eachAddress);
                    // console.log(meetingsData);
                    return Promise.resolve(1);

                } catch (error) {
                    console.error(error);
                }
            })().then(() => {
              // sleep for a couple seconds before making the next request
              setTimeout(callback, 2000);
            });


        }, function() {
            // write the file with the formatted addresses and API's clean address + lat and long (from the meetingsData array)
            fs.writeFileSync(`${geocoded}/locations-lat-long.json`, JSON.stringify(meetingsData));
            console.log('*** *** *** *** ***');
            console.log(`Number of geocoded meetings: ${meetingsData.length}`);


        });

    }

}












