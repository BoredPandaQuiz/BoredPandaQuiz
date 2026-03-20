const API_URL = "https://script.google.com/macros/s/AKfycbwrsGq02Jw5Jr5wLurNZnMUu_l2L5--9SUuK5ZhH1llWvi50eCYHw1P7WwrGfAM9PM/exec";

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const resultEl = document.getElementById("result");
const detailsEl = document.getElementById("details");
const nextBtn = document.getElementById("nextBtn");

let currentQuestion = null;

async function loadQuestion() {
  resultEl.className = "result hidden";
  resultEl.textContent = "";
  detailsEl.className = "details hidden";
  detailsEl.innerHTML = "";
  nextBtn.classList.add("hidden");
  answersEl.innerHTML = "";
  questionEl.textContent = "Loading question...";

  try {
    const url = `${API_URL}?action=question`;
    const response = await fetch(url, {
      method: "GET"
    });

    const data = await response.json();

    if (!data.success) {
      questionEl.textContent = "Failed to load question.";
      return;
    }

    currentQuestion = data.question;
    questionEl.textContent = currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
      const button = document.createElement("button");
      button.className = "answer-btn";
      button.textContent = answer;
      button.addEventListener("click", () => submitAnswer(answer));
      answersEl.appendChild(button);
    });
  } catch (error) {
    console.error(error);
    questionEl.textContent = "Error loading question.";
  }
}

async function submitAnswer(answer) {
  if (!currentQuestion) return;

  const buttons = document.querySelectorAll(".answer-btn");
  buttons.forEach(button => {
    button.disabled = true;
  });

  try {
    const url =
      `${API_URL}?action=answer&id=${encodeURIComponent(currentQuestion.id)}&answer=${encodeURIComponent(answer)}`;

    const response = await fetch(url, {
      method: "GET"
    });

    const data = await response.json();

    if (!data.success) {
      resultEl.textContent = "Error checking answer.";
      resultEl.className = "result wrong";
      detailsEl.className = "details hidden";
      nextBtn.classList.remove("hidden");
      return;
    }

    resultEl.classList.remove("hidden");

    if (data.result === "correct") {
      resultEl.textContent = "CORRECT";
      resultEl.className = "result correct";
      detailsEl.className = "details hidden";
      detailsEl.innerHTML = "";
    } else {
      resultEl.textContent = "Sorry, you got the answer wrong";
      resultEl.className = "result wrong";
      detailsEl.classList.remove("hidden");
      detailsEl.innerHTML = `
        <p><strong>Question:</strong> ${escapeHtml(data.question)}</p>
        <p><strong>Your answer:</strong> ${escapeHtml(data.chosenAnswer)}</p>
        <p><strong>Correct answer:</strong> ${escapeHtml(data.correctAnswer)}</p>
      `;
    }

    nextBtn.classList.remove("hidden");
  } catch (error) {
    console.error(error);
    resultEl.textContent = "Error submitting answer.";
    resultEl.className = "result wrong";
    resultEl.classList.remove("hidden");
    nextBtn.classList.remove("hidden");
  }
}

function escapeHtml(text) {
  if (text === null || text === undefined) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

nextBtn.addEventListener("click", loadQuestion);

loadQuestion();
