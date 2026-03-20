const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const resultEl = document.getElementById("result");

const SESSION_KEY = "bp_quiz_current_question";
const ANSWER_KEY = "bp_quiz_selected_answer";
const RESULT_KEY = "bp_quiz_result";
const ANSWERED_KEY = "bp_quiz_answered";

let currentQuestion = null;

function loadQuestion() {
  if (!Array.isArray(QUESTIONS) || QUESTIONS.length === 0) {
    questionEl.textContent = "No questions found.";
    return;
  }

  const savedQuestionId = sessionStorage.getItem(SESSION_KEY);
  const savedAnswered = sessionStorage.getItem(ANSWERED_KEY) === "true";
  const savedResult = sessionStorage.getItem(RESULT_KEY);

  if (savedQuestionId) {
    const foundQuestion = QUESTIONS.find(q => q.id === savedQuestionId);
    if (foundQuestion) {
      currentQuestion = foundQuestion;
      renderQuestion(currentQuestion, savedAnswered, savedResult);
      return;
    }
  }

  currentQuestion = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];

  sessionStorage.setItem(SESSION_KEY, currentQuestion.id);
  sessionStorage.setItem(ANSWERED_KEY, "false");
  sessionStorage.removeItem(ANSWER_KEY);
  sessionStorage.removeItem(RESULT_KEY);

  renderQuestion(currentQuestion, false, null);
}

function renderQuestion(questionData, answered = false, savedResult = null) {
  resultEl.className = "result hidden";
  resultEl.textContent = "";
  answersEl.innerHTML = "";

  questionEl.textContent = questionData.question;

  const shuffledAnswers = [...questionData.answers];
  shuffleArrayWithSeed(shuffledAnswers, questionData.id);

  shuffledAnswers.forEach(answer => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.textContent = answer;

    if (answered) {
      button.disabled = true;
    } else {
      button.addEventListener("click", () => handleAnswer(answer));
    }

    answersEl.appendChild(button);
  });

  if (answered && savedResult) {
    resultEl.classList.remove("hidden");

    if (savedResult === "correct") {
      resultEl.textContent = "CORRECT";
      resultEl.className = "result correct";
    } else {
      resultEl.textContent = "Sorry, you got the answer wrong";
      resultEl.className = "result wrong";
    }
  }
}

function handleAnswer(selectedAnswer) {
  if (!currentQuestion) return;

  const buttons = document.querySelectorAll(".answer-btn");
  buttons.forEach(button => {
    button.disabled = true;
  });

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const result = isCorrect ? "correct" : "wrong";

  sessionStorage.setItem(ANSWER_KEY, selectedAnswer);
  sessionStorage.setItem(RESULT_KEY, result);
  sessionStorage.setItem(ANSWERED_KEY, "true");

  resultEl.classList.remove("hidden");

  if (isCorrect) {
    resultEl.textContent = "CORRECT";
    resultEl.className = "result correct";
  } else {
    resultEl.textContent = "Sorry, you got the answer wrong";
    resultEl.className = "result wrong";
  }
}

function shuffleArrayWithSeed(array, seed) {
  const random = seededRandom(String(seed));

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function seededRandom(seed) {
  let h = 0;

  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }

  return function () {
    h += 0x6D2B79F5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

loadQuestion();
