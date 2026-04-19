const baseQuestions = [
  {
    question: "HTML stands for?",
    answers: [
      { text: "Hyper Text Markup Language", correct: true },
      { text: "High Tech Machine", correct: false }
    ]
  },
  {
    question: "CSS is used for?",
    answers: [
      { text: "Styling", correct: true },
      { text: "Database", correct: false }
    ]
  },
  {
    question: "JavaScript is?",
    answers: [
      { text: "Programming Language", correct: true },
      { text: "Operating System", correct: false }
    ]
  }
];

let questions = [];
let index = 0;
let score = 0;
let timer;
let timeLeft;

const qEl = document.getElementById("question");
const aEl = document.getElementById("answers");
const nextBtn = document.getElementById("nextBtn");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const progressEl = document.getElementById("progress");
const resultEl = document.getElementById("result");
const leaderboardEl = document.getElementById("leaderboard");
const difficultyEl = document.getElementById("difficulty");
const themeToggle = document.getElementById("themeToggle");

const settings = {
  easy: 15,
  medium: 10,
  hard: 5
};

// Shuffle questions
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// Start quiz
function startQuiz() {
  questions = shuffle([...baseQuestions]);
  index = 0;
  score = 0;
  loadQuestion();
}

// Load question
function loadQuestion() {
  reset();

  let q = questions[index];
  qEl.textContent = q.question;

  q.answers.forEach(ans => {
    let btn = document.createElement("button");
    btn.textContent = ans.text;
    btn.onclick = () => selectAnswer(btn, ans.correct);
    aEl.appendChild(btn);
  });

  progressEl.style.width = (index / questions.length) * 100 + "%";
  startTimer();
}

// Timer
function startTimer() {
  timeLeft = settings[difficultyEl.value];
  timerEl.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) nextBtn.click();
  }, 1000);
}

// Reset
function reset() {
  clearInterval(timer);
  aEl.innerHTML = "";
  nextBtn.style.display = "none";
}

// Select answer
function selectAnswer(btn, correct) {
  clearInterval(timer);

  if (correct) {
    btn.classList.add("correct");
    score++;
  } else {
    btn.classList.add("wrong");
  }

  scoreEl.textContent = score;

  [...aEl.children].forEach(b => b.disabled = true);

  nextBtn.style.display = "block";
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

// Show result + leaderboard
function showResult() {
  clearInterval(timer);

  qEl.style.display = "none";
  aEl.style.display = "none";
  nextBtn.style.display = "none";

  let percent = Math.round((score / questions.length) * 100);

  // Save leaderboard
  let scores = JSON.parse(localStorage.getItem("scores")) || [];
  scores.push(percent);
  scores.sort((a, b) => b - a);
  scores = scores.slice(0, 5);
  localStorage.setItem("scores", JSON.stringify(scores));

  resultEl.classList.remove("hidden");
  resultEl.innerHTML = `
    <h2>Score: ${score}/${questions.length}</h2>
    <h3>${percent}%</h3>
    <button onclick="location.reload()">Play Again</button>
  `;

  showLeaderboard();
}

// Show leaderboard
function showLeaderboard() {
  let scores = JSON.parse(localStorage.getItem("scores")) || [];
  leaderboardEl.innerHTML = scores.map(s => `<li>${s}%</li>`).join("");
}

// Theme toggle
themeToggle.onclick = () => {
  document.body.classList.toggle("light");
};

// Start
startQuiz();
showLeaderboard();
