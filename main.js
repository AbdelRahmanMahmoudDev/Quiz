// begin variables
// keeps track of which question we're on, initially the first one
let currentQuestionIndex = 0;
// the amount of questions in the json file
let questionsCount = 0;
// the json object 
let dataObj;
// the amount of correctly answered questions
let correctCount = 0;
// the interval of the countdown
let countdownInterval;

let elementTitleArea = document.querySelector(".quiz-container .title-area");
let elementQuestionCount = document.querySelector(".quiz-container .title-area div span");
let elementQuestionTitle = document.querySelector(".quiz-container .title-area h2");
let elementSubmitArea = document.querySelector(".quiz-container .submit-area");
let elementSubmitButton = document.querySelector(".quiz-container .submit-area button");
let elementNodesArea = document.querySelector(".quiz-container .submit-area .questions-progress .questions-count");
let elementClock = document.querySelector(".quiz-container .submit-area .questions-progress .clock");
let elementQuizArea = document.querySelector(".quiz-container .quiz-area");
// end variables

// begin functions
elementSubmitButton.onclick = () => {
    // check answer
    // TODO: getElementbyID instead
    let checkedLabel = document.querySelector(`.quiz-container .quiz-area input[type="Radio"]:checked + label`);
    let currentNode = document.getElementById(`question_${currentQuestionIndex + 1}`);
    currentNode.classList.remove("current");
    if(checkedLabel) {
        if(checkedLabel.innerHTML === dataObj[currentQuestionIndex].correct) {
            currentNode.classList.add("correct");
            correctCount++;
        } else {
            currentNode.classList.add("wrong");
        }
    } else {
        // not answered
        currentNode.classList.add("wrong");
    }

    if(currentQuestionIndex < dataObj.length - 1) {
        ++currentQuestionIndex;
        currentNode = document.getElementById(`question_${currentQuestionIndex + 1}`);
        currentNode.classList.add("current");
        renderQuestion(currentQuestionIndex, dataObj);
    } else {
        // end of questions
        elementTitleArea.innerHTML = "";
        elementQuizArea.innerHTML = "";
        elementSubmitArea.innerHTML = "";
        let resultsArea = document.createElement("div");
        let resultsText = document.createTextNode(`You've answered ${correctCount} out of ${dataObj.length} correctly`);
        resultsArea.style.fontSize = "30px";
        resultsArea.appendChild(resultsText);
        elementQuizArea.appendChild(resultsArea);
    }
    clearInterval(countdownInterval);
    countdown(15, dataObj.length);

};

function renderQuestion(questionIndex, data) {
    elementQuizArea.innerHTML = "";
    // set question count
    elementQuestionCount.innerHTML = data.length;
    // set current question 
    elementQuestionTitle.innerHTML = data[questionIndex].title;
    
    // set radio options
    // TODO: handle any amount of answers
    for(let index = 0; index < 4; index++) {
        let holdingDiv = document.createElement("div");
        let input = document.createElement("input");
        input.type = "radio";
        input.name = "answers_collection";
        input.id = `answer_${index + 1}`;
        holdingDiv.appendChild(input);
        
        let label = document.createElement("label");
        label.htmlFor = `answer_${index + 1}`;
        label.innerHTML = data[questionIndex][`answer_${index + 1}`];
        holdingDiv.appendChild(label);

        elementQuizArea.appendChild(holdingDiv);    
    }
}

function countdown(duration, questionsCount) {
    if(currentQuestionIndex < questionsCount) {
        let minutes, seconds;
        countdownInterval = setInterval(() => {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            elementClock.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                elementSubmitButton.click();
            }
        }, 1000);
    }
}

function updateNodes(questionIndex, questionsCount) {
    elementNodesArea.innerHTML = "";
    for(let index = 0; index < questionsCount; index++) {
        let div = document.createElement("div");
        div.id = `question_${index + 1}`;
        if(index === questionIndex) {
        div.classList.add("current");
        }
    elementNodesArea.appendChild(div);
    }
}

let request = new XMLHttpRequest();
request.open("GET", "questions.json", true);
request.send();
request.onreadystatechange = () => {
    if(request.readyState === 4 && request.status === 200) {
        dataObj = JSON.parse(request.responseText);
        renderQuestion(currentQuestionIndex, dataObj);
        updateNodes(currentQuestionIndex, dataObj.length);
        countdown(15, dataObj.length);
    }
};