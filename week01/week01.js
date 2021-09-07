// // starter code provided in class:
// npm install got
// mkdir data

// (async () => {
// 	try {
// 		const response = await got('https://parsons.nyc/thesis-2021/');
// 		console.log(response.body);
// 		fs.writeFileSync('/home/ec2-user/environment/data/thesis.txt', response.body);
// 		//=> '<!doctype html> ...'
// 	} catch (error) {
// 		console.log(error.response.body);
// 		//=> 'Internal server error ...'
// 	}
// })();



// Commands to use:
// npm install got
// mkdir data

const fs = require('fs');
const got = require('got');

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
    (async () => {
    	try {
    		const response = await got(source[file_number]);

    		fs.writeFileSync(`${file_name}.txt`, response.body); //`data/${file_name}.txt`

    	} catch (error) {
    		console.error('error', error);
    	}
    })();
}

// loop through the urls array 
const n_meetings = aa_meetings.length;
for (let i=0; i<n_meetings; i++) {
    
    let file_name = `aa-${i+1}`;
    
    asyncRequest(aa_meetings, i, file_name);
}