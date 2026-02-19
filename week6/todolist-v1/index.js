//Name: April Hope 
//Date: 02/18/2026
//Assignment: 6a - To Do List Update
//Description: This creates two separate to-do lists, a chore and a camping to-do list. Users can add items to either list using EJS and Express. Users can navigate between the two lists using either /chores or /camping as the URL. 

//jshint esversion:6

// Import the packages needed to run the server and parse the html 
const express = require("express");
const bodyParser = require("body-parser");

// this imports a custom date module. I don't use it in my code, but I left it since it was part of the original code. 
const date = require(__dirname + "/date.js");

const app = express();

// This is where I set up the arrays. I put 3 items in each as the assignment requested. 
let chores = ["Wash Dishes", "Clean Floors", "Do Laundry"];
let campingSpots = ["Beach", "Polipoli", "Kipahulu"];

// set EJS as the viewing engine to display html (this comment comes from the OG code)
app.set('view engine', 'ejs');

// use body parser to parse html file (this one comes from the OG code too)
app.use(bodyParser.urlencoded({ extended: true }));

// use Express to serve or display static files such as images, CSS, JS files etc. (I mean pretty much I didn't delete comments if they were still accurate for the code I kept)
app.use(express.static("public"));

// So this uses /chores as the root URL instead of /, displaying the chores array list. 
app.get("/", function (req, res) {
    res.redirect("/chores");
});

// this will determine which list to add to 
app.post("/", function (req, res) {

    // this determines which list to add new item to
    let item = req.body.newItem;
    let list = req.body.list;

    // if route is /chores, add to chores list
    // if list === camping then go to /camping
    if (req.body.list === "Chores") {
        chores.push(item);
        res.redirect("/chores");
    } else if (list === "Camping") {
        campingSpots.push(item);
        res.redirect("/camping");
    } else {
        res.redirect("/chores");
    }
});

//This is the route for the chores list 
app.get("/chores", function (req, res) {
    res.render("list", { listTitle: "Chores", newListItems: chores });
});

//This is the route for the camping spots list 
app.get("/camping", function (req, res) {
    res.render("list", { listTitle: "Camping", newListItems: campingSpots });
});

//This starts the server on port 3000! 
app.listen(3000, function () {
    console.log("Server is running on port 3000")
});