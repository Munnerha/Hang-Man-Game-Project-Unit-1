/*-------------------------------- Constants --------------------------------*/

// Define constants for hangman body parts. (head, body, left arm, right arm, left leg, right leg)
const hangmanBodyParts = ['head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];

// Word lists by level, easiest to hardest
const wordLevels = [
  ['CAT', 'DOG', 'DESK'], // Level 1
  ['LAPTOP', 'WALLET', 'PHONE'], // Level 2
  ['APARTMENT', 'CALENDAR', 'UMBRELLA'] // Level 3
];

const winMessage = 'Congratulations! You guessed the word!';
const loseMessage = 'Game Over!';

/*-------------------------------- Variables --------------------------------*/

let guessedLetters = new Set();
let maxMistakes = hangmanBodyParts.length;
let wrongGuessesCount = 0;
let secretWord = '';
let currentLevel = 0;

/*------------------------ Cached Element References ------------------------*/

const wordDisplayEl = document.querySelector('#wordDisplay');
const messageEl = document.querySelector('#message');
const bodyPartsEls = hangmanBodyParts.map(part => document.querySelector(`#${part}`));
const tryAgainBtn = document.querySelector('#tryAgain');
const revealWordBtn = document.querySelector('#reveal');
const nextLevelBtn = document.querySelector('#nextLevel');
const letterButtonsEl = document.querySelector('#letterButtons');
const wrongSoundEl = document.querySelector('#wrongSound');
const levelCounterEl = document.querySelector('#levelCounter');

/*-------------------------------- Functions --------------------------------*/

// Updates the level counter display (1-indexed for the player)
function renderLevelCounter() {
  levelCounterEl.textContent = `Level ${currentLevel + 1} of ${wordLevels.length}`;
}

// Selects a random word from the current level's word list
function pickWord() {
  const currentWordList = wordLevels[currentLevel];
  secretWord = currentWordList[Math.floor(Math.random() * currentWordList.length)];
}

function handleWrongGuess() {
  wrongGuessesCount += 1;
  revealNextBodyPart();
}

function revealNextBodyPart() {
  const partEl = bodyPartsEls[wrongGuessesCount - 1];
  if (partEl) partEl.setAttribute('visibility', 'visible');
}

// Builds the word display by checking each letter against guessedLetters
function renderWordDisplay() {
  const revealedLetters = [];

  for (const letter of secretWord) {
    if (guessedLetters.has(letter)) {
      revealedLetters.push(letter);
    } else {
      revealedLetters.push('_');
    }
  }

  wordDisplayEl.textContent = revealedLetters.join(' ');
}

// Checks if every letter in secretWord has been guessed
function checkWin() {
  const isWordComplete = secretWord
    .split('')
    .every(letter => guessedLetters.has(letter));

  if (isWordComplete) {
    messageEl.textContent = winMessage;
    disableLetterButtons();
    nextLevelBtn.disabled = false;
  }
}

// Checks if the player has run out of allowed mistakes
function checkLose() {
  if (wrongGuessesCount >= maxMistakes) {
    messageEl.textContent = loseMessage;
    disableLetterButtons();
    nextLevelBtn.disabled = true;
    wrongSoundEl.currentTime = 0;
    wrongSoundEl.play();
  }
}

// Prevents further guesses once the game has ended
function disableLetterButtons() {
  const allLetterBtns = letterButtonsEl.querySelectorAll('.letterBtn');
  allLetterBtns.forEach(btn => btn.disabled = true);
}

// Resets shared game state (used by both Try Again and Next Level)
function resetBoard() {
  guessedLetters.clear();
  wrongGuessesCount = 0;
  secretWord = '';
  messageEl.textContent = '';

  pickWord();
  renderWordDisplay();
  renderLevelCounter();
  bodyPartsEls.forEach(part => part.setAttribute('visibility', 'hidden'));

  const allLetterBtns = letterButtonsEl.querySelectorAll('.letterBtn');
  allLetterBtns.forEach(btn => btn.disabled = false);

  nextLevelBtn.disabled = true;
}

// Checks a guessed letter against the secret word
// and updates the game accordingly
// Also greys out the button for the guessed letter
function processGuess(guessedLetter) {
  if (guessedLetters.has(guessedLetter)) return;

  guessedLetters.add(guessedLetter);

  if (secretWord.includes(guessedLetter)) {
    renderWordDisplay();
    checkWin();
    disableButton(event.target);
  } else {
    handleWrongGuess();
    disableButton(event.target);
    checkLose();
  }
}

// Greys out a single button once it's been clicked
function disableButton(buttonEl) {
  buttonEl.disabled = true;
}

/*----------------------------- Event Listeners -----------------------------*/

// Listens for clicks on letter buttons and passes the
// clicked letter to processGuess
letterButtonsEl.addEventListener('click', function (event) {
  if (!event.target.classList.contains('letterBtn')) return;
  const guessedLetter = event.target.textContent;
  processGuess(guessedLetter);
});

// Event listener for the Reveal Word button
revealWordBtn.addEventListener('click', function () {
  wordDisplayEl.textContent = secretWord.split('').join(' ');
});

// Try Again resets the entire game back to Level 1
tryAgainBtn.addEventListener('click', function () {
  currentLevel = 0;
  resetBoard();
});

// Next Level advances to the next word list, if one exists
nextLevelBtn.addEventListener('click', function () {
  if (currentLevel < wordLevels.length - 1) {
    currentLevel += 1;
    resetBoard();
  } else {
    messageEl.textContent = "You've completed the final level!";
  }
});

/*----------------------------- Game Start -----------------------------*/

// Starts the game by picking a word and rendering the initial blank display
pickWord();
renderWordDisplay();
renderLevelCounter();
nextLevelBtn.disabled = true;