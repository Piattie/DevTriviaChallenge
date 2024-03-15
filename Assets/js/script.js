// Questions structure
var questions = [
  {
    question: 'What does HTML stand for?',
    answers: [
      { text: 'Hyper Trainer Marking Language', correct: false },
      { text: 'Hyper Text Markup Language', correct: true },
      { text: 'Hyper Texts Mark Language', correct: false },
      { text: 'Hyperlinks Text Markup Language', correct: false }
    ]
  },
  {
    question: 'What symbol indicates a tag in HTML?',
    answers: [
      { text: '<>', correct: true },
      { text: '{}', correct: false },
      { text: '()', correct: false },
      { text: '||', correct: false }
    ]
  }
  // Additional questions can be added here...
];

// Quiz state variables
var remainingTime;
var shuffledQuestions, currentQuestionIndex, score, quizTimer, correctAnswers;

// DOM elements
var startButton = document.getElementById('start-btn');
var questionContainerElement = document.getElementById('question-container');
var questionElement = document.getElementById('question');
var answerButtonsElement = document.getElementById('answer-buttons');
var timerElement = document.getElementById('time');
var resultHeader = document.getElementById('result-header');
var endScreenElement = document.getElementById('end-screen');
var finalScoreElement = document.getElementById('final-score');
var usernameInput = document.getElementById('username');
var submitScoreButton = document.getElementById('submit-score');
var highscoresContainer = document.getElementById('highscores-container');
var highscoresList = document.getElementById('highscores-list');
var feedbackElement = document.getElementById('feedback');

// Event listeners
startButton.addEventListener('click', startGame);
submitScoreButton.addEventListener('click', saveHighScore);

document.getElementById('highscore-link').addEventListener('click', function() {
  showHighScores();
});

document.getElementById('go-back').addEventListener('click', function() {
  resetToStartScreen();
});

document.getElementById('clear-highscores').addEventListener('click', function() {
  clearHighScores();
});

// Game functions
function startGame() {
  score = 0;
  correctAnswers = 0;
  shuffledQuestions = questions.sort(() => Math.random() - .5);
  currentQuestionIndex = 0;
  document.getElementById('quiz-intro').classList.add('hide');
  questionContainerElement.classList.remove('hide');
  setNextQuestion();
  currentTime = questions.length * 15;
  startTimer();
}

function startTimer() {
  timerElement.textContent = currentTime;
  quizTimer = setInterval(function() {
    currentTime--;
    timerElement.textContent = currentTime;
    if (currentTime <= 0) {
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
  var selectedButton = e.target;
  var correct = selectedButton.dataset.correct;

  Array.from(answerButtonsElement.children).forEach(button => {
    button.disabled = true;
  });

  if (correct) {
    selectedButton.classList.add('correct');
    feedbackElement.textContent = 'Correct!';
    feedbackElement.style.color = 'green';
    correctAnswers++;  // Increment correct answers
  } else {
    selectedButton.classList.add('incorrect');
    feedbackElement.textContent = 'Wrong!';
    feedbackElement.style.color = 'red';
    updateTimer(-10);
  }

  feedbackElement.style.display = 'block';
  setTimeout(() => {
    feedbackElement.style.display = 'none';
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
      currentQuestionIndex++;
      setNextQuestion();
    } else {
      endGame();
    }
  }, 1000);
}

function updateTimer(change) {
  var newTime = Math.max(0, currentTime + change);
  currentTime = newTime;
  timerElement.textContent = newTime;

  if (newTime <= 0) {
    endGame();
  }
}

function endGame() {
  var score = currentTime;
  if (correctAnswers === questions.length) {
    score = currentTime;
  } else if (correctAnswers > 0) {
    score = currentTime;
  } else {
    score = 0;
  }
  
  var resultHeader = document.getElementById('result-header');
  if (correctAnswers === questions.length) {
    resultHeader.textContent = 'Congratulations!';
  } else if (correctAnswers > 0) {
    resultHeader.textContent = 'All Done!';
  } else {
    resultHeader.textContent = 'Game Over!';
  }

  finalScoreElement.textContent = score + ". ";
  questionContainerElement.classList.add('hide');
  endScreenElement.classList.remove('hide');
  clearInterval(quizTimer);
  timerElement.textContent = '0';
  correctAnswers = 0;  // Reset correct answers for next game
}

function saveHighScore() {
  var username = usernameInput.value.trim();
  if (username === "") {
    alert("Please enter your initials to save your score!");
    return;
  }

  var newScore = {
    score: score,
    name: username
  };

  var highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  highScores.push(newScore);
  highScores.sort((a, b) => b.score - a.score);
  localStorage.setItem('highScores', JSON.stringify(highScores));
  usernameInput.value = '';
  displayHighScores();
}

function displayHighScores() {
  var highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  highscoresList.innerHTML = '';

  highScores.forEach(score => {
    var scoreElement = document.createElement('li');
    scoreElement.textContent = `${score.name} - ${score.score}`;
    highscoresList.appendChild(scoreElement);
  });

  highscoresContainer.classList.remove('hide');
  questionContainerElement.classList.add('hide');
  endScreenElement.classList.add('hide');
}

function showHighScores() {
  highscoresContainer.classList.remove('hide');
  document.getElementById('quiz-intro').classList.add('hide');
  questionContainerElement.classList.add('hide');
  endScreenElement.classList.add('hide');
  displayHighScores();
}

function resetToStartScreen() {
  highscoresContainer.classList.add('hide');
  document.getElementById('quiz-intro').classList.remove('hide');
  startButton.classList.remove('hide');
  score = 0;
  currentQuestionIndex = 0;
  clearInterval(quizTimer);
  timerElement.textContent = '0';
  questionContainerElement.classList.add('hide');
  finalScoreElement.textContent = '';
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

function clearHighScores() {
  localStorage.removeItem('highScores');
  displayHighScores();
}
