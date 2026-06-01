const countries = [
  ["Afghanistan", ["Kabul"]],
  ["Albanien", ["Tirana"]],
  ["Algerien", ["Algier"]],
  ["Andorra", ["Andorra la Vella"]],
  ["Argentinien", ["Buenos Aires"]],
  ["Armenien", ["Eriwan"]],
  ["Australien", ["Canberra"]],
  ["Belgien", ["Brüssel"]],
  ["Bolivien", ["Sucre", "La Paz"]],
  ["Brasilien", ["Brasilia", "Brasília"]],
  ["Bulgarien", ["Sofia"]],
  ["Chile", ["Santiago", "Santiago de Chile"]],
  ["China", ["Peking", "Beijing"]],
  ["Dänemark", ["Kopenhagen"]],
  ["Deutschland", ["Berlin"]],
  ["Frankreich", ["Paris"]],
  ["Griechenland", ["Athen"]],
  ["Indien", ["Neu-Delhi", "New Delhi"]],
  ["Irland", ["Dublin"]],
  ["Island", ["Reykjavik", "Reykjavík"]],
  ["Italien", ["Rom"]],
  ["Japan", ["Tokio", "Tokyo"]],
  ["Kanada", ["Ottawa"]],
  ["Kroatien", ["Zagreb"]],
  ["Luxemburg", ["Luxemburg"]],
  ["Marokko", ["Rabat"]],
  ["Mexiko", ["Mexiko-Stadt", "Mexico City"]],
  ["Niederlande", ["Amsterdam"]],
  ["Norwegen", ["Oslo"]],
  ["Österreich", ["Wien"]],
  ["Polen", ["Warschau"]],
  ["Portugal", ["Lissabon"]],
  ["Rumänien", ["Bukarest"]],
  ["Russland", ["Moskau"]],
  ["Schweden", ["Stockholm"]],
  ["Schweiz", ["Bern"]],
  ["Serbien", ["Belgrad"]],
  ["Slowakei", ["Bratislava"]],
  ["Slowenien", ["Ljubljana"]],
  ["Spanien", ["Madrid"]],
  ["Südafrika", ["Pretoria", "Kapstadt", "Bloemfontein"]],
  ["Südkorea", ["Seoul"]],
  ["Tschechien", ["Prag"]],
  ["Türkei", ["Ankara"]],
  ["Ukraine", ["Kiew", "Kyiv"]],
  ["Ungarn", ["Budapest"]],
  ["Vereinigtes Königreich", ["London"]],
  ["Vereinigte Staaten", ["Washington", "Washington D.C.", "Washington DC"]],
];

const questionEl = document.querySelector("#question");
const scoreEl = document.querySelector("#score");
const progressEl = document.querySelector("#progress");
const feedbackEl = document.querySelector("#feedback");
const answerInput = document.querySelector("#answerInput");
const checkButton = document.querySelector("#checkButton");
const nextButton = document.querySelector("#nextButton");
const restartButton = document.querySelector("#restartButton");
const modeButton = document.querySelector("#modeButton");
const textMode = document.querySelector("#textMode");
const choiceGrid = document.querySelector("#choiceGrid");

let score = 0;
let round = 0;
let current = null;
let multipleChoice = false;
let usedQuestions = new Set();

function normalize(value) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\./g, "")
    .replace(/\s+/g, " ");
}

function pickQuestion() {
  if (usedQuestions.size === countries.length) {
    usedQuestions.clear();
  }

  let index;
  do {
    index = Math.floor(Math.random() * countries.length);
  } while (usedQuestions.has(index));

  usedQuestions.add(index);
  return countries[index];
}

function renderQuestion() {
  current = pickQuestion();
  round += 1;
  questionEl.textContent = `Was ist die Hauptstadt von ${current[0]}?`;
  scoreEl.textContent = `Punkte: ${score}`;
  progressEl.textContent = `Frage ${round}`;
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  answerInput.value = "";
  nextButton.disabled = true;

  if (multipleChoice) {
    renderChoices();
  } else {
    textMode.classList.remove("is-hidden");
    choiceGrid.classList.add("is-hidden");
    answerInput.focus();
  }
}

function renderChoices() {
  textMode.classList.add("is-hidden");
  choiceGrid.classList.remove("is-hidden");
  choiceGrid.innerHTML = "";

  const correctAnswer = current[1][0];
  const options = new Set([correctAnswer]);

  while (options.size < 4) {
    const option = countries[Math.floor(Math.random() * countries.length)][1][0];
    options.add(option);
  }

  [...options]
    .sort(() => Math.random() - 0.5)
    .forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option;
      button.addEventListener("click", () => checkChoice(button, option));
      choiceGrid.appendChild(button);
    });
}

function setFeedback(text, type) {
  feedbackEl.textContent = text;
  feedbackEl.className = `feedback ${type}`;
}

function acceptAnswer(value) {
  const answer = normalize(value);
  return current[1].some((accepted) => normalize(accepted) === answer);
}

function checkTextAnswer() {
  if (!answerInput.value.trim()) {
    setFeedback("Gib zuerst eine Antwort ein.", "bad");
    return;
  }

  if (acceptAnswer(answerInput.value)) {
    score += 1;
    scoreEl.textContent = `Punkte: ${score}`;
    setFeedback("Richtig.", "good");
    nextButton.disabled = false;
  } else {
    setFeedback(`Falsch. Richtige Antwort: ${current[1][0]}`, "bad");
    nextButton.disabled = false;
  }
}

function checkChoice(button, option) {
  const buttons = [...choiceGrid.querySelectorAll("button")];
  buttons.forEach((item) => {
    item.disabled = true;
    if (acceptAnswer(item.textContent)) {
      item.classList.add("correct");
    }
  });

  if (acceptAnswer(option)) {
    score += 1;
    scoreEl.textContent = `Punkte: ${score}`;
    setFeedback("Richtig.", "good");
  } else {
    button.classList.add("wrong");
    setFeedback(`Falsch. Richtige Antwort: ${current[1][0]}`, "bad");
  }

  nextButton.disabled = false;
}

function toggleMode() {
  multipleChoice = !multipleChoice;
  modeButton.textContent = multipleChoice ? "Modus: Multiple Choice" : "Modus: Texteingabe";
  renderQuestion();
}

function restartQuiz() {
  score = 0;
  round = 0;
  usedQuestions = new Set();
  renderQuestion();
}

checkButton.addEventListener("click", checkTextAnswer);
nextButton.addEventListener("click", renderQuestion);
restartButton.addEventListener("click", restartQuiz);
modeButton.addEventListener("click", toggleMode);
answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkTextAnswer();
  }
});

renderQuestion();
