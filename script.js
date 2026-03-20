const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const resultEl = document.getElementById("result");

let currentQuestion = null;

function loadQuestion() {
  if (!Array.isArray(QUESTIONS) || QUESTIONS.length === 0) {
    questionEl.textContent = "No questions found.";
    return;
  }

  currentQuestion = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
  renderQuestion(currentQuestion);
}

function renderQuestion(questionData) {
  resultEl.className = "result hidden";
  resultEl.textContent = "";
  answersEl.innerHTML = "";

  questionEl.textContent = questionData.question;

  const shuffledAnswers = [...questionData.answers];
  shuffleArray(shuffledAnswers);

  shuffledAnswers.forEach(answer => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.textContent = answer;
    button.addEventListener("click", () => handleAnswer(answer));
    answersEl.appendChild(button);
  });
}

function handleAnswer(selectedAnswer) {
  if (!currentQuestion) return;

  const buttons = document.querySelectorAll(".answer-btn");
  buttons.forEach(button => {
    button.disabled = true;
  });

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  resultEl.classList.remove("hidden");

  if (isCorrect) {
    resultEl.textContent = "CORRECT";
    resultEl.className = "result correct";
  } else {
    resultEl.textContent = "Sorry, you got the answer wrong";
    resultEl.className = "result wrong";
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

loadQuestion();
