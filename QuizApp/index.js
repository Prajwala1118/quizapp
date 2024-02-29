document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("quiz-container");

  questions = removeDuplicateQuestions(questions);

  questions.forEach((questionObj) => {
    const { id, question, options } = questionObj;

    let results = JSON.parse(localStorage.getItem(id)) || questionObj.results;

    // Create poll container
    const pollContainer = document.createElement("div");
    pollContainer.classList.add("container", "py-4");

    // Create question element
    const questionElement = document.createElement("h1");
    questionElement.classList.add("poll-question", "mb-4");
    questionElement.textContent = question;
    pollContainer.appendChild(questionElement);

    // Create form element
    const formElement = document.createElement("form");
    formElement.classList.add("poll-form");

    // Create radio buttons
    createFromOptions(options, formElement);

    // Create submit button
    createFormButton(id, formElement);

    pollContainer.appendChild(formElement);

    
    // Handle form submission
    formElement.addEventListener("submit", function (event) {
      event.preventDefault();
      const selectedOption = formElement.querySelector(
        'input[name="vote"]:checked'
      )?.value;
      if(!selectedOption) return;
      results[selectedOption]++;
      localStorage.setItem(id, JSON.stringify(results));
      updateResults();
      disableForm(formElement);
      document.getElementById('results ' + id).style.display = "block";
    });

    const totalCount=getTotalCount(results);
    
    // Create results element
    const resultsDiv = createResultsDiv(id);
    const resultsCount = document.createElement("div");
    resultsCount.classList.add("results-count", 'd-flex', 'flex-column');
    // Display results
    Object.keys(results).forEach((option) => {
      const p = document.createElement("p");
      p.textContent = `${option}: `;
      const span = document.createElement("span");
      span.setAttribute("id", option.toLowerCase() + "-count");
      const progressDiv=document.createElement("div");
      progressDiv.classList.add("progress");

      const progressBar=document.createElement("div");
      progressBar.setAttribute("id", option.toLowerCase() + "-progress");
      progressBar.classList.add("progress-bar",);
      
      const progress=Math.floor((results[option]/totalCount)*100);
      progressBar.innerText=`${progress}%`;
      
      progressBarStatus(progress,progressBar);
      progressBar.style.width=`${progress}%`;

      progressDiv.appendChild(progressBar);
      span.classList.add("count");
      span.textContent = results[option];
      p.appendChild(span);
      resultsCount.appendChild(p);
      resultsCount.appendChild(progressDiv);
    });
    resultsDiv.appendChild(resultsCount);
    pollContainer.appendChild(resultsDiv);

    container.insertBefore(pollContainer, document.getElementById('next-button'));
  });
});


function getTotalCount(results){
  return Object.keys(results).reduce((acc,val)=> acc+results[val],0);
}

function progressBarStatus(progress,progressElement){
  if(progress>50){
    progressElement.classList.add("bg-success");
  }else if(progress>20 && progress<=50){
    progressElement.classList.add("bg-info");
  }else{
    progressElement.classList.add("bg-danger");
  }
}
// Function to update results
function updateResults() {
  questions.forEach((questionObj) => {
    const { id, options } = questionObj;
    let results = JSON.parse(localStorage.getItem(id)) || questionObj.results;
    options.forEach((option) => {
      const countElement = document.getElementById(
        option.toLowerCase() + "-count"
      );
      countElement.textContent = results[option];
      const progressElement = document.getElementById(
        option.toLowerCase() + "-progress"
      );
      const totalCount=getTotalCount(results);
      const progress=Math.floor((results[option]/totalCount)*100);
      progressElement.style.width=`${progress}%`;
      progressElement.className = "";
      progressElement.classList.add("progress-bar");
      progressBarStatus(progress,progressElement);
      progressElement.innerText=`${progress}%`;
    });
  });
}

// Previous button
document.getElementById("previous")?.addEventListener("click", () => {
  window.location.href = `index${getCurrentIndex() - 1}.html`;
});

// Next button
document.getElementById("next")?.addEventListener("click", () => {
  window.location.href = `index${getCurrentIndex() + 1}.html`;
});

// Helper function for getting current index
const getCurrentIndex = () => {
  return parseInt(window.location.pathname.split("index")[1].split(".")[0]);
};

const createFromOptions = (options, formElement) => {
  options.forEach((option) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    const radDesignDiv = document.createElement("div");
    radDesignDiv.className='rad-design';
    const radTextDiv = document.createElement("div");
    radTextDiv.className='rad-text';
    radTextDiv.appendChild(document.createTextNode(option));
    input.setAttribute("type", "radio");
    input.setAttribute("name", "vote");
    input.setAttribute("value", option);
    input.classList.add("mr-2","rad-input");
    label.appendChild(input);
    label.appendChild(radDesignDiv);
    label.appendChild(radTextDiv);
    label.classList.add("d-block", "mb-2", "rad-label","d-flex", "flex-row");
    formElement.appendChild(label);
  });
};

const createFormButton = (id, formElement) => {
  const button = document.createElement("button");
  button.setAttribute("type", "submit");
  button.setAttribute("id", id);
  button.classList.add("btn", "btn-primary", "mt-3", "rounded-pill");
  button.textContent = "Vote";
  formElement.appendChild(button);
};

const disableForm = (formElement) => {
  formElement.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.disabled = true;
    input.parentNode.style.cursor='default';
    input.nextElementSibling.style.background="grey"
  });
  formElement.querySelector('button[type="submit"]').disabled = true;
};
function removeDuplicateQuestions(questions) {
  const uniqueQuestionsSet = new Set();
  const uniqueQuestions = [];

  for (let question of questions) {
    if (!uniqueQuestionsSet.has(question.question)) {
      uniqueQuestionsSet.add(question.question);
      uniqueQuestions.push(question);
    }
  }

  return uniqueQuestions;
}

const createResultsDiv = (id) => {
  let resultsDiv = document.createElement("div");
  resultsDiv.setAttribute("id", "results " + id);
  resultsDiv.style.display = "none";
  resultsDiv.classList.add("results");
  const resultsTitle = document.createElement("h2");
  resultsTitle.classList.add("results-title", "mb-3");
  resultsTitle.textContent = "Results";
  resultsDiv.appendChild(resultsTitle);
  return resultsDiv;
};
