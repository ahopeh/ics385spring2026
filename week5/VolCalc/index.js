//Name: April Hope
//Date: 02/13/26
//Assignment: Week 5, 5c VolCalc
//This calculator is based off debasisb github bmiCalculator.html and my own f2cCalc.html
//This is an express app that calculates the volume of a cylinder using pi*(r^2)*h

// create an express object from the express package
const express = require("express");
const bodyParser = require("body-parser");

// create an app object from the express object
const app = express();
// this allows the parsing of the html file using body parser
app.use(bodyParser.urlencoded({ extended: true }));

//this is what will display things at the /VolCalc path
app.get("/VolCalc", function (req, res) {
    res.sendFile(__dirname + "/VolCalculator.html");
});

// this gets the response from the values in the web page
app.post("/VolCalc", function (req, res) {
    //allow for decimals by making it a parseFloat
    var radius = parseFloat(req.body.radius);
    var height = parseFloat(req.body.height);

    //Calculate the volume of the cylinder using JavaMath!!
    var volume = Math.PI * Math.pow(radius, 2) * height;

    // sends the results back to the web page as string,
    // limiting the volume number to 2 decimals so it's not crazy
    res.send("The volume of the Cylinder is " + volume.toFixed(2));
});

app.listen(3000, function () {

    console.log("Server is running on port 3000");
});