
/*-------------------------------- Constants --------------------------------*/

// Define constants for hangman body parts. (head, body, left arm, right arm, left leg, right leg)
const hangmanBodyParts = ['head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
// Define constant for "Try Again" button text.
const tryAgainsText = 'Try Again';
// Define constant for wordList
const wordList = ['JAVASCRIPT', 'PYTHON', 'HTML', 'LOOP'];
//Define constant for the message when the player wins or loses the game.
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
// Checks a guessed letter against the secret word 
// and updates the game accordingly

function processGuess(guessedLetter) {
  if (guessedLetters.has(guessedLetter)) return;

  guessedLetters.add(guessedLetter);

  if (secretWord.includes(guessedLetter)) {
    renderWordDisplay();
  } else {
    handleWrongGuess();
  }
}

/*----------------------------- Event Listeners -----------------------------*/

// Listens for clicks on letter buttons and passes the 
// clicked letter to processGuess

letterButtonsEl.addEventListener('click', function (event) {
  if (!event.target.classList.contains('letterBtn')) return;
  const guessedLetter = event.target.textContent;
  processGuess(guessedLetter);
});

/*----------------------------- Game Start -----------------------------*/

// Starts the game by picking a word and rendering the initial blank display
pickWord();
renderWordDisplay();

