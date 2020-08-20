// constants
const LOST_TEXT =
  "Sorry, you Loose!! As the result of operation is NOT a whole number";
const WIN_TEXT = "Yayy!! You Won. Congratulations!!";

// link to server running on port 3000
const socket = io("http://localhost:3000");

const messageContainer = document.getElementById("message-container");
const player = document.getElementById("player");
const resultContainer = document.getElementById("result-container");
const result = document.getElementById("result");

// Buttons -1, 0 and 1
const btnInputNegativeOne = document.getElementById("btn--1");
const btnInputZero = document.getElementById("btn-0");
const btnInputPositiveOne = document.getElementById("btn-1");

const randomNumber = document.getElementById("random-num").textContent;

let currentNumber = randomNumber;

// Display 'You Won or Lost' to the player
const hasReachedTheEndPoint = number => number == 1;

const displayResults = text => {
  resultContainer.classList.add("display-result");
  result.innerText = text;
};

const name = prompt("What is your name?");
socket.emit("new-user", name);

// system logic for three-code
const generateSystemNumber = () => {
  const initialNumber = currentNumber;
  let operationTyp = "-1";
  // Operation '0'
  if (currentNumber % 3 === 0) {
    currentNumber = currentNumber / 3;
    operationTyp = "+0";
  } else if ((currentNumber + 1) % 3 === 0) { // Operation '+1'
    currentNumber = (currentNumber + 1) / 3;
    operationTyp = "+1";
  } else {  // Operation '-1'
    currentNumber = (currentNumber - 1) / 3;
  }
  // Append Text based on operation selection made by System
  const elm = createMessage(operationTyp, initialNumber, currentNumber, false);
  appendMessage(elm);
  if (hasReachedTheEndPoint(currentNumber)) {
    displayResults(WIN_TEXT);
  }
};

// Decide to Progress/End in game
const makeDecisionToProgress = () => {
  if (hasReachedTheEndPoint(currentNumber)) {
    displayResults(WIN_TEXT);
    return;
  }
  generateSystemNumber();
};

// player connection established
socket.on("user-connected", name => {
  player.innerText = `Welcome ${name}!`;
});

// Add Click events to all three buttons
// -1, 0 and 1
btnInputNegativeOne.addEventListener("click", e => {
  const initialNumber = currentNumber;
  if ((Number(currentNumber) - 1) % 3 === 0) {
    currentNumber = (Number(currentNumber) - 1) / 3;
    const elm = createMessage("-1", initialNumber, currentNumber);
    appendMessage(elm);
    makeDecisionToProgress();
    return;
  }
  // END the process - as the selection of operation leads to Decimal number
  displayResults(LOST_TEXT);
});

btnInputZero.addEventListener("click", e => {
  const initialNumber = currentNumber;
  if (Number(currentNumber) % 3 === 0) {
    currentNumber = Number(currentNumber) / 3;
    const elm = createMessage("+0", initialNumber, currentNumber);
    appendMessage(elm);
    makeDecisionToProgress();
    return;
  }
  // END the process - as the selection of operation leads to Decimal number
  displayResults(LOST_TEXT);
});

btnInputPositiveOne.addEventListener("click", e => {
  const initialNumber = currentNumber;
  if ((Number(currentNumber) + 1) % 3 === 0) {
    currentNumber = (Number(currentNumber) + 1) / 3;
    const elm = createMessage("+1", initialNumber, currentNumber);
    appendMessage(elm);
    makeDecisionToProgress();
    return;
  }
  // END the process - as the selection of operation leads to Decimal number
  displayResults(LOST_TEXT);
});
// - Adding Events Logic ends

function createMessage(operationTyp, initialNumber, currentNumber, isPlayer = true) {
  const messageElement = document.createElement("div");
  const operationElement = document.createElement("button");
  const textElement = document.createElement("div");
  operationElement.innerText = operationTyp;
  operationElement.classList.add('operation');
  messageElement.append(operationElement);
  const prefixText = isPlayer ? "You:" : "System:";
  textElement.innerText = `${prefixText} [(${initialNumber} ${operationTyp}) / 3] = ${currentNumber}`;
  messageElement.append(textElement);
  return messageElement;
}

function appendMessage(elm) {
  messageContainer.append(elm);
}

socket.on("user-disconnected", name => {
  displayResults(`Sorry ${name}, We lost the connection!!`)
});
