# Data Structures - Weekly Assignment 01

Weekly Assignment 01 required making a request in node.js for each of the ten "Meeting List Agenda" pages of AA's website for Manhattan. After ensuring the request was successful, the HTML result from the request has to be saved in a text file in the local environment. In the following assignments the HTML content will be used to extract relevant data for the AA's meetings. Below are the provided links with the ten AA's meetings and the provided starter code.

Links to the ten AA's meetings pages:
    https://parsons.nyc/aa/m01.html  
    https://parsons.nyc/aa/m02.html  
    https://parsons.nyc/aa/m03.html  
    https://parsons.nyc/aa/m04.html  
    https://parsons.nyc/aa/m05.html  
    https://parsons.nyc/aa/m06.html  
    https://parsons.nyc/aa/m07.html  
    https://parsons.nyc/aa/m08.html  
    https://parsons.nyc/aa/m09.html  
    https://parsons.nyc/aa/m10.html 

Starter code:
    // npm install got
    // mkdir data
    
    const fs = require('fs');
    const got = require('got');
    
    (async () => {
    	try {
    		const response = await got('https://parsons.nyc/thesis-2021/');
    		console.log(response.body);
    		fs.writeFileSync('/home/ec2-user/environment/data/thesis.txt', response.body);
    		//=> '<!doctype html> ...'
    	} catch (error) {
    		console.log(error.response.body);
    		//=> 'Internal server error ...'
    	}
    })();

Solution:
The first thing I did was to create an array with the provided AA meetings links. After that I defined a function which encapsulates the anonymous async function, requiring 3 parameters - the source from which I will request the data, the index of the url in the array, and the name under which the data will be saved. Then, I created a for loop which iterates over the array of meeting links and called the function requesting each file, passing dynamically the parameters: filename and url request. 

