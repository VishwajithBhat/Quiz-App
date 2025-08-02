const questions = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: "Paris"
  },
  {
    question: "Which is the largest planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Jupiter"
  },
  {
    question: "What is H2O?",
    options: ["Hydrogen", "Oxygen", "Salt", "Water"],
    answer: "Water"
  },
  {
    question: "Author of 'To Kill a Mockingbird'?",
    options: ["Harper Lee", "Shakespeare", "Twain", "Austen"],
    answer: "Harper Lee"
  },
  {
    question: "Powerhouse of the cell?",
    options: ["Ribosome", "Mitochondria", "Nucleus", "Membrane"],
    answer: "Mitochondria"
  }
];

let currentQuestionIndex = 0;
let score = 0;

const quizContent = document.getElementById('quizContent');
const nextButton = document.getElementById('nextButton');
const toggle = document.getElementById('themeToggle');

// Load first question
document.addEventListener('DOMContentLoaded', () => {
  loadQuestion();
  nextButton.addEventListener('click', nextQuestion);
  toggle.addEventListener('change', toggleTheme);
});

function loadQuestion() {
  const q = questions[currentQuestionIndex];
  quizContent.innerHTML = `
    <h3>${q.question}</h3>
    <div class="options">
      ${q.options.map(opt => `<div class="option">${opt}</div>`).join('')}
    </div>
  `;
  document.querySelectorAll('.option').forEach(option =>
    option.addEventListener('click', selectOption));
}

function selectOption(e) {
  const selected = e.target;
  const answer = questions[currentQuestionIndex].answer;

  document.querySelectorAll('.option').forEach(opt => {
    opt.removeEventListener('click', selectOption);
    if (opt.textContent === answer) opt.classList.add('correct');
    else if (opt === selected) opt.classList.add('incorrect');
  });

  if (selected.textContent === answer) score++;
  nextButton.style.display = 'block';
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    loadQuestion();
    nextButton.style.display = 'none';
  } else {
    showResult();
  }
}

function showResult() {
  quizContent.innerHTML = `
    <h2>Your Score: ${score}/${questions.length}</h2>
    <button id="restartBtn">Restart Quiz</button>
  `;
const restartBtn = document.getElementById('restartBtn');
restartBtn.style.display = 'block';
nextButton.style.display = 'none';
document.getElementById('restartBtn').addEventListener('click', restartQuiz);
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  loadQuestion();
  nextButton.style.display = 'none';
}

// Dark Mode
function toggleTheme() {
  document.body.classList.toggle('dark');
}
