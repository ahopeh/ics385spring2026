//Name: April Hope
//Date: 02/13/26
//Assignment: Week 5, 5b f2c
//referencing jshint eversion:6 pulled from debasisb repository
//comments come from that repository with some edits by April
//redisigining BMI Calculator code to calculate Farenheit to Centigrade

// create an express object from the express package
const express = require("express");
const bodyParser = require("body-parser");

// create an app object from the express object
const app = express();
// this allows the parsing of the html file using body parser
app.use(bodyParser.urlencoded({ extended: true }));

//this sends the html file to the web page using the root directory
app.get("/f2c", function (req, res) {
    res.sendFile(__dirname + "/f2cCalc.html");
});

// this gets the response from the values in the web page
app.post("/f2c", function (req, res) {
    //make sure to turn the number put in by the user into an integer
    var fahrenheit = parseInt(req.body.fahrenheit, 10);

    //Convert the input fahrenheit integer into centigrade
    var centigrade = Math.round(((fahrenheit - 32) * 5) / 9);

    // sends the results back to the web page as string
    res.send(
        fahrenheit +
        " degrees Fahrenheit equals " +
        centigrade +
        " degrees Centigrade"
    );
});

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});
