// Name: April Hope
// Date 02/20/26
// Assignment: Week 6 6b - Random Course Generator
// Description: Express and EJS app that generates a random UHMC course ID and name when the user clicks a button. 

import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

// Lets the browser access the files inside /public (specifically main.css which holds the styling for this app)
app.use(express.static("public"));

// Lets us read form submissions and access the information in req.body 
app.use(bodyParser.urlencoded({ extended: true }));

// Renders the template the first time the user visits the page.
app.get("/", (req, res) => {
    res.render("index.ejs");
});

// When the button is clicked this route runs and generates a random course
app.post("/submit", (req, res) => {
   // Pick one random course ID and one random course name from the arrays
    const randomCourseID = courseID[Math.floor(Math.random() * courseID.length)];
    const randomCourseName = courseName[Math.floor(Math.random() * courseName.length)];

    // Re-render the same page but now with the random course ID and name that was just generated.
    res.render("index.ejs", {
        courseID: randomCourseID,
        courseName: randomCourseName,
    });
    });

    // Starts the server (visit it at http://localhost:3000)
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// Array of Course IDs
const courseID = [
    "ICS 169", 
    "ICS 171", 
    "ICS 173", 
    "ICS 184", 
    "ICS 320", 
    "ICS 360", 
    "ICS 385"
]; 

// Array of Course Names 
const courseName = [
    "Intro to Info Security",
    "Intro to Computer Security",
    "Intro to Data Science",
    "Intro to Networking",
    "Intro to Info Systems & AI",
    "Database Design and Development",
    "Web Development and Administration"
];
