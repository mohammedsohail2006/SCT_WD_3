let questions = [
  {
    question: "What does CSS stand for?",
    answers: [
      { text: "Cascading Style Sheets", correct: true },
      { text: "Computer Style Sheet", correct: false },
      { text: "Creative Style System", correct: false },
      { text: "Colorful Style Sheet", correct: false }
    ]
  },
  {
    question: "Which is not a JS framework?",
    answers: [
      { text: "React", correct: false },
      { text: "Angular", correct: false },
      { text: "Laravel", correct: true },
      { text: "Vue", correct: false }
    ]
  },
  {
    question: "Which tag is used for JS?",
    answers: [
      { text: "<script>", correct: true },
      { text: "<js>", correct: false },
      { text: "<code>", correct: false },
      { text: "<javascript>", correct: false }
    ]
  }
];

// Shuffle questions
questions = questions.sort(() => Math.random() - 0.5);

let index = 0;
let score = 0;
let timeLeft = 10;
let timer;

const qEl = document.getElementById("question");
const aEl = document.getElementById("answers");
const nextBtn = document.getElementById("nextBtn");
const resultEl = document.getElementById("result");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const progressEl = document.getElementById("progress");

// Load question
function loadQuestion() {
  reset();
  startTimer();

  let q = questions[index];
  qEl.textContent = q.question;

  q.answers.forEach(ans => {
    let btn = document.createElement("button");
    btn.textContent = ans.text;
    btn.onclick = () => selectAnswer(btn, ans.correct);
    aEl.appendChild(btn);
  });

  progressEl.style.width = ((index / questions.length) * 100) + "%";
}

// Timer
function startTimer() {
  timeLeft = 10;
  timerEl.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft === 0) {
      clearInterval(timer);
      autoNext();
    }
  }, 1000);
}

// Reset state
function reset() {
  clearInterval(timer);
  nextBtn.style.display = "none";
  aEl.innerHTML = "";
}

// Select answer
function selectAnswer(btn, correct) {
  clearInterval(timer);

  let buttons = aEl.children;
  for (let b of buttons) b.disabled = true;

  if (correct) {
    btn.classList.add("correct");
    score++;
    scoreEl.textContent = "Score: " + score;
  } else {
    btn.classList.add("wrong");
  }

  nextBtn.style.display = "block";
}

// Auto next
function autoNext() {
  nextBtn.click();
}

// Next
nextBtn.onclick = () => {
  index++;

  if (index < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
};

// Result
function showResult() {
  clearInterval(timer);

  qEl.style.display = "none";
  aEl.style.display = "none";
  nextBtn.style.display = "none";

  let best = localStorage.getItem("bestScore") || 0;
  if (score > best) {
    localStorage.setItem("bestScore", score);
    best = score;
  }

  resultEl.classList.remove("hidden");
  resultEl.innerHTML = `
    <h2>Score: ${score}/${questions.length}</h2>
    <h3>Best: ${best}</h3>
    <button onclick="location.reload()">Play Again</button>
  `;
}

loadQuestion();