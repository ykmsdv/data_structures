#### Data Structures - Wekly Assignment 2

Weekly assignment 2 required reading the assigned AA text file (according to the last digit of the student's N number) with Node.js, studying the HTML structure of the file and parsing it. The goal of the parsing is to write a new text file, containing only the street address for each row of the AA file and storing it in the appropriate data type. The GitHub repository for the assignment must contain the .js file and the .txt with the addresses.

##### Provided starter code:
	
	// npm install cheerio
	
	var fs = require('fs');
	var cheerio = require('cheerio');
	
	// load the thesis text file into a variable, `content`
	// this is the file that we created in the starter code from last week
	var content = fs.readFileSync('data/thesis.txt');
	
	// load `content` into a cheerio object
	var $ = cheerio.load(content);
	
	// print (to the console) names of thesis students
	$('h3').each(function(i, elem) {
	    console.log($(elem).text());
	});
	
	// write the project titles to a text file
	var thesisTitles = ''; // this variable will hold the lines of text
	
	$('.project .title').each(function(i, elem) {
	    thesisTitles += ($(elem).text()).trim() + '\n';
	});
	
	fs.writeFileSync('data/thesisTitles.txt', thesisTitles);
	

##### Solution: 
As required in the assignment, I read the data for the third file (based on the last digit of my N number) of the AA meetings from a cached local copy in order to avoid additional requests to the server. Next, using Cheerio, I located the <td> element containing the address. After caching the <td> element into a variable, I assigned the address text node to a variable called 'address' and excluded the additional information about the addresses by splitting each string containing ',' or '- ':

	address = address.split(",")[0];
    address = address.split("- ")[0];

Then, I cleaned the extra characters:

    address = address.replace(/(\r\n|\n|\t|\r)/gm, "");


Last, after updating the 'address' variable with the clean address text, I saved all addresses in a new file, each address on a new line.

