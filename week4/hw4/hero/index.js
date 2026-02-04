//jshint esversion:6

const superheroes = require('superheroes');
const supervillains = require('supervillains');

var mySuperHeroName = superheroes.random();
var mySuperVillainName = supervillains.random();

console.log(mySuperHeroName);
console.log(mySuperVillainName);

const Quote = require('inspirational-quotes');
var myQuote = Quote.getRandomQuote();
console.log(myQuote);

// add popular movie quotes 
const movieQuote = require('popular-movie-quotes');
var myMovieQuote = movieQuote.getRandomQuote().quote;
console.log(movieQuote.getRandomQuote());

// add famous last words
const lastWords = require('famous-last-words');
var myLastWords = lastWords[8];
console.log(myLastWords);

 const fs = require("fs");
  fs.writeFileSync("file1.txt", "Super Hero: " + mySuperHeroName);
  fs.writeFileSync("file2.txt", "Super Villain: " + mySuperVillainName);
  fs.writeFileSync("file3.txt", "Quote of the Day " + myQuote);
  fs.writeFileSync("file4.txt", "Movie Quote: " + myMovieQuote);
  fs.writeFileSync("file5.txt", "Famous Last Words: " + myLastWords);

// creates a local web server and displays the above variables
const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end("Super Hero: " + mySuperHeroName + "\nSuper Villain: " + mySuperVillainName + "\nQuote of the Day " + myQuote + "\nMovie Quote: " + myMovieQuote + "\nFamous Last Words: " + myLastWords + "\n");

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});