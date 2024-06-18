let userName = ""; // Variable to store the user's name
let askingName = true; // Flag to check if the bot is asking for the user's name
let currentSetIndex = 0; // Track the current set of questions
const userResponses = {}; // Object to store user responses

const questionSets = [
  {
    set: "Set-1",
    questions: [
      {
        question:
          "What impact does banning fur clothing have on the fashion industry?",
        answer:
          "Banning fur clothing pushes the fashion industry to innovate and adopt sustainable and cruelty-free materials.",
      },
      {
        question:
          "How does the public perceive the ban on fur clothing in terms of animal rights?",
        answer:
          "The public generally perceives the ban on fur clothing as a positive step towards better animal rights.",
      },
      {
        question:
          "What are the economic consequences for businesses involved in fur trade due to the ban on fur clothing?",
        answer:
          "Businesses involved in the fur trade face significant economic losses due to the ban but can pivot to alternative materials.",
      },
      {
        question:
          "What alternative materials are being promoted to replace fur in the fashion industry?",
        answer:
          "Materials such as synthetic fur, plant-based fibers, and recycled materials are being promoted to replace traditional fur.",
      },
    ],
  },
  {
    set: "Set-2",
    questions: [
      {
        question:
          "What are the key arguments for and against banning fur clothing?",
        answer:
          "Proponents argue it's ethical and promotes animal welfare, while opponents claim it affects livelihoods and tradition.",
      },
      {
        question:
          "How have different countries implemented regulations regarding fur clothing?",
        answer:
          "Countries vary in their approach; some have full bans while others have strict regulations to control the fur trade.",
      },
      {
        question:
          "What are the historical trends in the use of fur in fashion?",
        answer:
          "Fur has been a staple in fashion for centuries, but its use has declined with increasing awareness of animal rights.",
      },
      {
        question:
          "How does the ban on fur clothing affect consumer choices and preferences?",
        answer:
          "Consumers are gradually shifting towards cruelty-free and sustainable fashion choices due to increased awareness and availability of alternatives.",
      },
    ],
  },
  {
    set: "Set-3",
    questions: [
      {
        question:
          "Could banning fur clothing inadvertently increase the use of other animal products in fashion?",
        answer:
          "It's possible that banning fur could lead to an increase in the use of other animal products, though public awareness may mitigate this.",
      },
      {
        question:
          "Is it hypocritical to ban fur clothing while other forms of animal exploitation continue in various industries?",
        answer:
          "This is a complex issue; while some see it as hypocritical, others view it as a step in the right direction.",
      },
      {
        question:
          "How might the ban on fur clothing impact indigenous communities that rely on fur for traditional practices and livelihoods?",
        answer:
          "Indigenous communities may face challenges; exceptions or support programs can help mitigate negative impacts.",
      },
      {
        question:
          "Could the fur ban lead to unintended environmental consequences by promoting synthetic alternatives?",
        answer:
          "Synthetic alternatives can have environmental impacts; promoting natural, sustainable options is crucial.",
      },
    ],
  },
];

let cardContents = [];

function createBotMessage(text) {
  const chatBox = document.getElementById("chat-box");
  const botMessage = document.createElement("div");
  botMessage.className = "message bot-message";
  botMessage.textContent = text;
  chatBox.appendChild(botMessage);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function createUserMessage(text) {
  const chatBox = document.getElementById("chat-box");
  const userMessage = document.createElement("div");
  userMessage.className = "message user-message";
  userMessage.textContent = text;
  chatBox.appendChild(userMessage);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function createOptionButtons(options) {
  const chatBox = document.getElementById("chat-box");
  const optionsContainer = document.createElement("div");
  optionsContainer.className = "options-container";

  options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option-button";
    button.textContent = option.question;
    button.onclick = () => handleOptionClick(option, index);
    optionsContainer.appendChild(button);
  });

  const skipButton = document.createElement("button");
  skipButton.className = "option-button";
  skipButton.textContent = "Skip and show another set of questions";
  skipButton.onclick = () => skipQuestionSet();
  optionsContainer.appendChild(skipButton);

  chatBox.appendChild(optionsContainer);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function handleOptionClick(option, index) {
  createUserMessage(option.question);
  setTimeout(() => {
    createBotMessage(option.answer);
    const timestamp = new Date().toLocaleString();
    addToCards(option.question, option.answer, timestamp);
    setTimeout(() => {
      createBotMessage(
        `Please select one of the questions from ${questionSets[currentSetIndex].set} or click "Skip and show another set of questions".`
      );
      createOptionButtons(questionSets[currentSetIndex].questions);
    }, 1000);
  }, 1000);
}

function addToCards(question, answer, timestamp) {
  cardContents.push({ question, answer, timestamp });
  displayCards();
}

function displayCards() {
  const container = document.getElementById("advertisement-container");
  container.innerHTML = ""; // Clear existing cards
  cardContents.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.className = "card";
    cardElement.innerHTML = `
      <h3>${card.question}</h3>
      <p>${card.answer}</p>
      <p class="timestamp">${card.timestamp}</p>
    `;
    container.appendChild(cardElement);
  });
}

function skipQuestionSet() {
  cardContents = []; // Clear previous set's cards
  displayCards();
  currentSetIndex++;
  if (currentSetIndex >= questionSets.length) {
    createBotMessage("Thank you for completing the survey!");
    return;
  }
  createBotMessage(
    `Here is ${questionSets[currentSetIndex].set} of questions:`
  );
  createOptionButtons(questionSets[currentSetIndex].questions);
}

function sendMessage(message) {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const userText = message ? message.trim() : input.value.trim(); // Use the provided message or input value

  if (userText !== "") {
    // Display user message
    createUserMessage(userText);

    if (userText.toLowerCase() === "exit") {
      createBotMessage("Thank you for completing the survey!");
      return;
    }

    if (askingName) {
      // Capture and store the user's name
      userName = userText;
      createBotMessage(
        `Nice to meet you, ${userName}. Let's start the survey.`
      );
      askingName = false;
      // Ask the first set of questions
      setTimeout(() => {
        createBotMessage(
          `Here is ${questionSets[currentSetIndex].set} of questions:`
        );
        createOptionButtons(questionSets[currentSetIndex].questions);
      }, 1000);
    }
  }

  // Clear input if not using provided message
  if (!message) {
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

// Triggered when the chatbot is loaded
window.onload = function () {
  createBotMessage(
    "Welcome to our survey today! These are general instructions before you take the survey."
  );
  createBotMessage("Hello, what is your name?");
};

// Allow pressing Enter to send message
const input = document.getElementById("user-input");
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// Modal functions
function openModal(title, description) {
  document.getElementById("modal-title").innerText = title;
  document.getElementById("modal-description").innerText = description;
  document.getElementById("myModal").style.display = "block";
}

function closeModal() {
  document.getElementById("myModal").style.display = "none";
}
