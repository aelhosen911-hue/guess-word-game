let gameName = "Guess The Words";
document.title = gameName;
document.getElementById("header").innerHTML = gameName;

let numOfAttempts = 5;
let numOfLetters = 5;
let currentTry = 1;
let numOfHints = 2;
let guessedWord = "";

const words = [
  "APPLE",
  "BREAD",
  "CLOUD",
  "DREAM",
  "EARTH",
  "FRUIT",
  "GRAPE",
  "HOUSE",
  "LIGHT",
  "MUSIC",
  "PHONE",
  "PILOT",
  "PLANT",
  "SPACE",
  "WATER",
  "BRAIN",
  "SMILE",
  "TABLE",
  "TIGER",
  "WORLD",
  "LEARN",
  "FOUND",
  "STORE",
  "THINK",
  "WATCH",
];

let wordToGuess = words[Math.floor(Math.random() * words.length)].toUpperCase();
console.log("عايز تغش ماشي يعم ");
console.log(wordToGuess);

const messageArea = document.querySelector(".message");
const hintsBtn = document.querySelector(".hints");
const checkBtn = document.querySelector(".check");

hintsBtn.innerHTML = `<span>${numOfHints}</span> Hint`;

function generateInput() {
  const inputContainer = document.querySelector(".inputs");
  for (let i = 1; i <= numOfAttempts; i++) {
    const attemptDiv = document.createElement("div");
    attemptDiv.classList.add(`attempt-${i}`);
    attemptDiv.innerHTML = `<span>Attempt ${i}</span>`;

    if (i !== 1) attemptDiv.classList.add("disabled-input");

    for (let j = 1; j <= numOfLetters; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `attempt-${i}-letter-${j}`;
      input.setAttribute("maxlength", "1");
      attemptDiv.appendChild(input);
    }
    inputContainer.appendChild(attemptDiv);
  }
  inputContainer.children[0].children[1].focus();

  const inputsInDiSDiv = document.querySelectorAll(".disabled-input input");
  inputsInDiSDiv.forEach((input) => (input.disabled = true));

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      const nextInput = inputs[index + 1];
      if (nextInput && inputs[index].value) nextInput.focus();
    });

    input.addEventListener("keyup", function (e) {
      const currentIndex = Array.from(inputs).indexOf(e.target);
      if (e.key === "ArrowRight") {
        const nextInput = currentIndex + 1;
        if (nextInput < inputs.length) inputs[nextInput].focus();
      }
      if (e.key === "ArrowLeft") {
        const prevInput = currentIndex - 1;
        if (prevInput >= 0) inputs[prevInput].focus();
      }
    });
  });
}

function handleCheck() {
  let successGuess = true;
  for (let i = 1; i <= numOfLetters; i++) {
    const inputField = document.querySelector(
      `#attempt-${currentTry}-letter-${i}`,
    );
    const letter = inputField.value.toUpperCase();
    const actualLetter = wordToGuess[i - 1];
    if (letter === actualLetter) {
      inputField.classList.add("yes-in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      inputField.classList.add("no-in-place");
      successGuess = false;
    } else {
      inputField.classList.add("not");
      successGuess = false;
    }
  }

  if (successGuess) {
    messageArea.innerHTML = `
        <div class="message-overlay">
            <div class="success">
                <h2>🎉Congrats, YOU WIN!</h2>
                <p>Excellent! The word was: <strong>${wordToGuess}</strong></p>
                <button class="play-again" onclick="window.location.reload()">Play Again</button>
            </div>
        </div>`;
  } else {
    document
      .querySelector(`.attempt-${currentTry}`)
      .classList.add("disabled-input");
    const currentTryInputs = document.querySelectorAll(
      `.attempt-${currentTry} input`,
    );
    currentTryInputs.forEach((input) => (input.disabled = true));

    currentTry++;

    const nextAttemptDiv = document.querySelector(`.attempt-${currentTry}`);

    if (nextAttemptDiv) {
      const nextTryInputs = document.querySelectorAll(
        `.attempt-${currentTry} input`,
      );
      nextTryInputs.forEach((input) => (input.disabled = false));
      nextAttemptDiv.classList.remove("disabled-input");
      let el = document.querySelector(`#attempt-${currentTry}-letter-1`);
      if (el) el.focus();
    } else {
      messageArea.innerHTML = `
            <div class="message-overlay">
                <div class="failure">
                    <h2>😞 Game Over!</h2>
                    <p>Better luck next time! The word was: <strong>${wordToGuess}</strong></p>
                    <button class="play-again" onclick="window.location.reload()">Play Again</button>
                </div>
            </div>`;
    }
  }
}

function getHint() {
  if (numOfHints > 0) {
    numOfHints--;
    hintsBtn.innerHTML = `<span>${numOfHints}</span> Hint`;
  }
  if (numOfHints === 0) {
    hintsBtn.disabled = true;
  }
  const enabledInputs = document.querySelectorAll("input:not([disabled])");
  const emptyEnabledInputs = Array.from(enabledInputs).filter(
    (input) => input.value === "",
  );
  if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
    const randomInput = emptyEnabledInputs[randomIndex];
    const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
    if (indexToFill !== -1) {
      randomInput.value = wordToGuess[indexToFill].toUpperCase();
    }
  }
}

function handleBackspace(e) {
  if (e.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled])");
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);
    if (currentIndex > 0) {
      const currentInput = inputs[currentIndex];
      const prevInput = inputs[currentIndex - 1];
      currentInput.value = "";
      prevInput.focus();
    }
  }
}

checkBtn.addEventListener("click", handleCheck);
hintsBtn.addEventListener("click", getHint);
document.addEventListener("keydown", handleBackspace);

window.onload = () => {
  generateInput();
};
