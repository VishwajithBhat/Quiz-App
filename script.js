/**
 * Quiz Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration & State ---
    const TOTAL_QUESTIONS = 10;
    const TIME_PER_QUESTION = 15;
    
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timerInterval;
    let timeLeft = TIME_PER_QUESTION;
    let isReviewing = false; // Prevent multiple clicks
    
    // --- DOM Elements ---
    // Screens
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');
    
    // Buttons
    const startBtn = document.getElementById('start-btn');
    const nextBtn = document.getElementById('next-btn');
    const restartBtn = document.getElementById('restart-btn');
    const homeBtn = document.getElementById('home-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const highScoresBtn = document.getElementById('highscores-btn');
    const closeModalBtn = document.getElementById('close-modal');
    const clearScoresBtn = document.getElementById('clear-scores');
    
    // Quiz Elements
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const progressFill = document.getElementById('progress-bar-fill');
    const questionCount = document.getElementById('question-count');
    const scoreDisplay = document.getElementById('score-display');
    const timerText = document.getElementById('timer-text');
    const timerCircle = document.getElementById('timer-ring-circle');
    const feedbackContainer = document.getElementById('feedback-container');
    const feedbackText = document.getElementById('feedback-text');
    const explanationText = document.getElementById('explanation-text');
    
    // Result Elements
    const finalScoreValue = document.getElementById('final-score-value');
    const resultMessage = document.getElementById('result-message');
    const statCorrect = document.getElementById('stat-correct');
    const statWrong = document.getElementById('stat-wrong');
    const statTime = document.getElementById('stat-time'); // Total time? Or maybe just removing this stat if not tracking total time accurately
    
    // Modal
    const modal = document.getElementById('highscores-modal');
    const scoresList = document.getElementById('highscores-list');

    // --- Initialization ---
    init();

    function init() {
        loadTheme();
        loadQuestions();
        attachEventListeners();
    }

    async function loadQuestions() {
        try {
            const response = await fetch('questions.json');
            const data = await response.json();
            // Shuffle and pick 10 if more exist, or just use what's there
            questions = shuffleArray(data).slice(0, TOTAL_QUESTIONS);
        } catch (error) {
            console.error('Failed to load questions:', error);
            questionText.textContent = "Error loading questions. Please ensure questions.json exists.";
        }
    }

    function attachEventListeners() {
        startBtn.addEventListener('click', startQuiz);
        nextBtn.addEventListener('click', handleNextQuestion);
        restartBtn.addEventListener('click', startQuiz); // Restart instantly
        homeBtn.addEventListener('click', showHome);
        
        themeToggle.addEventListener('click', toggleTheme);
        
        highScoresBtn.addEventListener('click', showHighScores);
        closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
        clearScoresBtn.addEventListener('click', clearHighScores);
        
        // Close modal on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }

    // --- State Management ---
    function switchScreen(screenOn) {
        [startScreen, quizScreen, resultScreen].forEach(s => s.classList.add('hidden'));
        screenOn.classList.remove('hidden');
    }

    function startQuiz() {
        if (questions.length === 0) {
            loadQuestions().then(() => {
                if(questions.length > 0) startQuiz();
            });
            return;
        }

        currentQuestionIndex = 0;
        score = 0;
        switchScreen(quizScreen);
        renderQuestion();
    }

    function showHome() {
        switchScreen(startScreen);
    }

    // --- Quiz Logic ---
    function renderQuestion() {
        isReviewing = false;
        const q = questions[currentQuestionIndex];
        
        // UI Updates
        questionText.textContent = q.question;
        questionCount.textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;
        scoreDisplay.textContent = `Score: ${score}`;
        
        // Progress Bar
        const progress = ((currentQuestionIndex) / questions.length) * 100;
        progressFill.style.width = `${progress}%`;
        
        // Options
        optionsContainer.innerHTML = '';
        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.dataset.index = index;
            btn.addEventListener('click', () => handleAnswer(index));
            optionsContainer.appendChild(btn);
        });

        // Reset UI Components
        feedbackContainer.classList.add('hidden');
        nextBtn.classList.add('hidden');
        
        // Timer Reset
        startTimer();
    }

    function handleAnswer(selectedIndex) {
        if (isReviewing) return;
        isReviewing = true;
        clearInterval(timerInterval);

        const currentQ = questions[currentQuestionIndex];
        const isCorrect = selectedIndex === currentQ.answer;
        const options = optionsContainer.children;

        // Highlight selected and correct
        options[selectedIndex].classList.add(isCorrect ? 'correct' : 'wrong');
        
        if (!isCorrect) {
            // Show correct answer if wrong
            if (options[currentQ.answer]) {
                options[currentQ.answer].classList.add('correct');
            }
        } else {
            score += 10;
            scoreDisplay.textContent = `Score: ${score}`;
        }

        // Disable all buttons
        Array.from(options).forEach(btn => btn.disabled = true);

        // Show Feedback
        feedbackContainer.classList.remove('hidden');
        feedbackText.textContent = isCorrect ? "Correct! 🎉" : "Incorrect 😔";
        feedbackText.style.color = isCorrect ? "var(--success-color)" : "var(--error-color)";
        explanationText.textContent = currentQ.explanation;

        // Show Next Button
        nextBtn.classList.remove('hidden');
    }

    function handleNextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            renderQuestion();
        } else {
            endQuiz();
        }
    }

    function endQuiz() {
        clearInterval(timerInterval);
        switchScreen(resultScreen);
        
        // Populate Result Data
        finalScoreValue.textContent = score;
        const maxScore = questions.length * 10;
        const percentage = (score / maxScore) * 100;
        
        // correct count = score / 10
        const correctCount = score / 10;
        const wrongCount = questions.length - correctCount;
        
        statCorrect.textContent = correctCount;
        statWrong.textContent = wrongCount;
        statTime.textContent = 'Done'; // Simplified for now

        if (percentage >= 80) resultMessage.textContent = "Excellent work! 🌟";
        else if (percentage >= 50) resultMessage.textContent = "Good effort! 👍";
        else resultMessage.textContent = "Keep practicing! 💪";

        saveScore(score, maxScore);
        
        // Fill progress bar to 100 on end
        progressFill.style.width = '100%';
    }

    // --- Timer Logic ---
    function startTimer() {
        timeLeft = TIME_PER_QUESTION;
        updateTimerUI();
        clearInterval(timerInterval);
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerUI();
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                handleTimeOut();
            }
        }, 1000);
    }

    function updateTimerUI() {
        timerText.textContent = timeLeft;
        // Circle progress
        // Circumference is ~163 (2 * PI * 26)
        const circumference = 163;
        const offset = circumference - (timeLeft / TIME_PER_QUESTION) * circumference;
        timerCircle.style.strokeDashoffset = offset;
        
        // Warn color
        if (timeLeft <= 5) {
            timerCircle.style.stroke = "var(--error-color)";
        } else {
            timerCircle.style.stroke = "var(--primary-color)";
        }
    }

    function handleTimeOut() {
        if (isReviewing) return;
        isReviewing = true;
        
        // Auto-select nothing? Or just show failure
        const currentQ = questions[currentQuestionIndex];
        const options = optionsContainer.children;
        
        // Show correct answer
        if (options[currentQ.answer]) {
            options[currentQ.answer].classList.add('correct');
        }
        
        // Disable buttons
        Array.from(options).forEach(btn => btn.disabled = true);
        
        feedbackContainer.classList.remove('hidden');
        feedbackText.textContent = "Time's Up! ⏰";
        feedbackText.style.color = "var(--error-color)";
        explanationText.textContent = currentQ.explanation;
        
        nextBtn.classList.remove('hidden');
    }

    // --- Utils & Storage ---
    function shuffleArray(array) {
        // Simple Fisher-Yates shuffle
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('quiz-theme', newTheme);
        
        // Update icon
        const icon = themeToggle.querySelector('.theme-icon');
        icon.textContent = newTheme === 'light' ? '🌙' : '☀️';
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem('quiz-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        const icon = themeToggle.querySelector('.theme-icon');
        icon.textContent = savedTheme === 'light' ? '🌙' : '☀️';
    }

    function saveScore(score, total) {
        const scores = JSON.parse(localStorage.getItem('quiz-highscores') || '[]');
        const date = new Date().toLocaleDateString();
        
        scores.push({ score, total, date });
        scores.sort((a, b) => b.score - a.score);
        
        // Keep top 5
        const top5 = scores.slice(0, 5);
        localStorage.setItem('quiz-highscores', JSON.stringify(top5));
    }

    function showHighScores() {
        const scores = JSON.parse(localStorage.getItem('quiz-highscores') || '[]');
        scoresList.innerHTML = scores.length 
            ? scores.map((s, i) => `
                <li>
                    <span>#${i+1} ${s.date}</span>
                    <strong>${s.score}/${s.total}</strong>
                </li>`).join('') 
            : '<li style="text-align:center;color:var(--text-secondary)">No scores yet!</li>';
            
        modal.classList.remove('hidden');
    }

    function clearHighScores() {
        localStorage.removeItem('quiz-highscores');
        showHighScores();
    }
});
