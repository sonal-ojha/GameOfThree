// constants
const WIN_TEXT = "Yayy!! You Won. Congratulations!!";

// link to server running on port 3000
const socket = io("http://localhost:3000");

const messageContainer = document.getElementById("message-container");
const player = document.getElementById("player");
const resultContainer = document.getElementById("result-container");
const result = document.getElementById("result");

const randomNum = document.getElementById('random-num');

// Buttons -1, 0 and 1
const btnInputNegativeOne = document.getElementById("btn--1");
const btnInputZero = document.getElementById("btn-0");
const btnInputPositiveOne = document.getElementById("btn-1");

// Restart Game over button
const btnRestartGame = document.getElementById("btn-restart");

// Display 'You Won or Lost' to the player
const hasReachedTheEndPoint = number => number == 1;

// Generate max - 2 digit random Whole Number
// May also return 0 & 1, as they are also Whole Numbers
const getRandomWholeNumber = () => Math.floor(Math.random() * 100);

const displayResults = text => {
  resultContainer.classList.add("display-result");
  result.innerText = text;
};

const name = prompt("Please enter your name to start the game ?");

// Indicate server about new player
socket.emit("new-user", { name, randomNumber: getRandomWholeNumber()});

const getOperationTypeAndValue = value => {
  let operation = "-1";
  let newVal;
  if (value % 3 === 0) {
    newVal = value / 3;
    operation = "+0";
  } else if ((value + 1) % 3 === 0) {
    // Operation '+1'
    newVal = (value + 1) / 3;
    operation = "+1";
  } else {
    // Operation '-1'
    newVal = (value - 1) / 3;
  }
  return { newVal, operation };
};

// system logic for three-code
const generateSystemNumber = currentValue => {
  const initialNumber = currentValue;
  const { newVal, operation } = getOperationTypeAndValue(currentValue);
  currentValue = newVal;
  // Append Text based on operation selection made by System
  const elm = createMessage(operation, initialNumber, currentValue, false);
  appendMessage(elm);
  // Emit to update system generated value in server
  socket.emit("system-input-value", currentValue);
  if (hasReachedTheEndPoint(currentValue)) {
    displayResults(WIN_TEXT);
  }
};

// Decide to Progress/End in game
const makeDecisionToProgress = currentValue => {
  if (hasReachedTheEndPoint(currentValue)) {
    displayResults(WIN_TEXT);
    return;
  }
  generateSystemNumber(currentValue);
};

// player connection established
socket.on("user-connected", ({ name, currentValue }) => {
  if (!!name) {
    player.innerText = `Welcome ${name}!`;
  }
  randomNum.innerText = currentValue;
});

// Add Click events to all three buttons
// -1, 0 and 1
btnInputNegativeOne.addEventListener("click", e => {
  socket.emit("user-input", '-1');
});

btnInputZero.addEventListener("click", e => {
  socket.emit("user-input", '+0');
});

btnInputPositiveOne.addEventListener("click", e => {
  socket.emit("user-input", '+1');
});
// - Adding Events Logic ends

// Refresh and Restart the Game
btnRestartGame.addEventListener("click", e => {
  window.location.reload();
});

function createMessage(
  operationTyp,
  initialNumber,
  currentNumber,
  isPlayer = true
) {
  const messageElement = document.createElement("div");
  const operationElement = document.createElement("button");
  const textElement = document.createElement("div");
  operationElement.innerText = operationTyp;
  operationElement.classList.add("operation");
  messageElement.append(operationElement);
  const prefixText = isPlayer ? "You:" : "System:";
  textElement.innerText = `${prefixText} [(${initialNumber} ${operationTyp}) / 3] = ${currentNumber}`;
  messageElement.append(textElement);
  return messageElement;
}

// Focus on specifc button for next selection to continue the game to Win
function setFocusForOperationType(operationType) {
  if (operationType === "-1") {
    btnInputNegativeOne.focus();
    return;
  } else if (operationType === "+0") {
    btnInputZero.focus();
    return;
  } else {
    btnInputPositiveOne.focus();
  }
}

function appendMessage(elm) {
  messageContainer.append(elm);
}

socket.on("user-input-calculated", ({ operation, currentValue, initialValue }) => {
  const elm = createMessage(operation, initialValue, currentValue);
  appendMessage(elm);
  makeDecisionToProgress(currentValue);
});

// If current selection of operation type by player leads to Non Whole number: suggest player about the selection of operation type to Win
socket.on("suggest-correct-operation", currentValue => {
  const { operation } = getOperationTypeAndValue(currentValue);
  setFocusForOperationType(operation);
});

socket.on("user-disconnected", name => {
  displayResults(`Sorry ${name}, We lost the connection!!`);
});
