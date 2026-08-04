/*-------------------------------- Constants --------------------------------*/

// Define constants for hangman body parts. (head, body, left arm, right arm, left leg, right leg)
const hangmanBodyParts = ['head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
// Define constant for "Try Again" button text.
const tryAgainsText = 'Try Again';
// Define constant for wordList
const wordList = ['JAVASCRIPT', 'PYTHON', 'LOOP', 'REACT', 'FUNCTION','ARRAY', 'OBJECT'];
const winMessage = 'Congratulations! You guessed the word!';
const loseMessage = 'Game Over!';

/*-------------------------------- Variables --------------------------------*/

let guessedLetters = new Set();
let maxMistakes = hangmanBodyParts.length;
let wrongGuessesCount = 0;
let secretWord = '';

/*------------------------ Cached Element References ------------------------*/

const wordDisplayEl = document.querySelector('#wordDisplay');
const wrongGuessesEl = document.querySelector('#wrongGuesses');
const guessedLettersEl = document.querySelector('#guessedLetters');
const messageEl = document.querySelector('#message');
const bodyPartsEls = hangmanBodyParts.map(part => document.querySelector(`#${part}`));
const tryAgainBtn = document.querySelector('#tryAgain');
const revealWordBtn = document.querySelector('#reveal');
const letterButtonsEl = document.querySelector('#letterButtons');

/*-------------------------------- Functions --------------------------------*/

function pickWord() {
  secretWord = wordList[Math.floor(Math.random() * wordList.length)];
}

function handleWrongGuess() {
  wrongGuessesCount += 1;
  revealNextBodyPart();
}

function revealNextBodyPart() {
  const partEl = bodyPartsEls[wrongGuessesCount - 1];
  if (partEl) partEl.setAttribute('visibility', 'visible');
}

//show the blanks/letters
function renderWordDisplay() {
  wordDisplayEl.textContent = secretWord
    .split('')
    .map(letter => guessedLetters.has(letter) ? letter : '_')
    .join(' ');
}

// Checks if every letter in secretWord has been guessed
function checkWin() {
  const isWordComplete = secretWord
    .split('')
    .every(letter => guessedLetters.has(letter));

  if (isWordComplete) {
    messageEl.textContent = winMessage;
    disableLetterButtons();
  }
}

// Checks if the player has run out of allowed mistakes
function checkLose() {
  if (wrongGuessesCount >= maxMistakes) {
    messageEl.textContent = loseMessage;
    disableLetterButtons();
  }
}

// Prevents further guesses once the game has ended
function disableLetterButtons() {
  const allLetterBtns = letterButtonsEl.querySelectorAll('.letterBtn');
  allLetterBtns.forEach(btn => btn.disabled = true);
}

// Checks a guessed letter against the secret word
// and updates the game accordingly
function processGuess(guessedLetter) {
  if (guessedLetters.has(guessedLetter)) return;

  guessedLetters.add(guessedLetter);

  if (secretWord.includes(guessedLetter)) {
    renderWordDisplay();
    checkWin();
  } else {
    handleWrongGuess();
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
  messageEl.textContent = `The secret word was: ${secretWord}`;
});

// Try Again resets game state, clears message, hides body parts,
// and re-enables letter buttons
tryAgainBtn.addEventListener('click', function () {
  guessedLetters.clear();
  wrongGuessesCount = 0;
  secretWord = '';
  messageEl.textContent = '';

  pickWord();
  renderWordDisplay();
  bodyPartsEls.forEach(part => part.setAttribute('visibility', 'hidden'));

  const allLetterBtns = letterButtonsEl.querySelectorAll('.letterBtn');
  allLetterBtns.forEach(btn => btn.disabled = false);
});

/*----------------------------- Game Start -----------------------------*/

// Starts the game by picking a word and rendering the initial blank display
pickWord();
renderWordDisplay();