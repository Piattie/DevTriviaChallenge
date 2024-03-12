// The structure of our question objects
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
  // More questions as needed...
];

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
  startTimer(); // Start the quiz timer
  console.log("Starting the game");
}

function startTimer() {
  var time = questions.length * 15; // 15 seconds per question
  timerElement.textContent = time;
  quizTimer = setInterval(function() {
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
  var buttons = answerButtonsElement.getElementsByTagName('button');
  for (var button of buttons) {
    button.disabled = true;
  }

  // Check if the answer is correct and display feedback
  if (correct) {
    selectedButton.classList.add('correct');
    feedback.textContent = 'Correct!';
    feedback.style.color = 'green'; // Optional: green color for correct feedback
  } else {
    selectedButton.classList.add('incorrect');
    feedback.textContent = 'Wrong!';
    feedback.style.color = 'red'; // Optional: red color for wrong feedback
    // Deduct time for a wrong answer, etc.
    // ...
  }

  feedback.style.display = 'block'; // Show feedback message

  // Delay before moving to the next question or ending the game
  // ...
  
  // Optionally, hide the feedback after some time
  setTimeout(function() {
    feedback.style.display = 'none'; // Hide feedback message
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
      currentQuestionIndex++;
      setNextQuestion();
    } else {
      endGame();
    }
  }, 2000); // Hide feedback after 2 seconds
}

function endGame() {
  finalScoreElement.textContent = timerElement.textContent;
  questionContainerElement.classList.add('hide'); // Hide questions
  endScreenElement.classList.remove('hide'); // Show end screen
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
