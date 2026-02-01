// AI-generated comment: Game state variables to track statistics
let gamesPlayed = 0;
let player1Wins = 0;
let player2Wins = 0;
let drawCount = 0;

// AI-generated comment: Function to generate random dice value between 1-6
function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

// AI-generated comment: Function to update dice image source
function updateDiceImage(element, diceValue) {
  const imagePath = `images/dice${diceValue}.png`;
  element.setAttribute("src", imagePath);
}

// AI-generated comment: Function to add rolling animation to dice
function addRollingAnimation() {
  const allDice = document.querySelectorAll('.dice-img');
  allDice.forEach(die => die.classList.add('rolling'));

  setTimeout(() => {
    allDice.forEach(die => die.classList.remove('rolling'));
  }, 500);
}

// AI-generated comment: Array of encouraging messages for young players
const encouragingMessages = [
  "Great roll! Try again! 🌟",
  "Nice try! Keep playing! 🎯",
  "Awesome game! Roll again! ⭐",
  "You're doing great! 🎲",
  "Fun round! Let's go again! 🎊",
  "Keep it up! 🌈"
];

// AI-generated comment: Function to get random encouraging message
function getEncouragingMessage() {
  const randomIndex = Math.floor(Math.random() * encouragingMessages.length);
  return encouragingMessages[randomIndex];
}

// added more thorough stat tracking, Claude helped with this
function updateStats() {
  document.getElementById('gamesPlayed').textContent = gamesPlayed;
  document.getElementById('p1Wins').textContent = player1Wins;
  document.getElementById('p2Wins').textContent = player2Wins;
  document.getElementById('draws').textContent = drawCount;
}

// AI-generated comment: Main game function - updated  to handle three dice per player
function playGame() {
  // Add rolling animation
  addRollingAnimation();

  // Wait for animation to complete before showing results
  setTimeout(function() {
    // Roll three dice for Player 1
    const p1Dice1 = rollDice();
    const p1Dice2 = rollDice();
    const p1Dice3 = rollDice();

    // Roll three dice for Player 2
    const p2Dice1 = rollDice();
    const p2Dice2 = rollDice();
    const p2Dice3 = rollDice();

    // Update Player 1 dice images
    updateDiceImage(document.querySelector('.p1-dice1'), p1Dice1);
    updateDiceImage(document.querySelector('.p1-dice2'), p1Dice2);
    updateDiceImage(document.querySelector('.p1-dice3'), p1Dice3);

    // Update Player 2 dice images
    updateDiceImage(document.querySelector('.p2-dice1'), p2Dice1);
    updateDiceImage(document.querySelector('.p2-dice2'), p2Dice2);
    updateDiceImage(document.querySelector('.p2-dice3'), p2Dice3);

    // AI-generated comment: Find highest value for each player using Math.max
    const p1Highest = Math.max(p1Dice1, p1Dice2, p1Dice3);
    const p2Highest = Math.max(p2Dice1, p2Dice2, p2Dice3);

    // Display highest numbers
    document.querySelectorAll('.highest-number')[0].innerHTML = `Highest: ${p1Highest}`;
    document.querySelectorAll('.highest-number')[1].innerHTML = `Highest: ${p2Highest}`;

    // AI-generated comment: Determine winner based on highest dice values
    // Updated for no draws allowed if highest numbers match
    const heading = document.getElementById('resultMessage');

    if (p1Highest > p2Highest) {
      heading.innerHTML = "🚩 Player 1 Wins! 🚩<br><small style='font-size: 2rem;'>" + getEncouragingMessage() + "</small>";
      heading.style.color = "#FFD700"; // Gold color for winner
      player1Wins++;
    } else if (p2Highest > p1Highest) {
      heading.innerHTML = "🚩 Player 2 Wins! 🚩<br><small style='font-size: 2rem;'>" + getEncouragingMessage() + "</small>";
      heading.style.color = "#FFD700"; // Gold color for winner
      player2Wins++;
    } else {
      // When highest dice match, it's a draw per assignment requirements
      heading.innerHTML = "It's a Draw! 🤝<br><small style='font-size: 2rem;'>So close! Try again! 🎲</small>";
      heading.style.color = "#FF6B6B"; // Different color for draw
      drawCount++;
    }

    // Update game statistics
    gamesPlayed++;
    updateStats();
  }, 500); // Delay matches animation duration
}

// AI-generated comment: Event listener for button click instead of page refresh
document.getElementById('rollButton').addEventListener('click', playGame);

// AI-generated comment: Welcome message when page first loads
window.addEventListener('load', function () {
  document.getElementById('resultMessage').innerHTML = "Ready to Play! 🎲";
});