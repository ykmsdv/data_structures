/* global docClient */
const async = require('async');
const AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";


var dynamodb = new AWS.DynamoDB();

// query for a specific date
const params = {
    TableName : "diary",
    KeyConditionExpression: "#dt = :date",
    ExpressionAttributeNames:{
        "#dt": "date"
    },
    ExpressionAttributeValues: {
        ":date": {S: new Date("October 06, 2021").toDateString()}
    }
};

dynamodb.query(params, function(err, data) {
    console.log("***** ***** ***** ***** ***** \nQuerying for October 06, 2021...");
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log("***** ***** ***** ***** ***** \n", JSON.stringify(item));
        });
    }
});

// scan to get all items in the table
let params_all = {
    TableName: "processblog",
};

dynamodb.scan(params_all, onScan);
let count = 0;

function onScan(err, data) {
    console.log("***** ***** ***** ***** ***** \nQuerying table...");
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {        
        console.log("Scan succeeded.");
        data.Items.forEach(function(itemdata) {
          console.log("Item :", ++count,JSON.stringify(itemdata));
        });

        // continue scanning if we have more items
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params_all.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params_all, onScan);
        }
    }
}