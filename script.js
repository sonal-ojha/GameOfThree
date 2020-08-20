// constants
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

const name = prompt("Please enter your name to start the game ?");
socket.emit("new-user", name);

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
const generateSystemNumber = () => {
  const initialNumber = currentNumber;
  const { newVal, operation } = getOperationTypeAndValue(currentNumber);
  currentNumber = newVal;
  // Append Text based on operation selection made by System
  const elm = createMessage(operation, initialNumber, currentNumber, false);
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
  // If current selection of operation type by player leads to Non Whole number: suggest player about the selection of operation type to Win
  const { operation } = getOperationTypeAndValue(currentNumber);
  setFocusForOperationType(operation);
  // END the process - as the selection of operation leads to Decimal number
  // displayResults(LOST_TEXT);
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
  // To Suggest player about the selection of operation type to Win
  const { operation } = getOperationTypeAndValue(currentNumber);
  setFocusForOperationType(operation);
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
  // To Suggest player about the selection of operation type to Win
  const { operation } = getOperationTypeAndValue(currentNumber);
  setFocusForOperationType(operation);
});
// - Adding Events Logic ends

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

socket.on("user-disconnected", name => {
  displayResults(`Sorry ${name}, We lost the connection!!`);
});

// const LOST_TEXT =
//   "Sorry, you Loose!! As the result of operation is NOT a whole number";