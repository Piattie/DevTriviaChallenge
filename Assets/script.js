const startButton = document.getElementById('start-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const timerElement = document.getElementById('time');
const endScreenElement = document.getElementById('end-screen');
const finalScoreElement = document.getElementById('final-score');
const usernameInput = document.getElementById('username');
const submitScoreButton = document.getElementById('submit-score');

let shuffledQuestions, currentQuestionIndex;
let quizTimer;
let score = 0;

startButton.addEventListener('click', startGame);
submitScoreButton.addEventListener('click', saveHighScore);

function startGame() {
  score = 0;
  startButton.classList.add('hide');
  shuffledQuestions = questions.sort(() => Math.random() - .5);
  currentQuestionIndex = 0;
  questionContainerElement.classList.remove('hide');
  setNextQuestion();
  startTimer();
}

function startTimer() {
  let time = questions.length * 15; // 15 seconds per question
  timerElement.textContent = time;
  quizTimer = setInterval(() => {
    time--;
    timerElement.textContent = time;
    if (time <= 0) {
      clearInterval(quizTimer);
      endGame();
    }
  }, 1000);
}

function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
  questionElement.textContent = question.question;
  question.answers.forEach(answer => {
    const button = document.createElement('button');
    button.innerText = answer.text;
    button.classList.add('btn');
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener('click', selectAnswer);
    answerButtonsElement.appendChild(button);
  });
}

function resetState() {
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct;
  if (!correct) {
    // Penalize time
    let currentTime = parseInt(timerElement.textContent);
    let penalty = 10; // 10 seconds penalty
    let newTime = currentTime > penalty ? currentTime - penalty : 0;
    timerElement.textContent = newTime;
  }
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    currentQuestionIndex++;
    setNextQuestion();
  } else {
    clearInterval(quizTimer);
    endGame();
  }
}

function endGame() {
  finalScoreElement.textContent = timerElement.textContent;
  questionContainerElement.classList.add('hide');
  endScreenElement.classList.remove('hide');
}

function saveHighScore() {
  const username = usernameInput.value;
  const newScore = {
    score: finalScoreElement.textContent,
    name: username
  };
  // Retrieve the old scores from local storage, or if not any, set to an empty array
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  highScores.push(newScore);
  highScores.sort((a, b) => b.score - a.score);
  localStorage.setItem('highScores', JSON.stringify(highScores));
  // You will need to write a function to display high scores
  displayHighScores();
}

// Mock questions array
const questions = [
  {
    question: 'What is 2 + 2?',
    answers: [
      { text: '4', correct: true },
      { text: '22', correct: false },
      { text: 'An invalid question', correct: false },
      { text: 'None of the above', correct: false }
    ]
  },
  // More questions...
];

function displayHighScores() {
  // Implement this to show high scores
}
