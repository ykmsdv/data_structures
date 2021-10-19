/* global docClient */
const async = require('async');
const AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";

const blogEntries = [];

class BlogEntry {
	constructor(primaryKey, week, temperature, energy_level, steps, sleep) {
		this.date = {};
		this.date.S = new Date(primaryKey).toDateString(); // string date
		this.week = {};
		this.week.S = week; // string
		this.temperature = {};
		this.temperature.NS = temperature.map(t => t.toString()); // number set [high, low]
		this.energy_level = {};
		this.energy_level.N = energy_level.toString(); // number, 1 to 10
		this.steps = {};
		this.steps.N = steps.toString(); // number
		this.sleep = {};
		this.sleep.S = sleep; // string, must be formatted properly if used
	}
};

blogEntries.push(new BlogEntry('October 04, 2021', 'w1', [73, 62], 8, 14948, '5:20' ));
blogEntries.push(new BlogEntry('October 05, 2021', 'w1', [64, 60], 4, 8923, '4:40' ));
blogEntries.push(new BlogEntry('October 06, 2021', 'w1', [69, 60], 2, 13389, '3:22' ));
blogEntries.push(new BlogEntry('October 11, 2021', 'w2', [69, 62], 6, 11807, '4:33' ));
blogEntries.push(new BlogEntry('October 12, 2021', 'w2', [69, 60], 7, 11219, '4:04' ));
blogEntries.push(new BlogEntry('October 13, 2021', 'w2', [69, 62], 3, 12363, '5:45' ));


var dynamodb = new AWS.DynamoDB();

async.eachSeries(blogEntries, function(entry, callback) {
  
  const params = {};
        params.Item = entry;
        params.TableName = "diary";

  // insert items into the database
  dynamodb.putItem(params, function (err, data) {
    
    if(err) {
      console.log(err, err.stack);
    } else {
      console.log('Successfully put item: ', params.Item.date); // successful response 
    }
  });

  setTimeout(callback, 1000); 

});
