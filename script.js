const API_URL = "https://script.google.com/macros/s/AKfycby1X8u3a62YpsoaED5_GZiGnE-sSxWCjfGL9yyCEQTTXRmgz1BQJsVfGvnVXCZY6nw/exec";

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const resultEl = document.getElementById("result");

let currentQuestion = null;

async function loadQuestion() {
  try {
    const response = await fetch(`${API_URL}?action=question`);
    const data = await response.json();

    if (!data.success) {
      questionEl.textContent = "Failed to load question.";
      return;
    }

    currentQuestion = data.question;
    renderQuestion(currentQuestion);
  } catch (error) {
    console.error(error);
    questionEl.textContent = "Error loading question.";
  }
}

function renderQuestion(questionData) {
  resultEl.className = "result hidden";
  resultEl.textContent = "";
  answersEl.innerHTML = "";

  questionEl.textContent = questionData.text;

  questionData.answers.forEach(answer => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.textContent = answer;
    button.addEventListener("click", () => submitAnswer(answer));
    answersEl.appendChild(button);
  });
}

async function submitAnswer(answer) {
  if (!currentQuestion) return;

  const buttons = document.querySelectorAll(".answer-btn");
  buttons.forEach(button => {
    button.disabled = true;
  });

  try {
    const url = `${API_URL}?action=answer&id=${encodeURIComponent(currentQuestion.id)}&answer=${encodeURIComponent(answer)}`;
    const response = await fetch(url);
    const data = await response.json();

    resultEl.classList.remove("hidden");

    if (!data.success) {
      resultEl.textContent = "Error checking answer.";
      resultEl.className = "result wrong";
      return;
    }

    if (data.result === "correct") {
      resultEl.textContent = "CORRECT";
      resultEl.className = "result correct";
    } else {
      resultEl.textContent = "Sorry, you got the answer wrong";
      resultEl.className = "result wrong";
    }
  } catch (error) {
    console.error(error);
    resultEl.textContent = "Error submitting answer.";
    resultEl.className = "result wrong";
    resultEl.classList.remove("hidden");
  }
}

loadQuestion();
