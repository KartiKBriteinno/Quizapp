document.addEventListener('DOMContentLoaded', function () {
    let quizData = {};
    let currentSectionIndex = 0;
    let currentQuestionIndex = 0;
    let score = 0; // Variable to keep track of the score

    // Fetch quiz data from the JSON file
    fetch('quiz-data.json')
        .then(response => response.json())
        .then(data => {
            quizData = data;
            initSections();
        })
        .catch(error => console.error('Error loading quiz data:', error));

    function initSections() {
        let sections = document.querySelectorAll('.section');
        sections.forEach((section) => {
            section.addEventListener("click", () => {
                currentSectionIndex = parseInt(section.getAttribute("data-section"));
                startQuiz(currentSectionIndex);
            });
        });
    }

    function startQuiz(index) {
        // Hide the section selection screen and show the quiz screen
        document.getElementById('quiz-container').style.display = 'none';
        document.getElementById('question-container').style.display = 'block';
        document.getElementById('final-score-container').style.display = 'none';

        currentQuestionIndex = 0;
        let questionBank = quizData.sections[index].questions;
        console.log("Section Index:", index);
        displayQuestion(currentQuestionIndex, questionBank);
    }

    function displayQuestion(questionIndex, questionBank) {
        if (questionIndex >= questionBank.length) {
            showFinalScore();
            return;
        }

        let questionContainer = document.getElementById('question-container');
        questionContainer.style.display = 'block';

        let questionElement = document.getElementById('question');
        let optionsElement = document.getElementById('options');
        let feedbackElement = document.getElementById('feedback');

        let currentQuestion = questionBank[questionIndex];

        questionElement.textContent = currentQuestion.question;
        optionsElement.innerHTML = '';
        feedbackElement.textContent = '';

        if (currentQuestion.questionType === 'mcq') {
            currentQuestion.options.forEach((option, index) => {
                let optionElement = document.createElement('button');
                optionElement.textContent = option;
                optionElement.addEventListener('click', () => checkAnswer(option, currentQuestion.answer, questionIndex, questionBank));
                optionsElement.appendChild(optionElement);
            });
        } else {
            let inputElement = document.createElement('input');
            inputElement.type = currentQuestion.questionType === 'number' ? 'number' : 'text';
            optionsElement.appendChild(inputElement);

            let submitButton = document.createElement('button');
            submitButton.textContent = 'Submit';
            submitButton.addEventListener('click', () => checkAnswer(inputElement.value, currentQuestion.answer, questionIndex, questionBank));
            optionsElement.appendChild(submitButton);
        }

        // Show the next button only if there are more questions
        let nextButton = document.getElementById('next-button');
        nextButton.style.display = (questionIndex < questionBank.length - 1) ? 'block' : 'none';
        nextButton.disabled = true;
        nextButton.onclick = () => displayQuestion(questionIndex + 1, questionBank);
    }

    function checkAnswer(selectedAnswer, correctAnswer, currentQuestionIndex, questionBank) {
        let feedbackElement = document.getElementById('feedback');
        if (selectedAnswer.toString().trim().toLowerCase() === correctAnswer.toString().trim().toLowerCase()) {
            updateScore();
            feedbackElement.textContent = "Correct!";
            feedbackElement.style.color = 'green';
        } else {
            let correctAnswerText = questionBank[currentQuestionIndex].answer; // Get the correct answer
            feedbackElement.textContent = `Incorrect. The correct answer is: ${correctAnswerText}`;
            feedbackElement.style.color = 'red';
        }

        // Enable the next button if it's not the last question
        if (currentQuestionIndex < questionBank.length - 1) {
            document.getElementById('next-button').disabled = false;
        } else {
            showFinalScore(); // Show final score when it's the last question
        }
    }

    function updateScore() {
        score += 1;
        let scoreElement = document.getElementById('score');
        scoreElement.textContent = `Score: ${score}`;
    }

    function showFinalScore() {
        let scoreElement = document.getElementById('score');
        let finalScoreElement = document.getElementById('final-score');
        let totalQuestions = 10; // Total number of questions per section
        let correctAnswers = parseInt(scoreElement.textContent.split(':')[1]);
        finalScoreElement.textContent = `Your final score is ${correctAnswers}/${totalQuestions} correct`;
    
        document.getElementById('question-container').style.display = 'none';
        document.getElementById('final-score-container').style.display = 'block';
    
        document.getElementById('home-button').addEventListener('click', resetQuiz);
    }
    

    function resetQuiz() {
        document.getElementById('quiz-container').style.display = 'block';
        document.getElementById('final-score-container').style.display = 'none';
        document.getElementById('score').textContent = 'Score:0';
        score = 0; // Reset the score
    }
});