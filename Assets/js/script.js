// The structure of question objects
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
  // Can add more questions as needed...
];

var remainingTime;
var shuffledQuestions, currentQuestionIndex, score, quizTimer;
var startButton = document.getElementById('start-btn');
var questionContainerElement = document.getElementById('question-container');
var questionElement = document.getElementById('question');
var answerButtonsElement = document.getElementById('answer-buttons');
var timerElement = document.getElementById('time');
var endScreenElement = document.getElementById('end-screen');
var finalScoreElement = document.getElementById('final-score');
var usernameInput = document.getElementById('username');
var submitScoreButton = document.getElementById('submit-score');
var highscoresContainer = document.getElementById('highscores-container');
var highscoresList = document.getElementById('highscores-list');

startButton.addEventListener('click', startGame);
submitScoreButton.addEventListener('click', saveHighScore);
document.getElementById('highscore-link').addEventListener('click', function() {
  // Hide all other containers
  document.getElementById('quiz-intro').classList.add('hide');
  questionContainerElement.classList.add('hide');
  endScreenElement.classList.add('hide');

  // Show the high scores
  highscoresContainer.classList.remove('hide');
  displayHighScores(); // Call the function that updates and displays the high scores
});


function startGame() {
  score = 0; // Reset score
  shuffledQuestions = questions.sort(() => Math.random() - .5);
  currentQuestionIndex = 0; // Reset question index
  document.getElementById('quiz-intro').classList.add('hide'); // Hide intro
  questionContainerElement.classList.remove('hide'); // Show question container
  setNextQuestion(); // Set the first question
  currentTime = questions.length * 15;
  startTimer(); // Start the quiz timer
  console.log("Starting the game");
}

function startTimer() {
  timerElement.textContent = currentTime;
  quizTimer = setInterval(function() {
    currentTime--;
    timerElement.textContent = currentTime;
    if (currentTime <= 0) {
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
  question.answers.forEach(function(answer) {
    var button = document.createElement('button');
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
  var feedback = document.getElementById('feedback');

  // Disable all buttons first
  Array.from(answerButtonsElement.children).forEach(button => {
    button.disabled = true;
  });

  if (correct) {
    selectedButton.classList.add('correct');
    feedback.textContent = 'Correct!';
    feedback.style.color = 'green';
  } else {
    selectedButton.classList.add('incorrect');
    feedback.textContent = 'Wrong!';
    feedback.style.color = 'red';
    
    // Deduct time for a wrong answer
    updateTimer(-10); // Deduct 10 seconds for wrong answer
    function updateTimer(change) {
      currentTime += change;
      timerElement.textContent = currentTime > 0 ? currentTime : 0;
    
      if (currentTime <= 0) {
        clearInterval(quizTimer);
        setTimeout(endGame, 2000); // Wait 2 seconds before ending the game to show feedback
      }
    }
  }

  feedback.style.display = 'block';
  setTimeout(function() {
    feedback.style.display = 'none';
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
      currentQuestionIndex++;
      setNextQuestion();
    } else {
      endGame();
    }
  }, 2000);
}

function updateTimer(change) {
  var currentTime = parseInt(timerElement.textContent);
  var newTime = currentTime + change;
  timerElement.textContent = newTime > 0 ? newTime : 0;

  if (newTime <= 0) {
    clearInterval(quizTimer);
    setTimeout(endGame, 2000); // Wait 2 seconds before ending the game to show feedback
  }
}


function endGame() {
  finalScoreElement.textContent = timerElement.textContent;
  questionContainerElement.classList.add('hide'); // Hide questions
  endScreenElement.classList.remove('hide'); // Show end screen
  clearInterval(quizTimer); // Clear the timer interval
  timerElement.textContent = '0'; // Set timer to 0 when game ends
}

function saveHighScore() {
  var username = usernameInput.value.trim(); // Trim any whitespace
  if (username === "") {
    // If no initials are entered, show an alert or message
    alert("Please enter your initials to save your score!");
    return; // Exit the function early
  }
  
  var newScore = {
    score: parseInt(finalScoreElement.textContent),
    name: username
  };

  var highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  highScores.push(newScore);

  highScores.sort(function(a, b) { return b.score - a.score; });

  localStorage.setItem('highScores', JSON.stringify(highScores));

  // Optionally, clear the input after saving
  usernameInput.value = '';

  // Go to the high scores page or display them
  displayHighScores();
}

function displayHighScores() {
  var highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  highscoresList.innerHTML = ''; // Clear current list

  highScores.forEach(function(score) {
    var scoreElement = document.createElement('li');
    scoreElement.textContent = `${score.name} - ${score.score}`;
    highscoresList.appendChild(scoreElement);
  });

  // Make sure to hide the quiz and show the high scores
  questionContainerElement.classList.add('hide');
  endScreenElement.classList.add('hide');
  highscoresContainer.classList.remove('hide');
}

document.getElementById('go-back').addEventListener('click', function() {
  highscoresContainer.classList.add('hide');
  document.getElementById('quiz-intro').classList.remove('hide');
  // Reset the quiz view as necessary
});

document.getElementById('clear-highscores').addEventListener('click', function() {
  localStorage.removeItem('highScores');
  displayHighScores(); // Refresh the list after clearing the scores
});
document.getElementById('go-back').addEventListener('click', function() {
  // Hide high scores and show the start screen
  highscoresContainer.classList.add('hide');
  document.getElementById('quiz-intro').classList.remove('hide');

  // Resetting quiz variables
  score = 0;
  currentQuestionIndex = 0;

  // Clear any existing timer
  clearInterval(quizTimer);

  // Resetting HTML contents that may have changed
  questionContainerElement.classList.add('hide');
  finalScoreElement.textContent = '';
  timerElement.textContent = '0';
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }

  // Show the start button again
  startButton.classList.remove('hide');
});
