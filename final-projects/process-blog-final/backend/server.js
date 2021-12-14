/* global docClient */
const express = require("express");
const cors = require('cors');

const port = 8080;
const app = express();


const async = require('async');
const AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";


const dynamodb = new AWS.DynamoDB();


app.get('/api/dataset', (req, res) => {
    let params_all = {
        TableName: "processBlog",
    };
    
    let result = dynamodb.scan(params_all, onScan);
    let count = 0;

    function onScan(err, data) {
        console.log("***** ***** ***** ***** ***** \nQuerying table...");
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {        
            console.log("Scan succeeded.");
    
            res.send(JSON.stringify(data.Items));
        }
    }
        
	console.log("request: ", req.query);

});


app.listen(port, function () {
  console.log(`Example app listening on port${port}!`);
  console.log("**************************************");
});

