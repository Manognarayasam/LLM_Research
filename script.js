let userName = ""; // Variable to store the user's name
let askingName = true; // Flag to check if the bot is asking for the user's name
let chatLog = []; // Array to store the chat log

const cardContents = {
  yes: [
    {
      title: "Fur in Fashion",
      description:
        "The State of California took a step further by banning the manufacture and sale of fur products in the entire state...",
      content:
        "The State of California took a step further by banning the manufacture and sale of fur products in the entire state...",
    },
    {
      title: "Should Fur Be Illegal?",
      description:
        "If you feel like getting threatened, here's an idea: Head to an anti-fur protest and mention child labor...",
      content:
        "If you feel like getting threatened, here's an idea: Head to an anti-fur protest and mention child labor...",
    },
  ],
  no: [
    {
      title: "Article 3",
      description: "Description for article 3...",
      content: "Full description for article 3...",
    },
    {
      title: "Article 4",
      description: "Description for article 4...",
      content: "Full description for article 4...",
    },
  ],
};

const questions = {
  start: {
    message:
      "While banning fur clothing might reduce some animal cruelty, wouldn't animal cruelty still exist in other forms? What's the rationale behind banning it?",
    options: ["Yes", "No"],
  },
  yesResponse: {
    message:
      "While animal cruelty may persist in other forms, banning fur farming is still a justifiable and important step. It intentionally inflicts cruelty on animals solely for the frivolous purpose of fashion, unlike accidental or byproduct cruelty, and operates on an immense industrial scale, enabling systematized mass cruelty towards millions of animals. There are readily available alternative materials, making the cruel fur trade unnecessary. Allowing it normalizes the idea that animal suffering for superficial human wants is acceptable. While imperfect, banning fur makes incremental progress by challenging institutionalized cruelty driven more by human vanity than necessity. Targeting the intentional, barbaric, profit-driven fur industry is a reasonable goal to reduce large-scale, gratuitous animal suffering.",
  },
  noResponse: {
    message: "What are some other ways to prevent animal cruelty?",
    options: ["Education", "Legislation", "Activism"],
  },
};

const sampleQuestions = [
  {
    question: "What are the benefits of banning fur farming?",
    answer:
      "Banning fur farming reduces animal cruelty, promotes ethical fashion, and encourages the use of alternative materials.",
  },
  {
    question: "How does legislation help prevent animal cruelty?",
    answer:
      "Legislation establishes laws and regulations that protect animals from abuse, ensuring their welfare and safety.",
  },
  {
    question: "What role does education play in animal welfare?",
    answer:
      "Education raises awareness about animal rights, teaching people to treat animals with compassion and respect.",
  },
  {
    question: "Why is activism important for animal rights?",
    answer:
      "Activism brings attention to animal cruelty issues, mobilizing people to take action and advocate for change.",
  },
  {
    question: "What are some alternatives to using animal fur?",
    answer:
      "Alternatives to animal fur include synthetic fur, plant-based materials, and other sustainable options.",
  },
];

function createBotMessage(text) {
  const chatBox = document.getElementById("chat-box");
  const botMessage = document.createElement("div");
  botMessage.className = "message bot-message";
  botMessage.textContent = text;
  chatBox.appendChild(botMessage);
  chatBox.scrollTop = chatBox.scrollHeight;
  chatLog.push({ sender: "bot", message: text }); // Add message to chat log
  console.log(chatLog); // Print chat log to console
}

function createOptionButtons(options) {
  const chatBox = document.getElementById("chat-box");
  const optionsContainer = document.createElement("div");
  optionsContainer.className = "options-container";

  options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "option-button";
    button.textContent = option;
    button.onclick = () => handleOptionClick(option);
    optionsContainer.appendChild(button);
  });

  chatBox.appendChild(optionsContainer);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function getResponse(message) {
  for (const [intent, data] of Object.entries(intents)) {
    for (const utterance of data.utterances) {
      if (message.toLowerCase().includes(utterance)) {
        const responseIndex = Math.floor(Math.random() * data.responses.length);
        return data.responses[responseIndex];
      }
    }
  }
  return "Sorry, I didn't understand that.";
}

function sendMessage(message) {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const userText = message ? message.trim() : input.value.trim(); // Use the provided message or input value

  if (userText !== "") {
    // Display user message
    const userMessage = document.createElement("div");
    userMessage.className = "message user-message";
    userMessage.textContent = userText;
    chatBox.appendChild(userMessage);
    chatLog.push({ sender: "user", message: userText }); // Add message to chat log

    let botResponse = "";

    if (askingName) {
      // Capture and store the user's name
      userName = userText;
      botResponse = `Nice to meet you, ${userName}. Let's start the survey.`;
      createBotMessage(botResponse);
      setTimeout(() => {
        createBotMessage(questions.start.message);
        createOptionButtons(questions.start.options);
      }, 1000);
      askingName = false; // Set the flag to false as the name has been captured
    } else if (questions.start.options.includes(userText)) {
      // Handle the options "Yes" and "No"
      if (userText.toLowerCase() === "yes") {
        botResponse = questions.yesResponse.message;
        displayCards("yes");
      } else if (userText.toLowerCase() === "no") {
        botResponse = questions.noResponse.message;
        createBotMessage(botResponse);
        setTimeout(() => {
          createOptionButtons(questions.noResponse.options);
          displayCards("no");
        }, 1000);
        return; // Early return to avoid double response
      }
      createBotMessage(botResponse);
      setTimeout(() => displayQuestionSet(), 1000); // Display the first set of questions
    } else {
      // Handle other intents or continue conversation
      botResponse = userName
        ? getResponse(userText).replace(/USERNAME/g, userName)
        : getResponse(userText);
      createBotMessage(botResponse);
    }
  }

  // Clear input if not using provided message
  if (!message) {
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

// Function to display cards based on user response
function displayCards(responseType) {
  const container = document.getElementById("advertisement-container");
  container.innerHTML = ""; // Clear existing cards
  cardContents[responseType].forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.className = "card";
    cardElement.innerHTML = `
      <h3>${card.title}</h3>
      <p>${card.description}</p>
      <p>Read More</p>
    `;
    cardElement.onclick = () => openModal(card.title, card.content);
    container.appendChild(cardElement);
  });
}

// Function to display a set of questions
function displayQuestionSet() {
  const chatBox = document.getElementById("chat-box");
  const questionSetContainer = document.createElement("div");
  questionSetContainer.className = "question-set-container";

  sampleQuestions.forEach((q, index) => {
    const button = document.createElement("button");
    button.className = "question-button";
    button.textContent = q.question;
    button.onclick = () => handleQuestionClick(index);
    questionSetContainer.appendChild(button);
  });

  const skipButton = document.createElement("button");
  skipButton.className = "question-button";
  skipButton.textContent = "Skip and show another set of questions";
  skipButton.onclick = () => skipQuestionSet();
  questionSetContainer.appendChild(skipButton);

  chatBox.appendChild(questionSetContainer);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function handleQuestionClick(index) {
  const answer = sampleQuestions[index].answer;
  createBotMessage(answer);
}

function skipQuestionSet() {
  createBotMessage("Here is another set of questions:");
  // Display the next set of questions (for simplicity, using the same set in this example)
  setTimeout(() => displayQuestionSet(), 1000);
}

// Triggered when the chatbot is loaded
window.onload = function () {
  createBotMessage(
    "Welcome to our survey today! These are the general instructions before you take the survey"
  );
  createBotMessage("Hello, what is your name?");
};

function showOptions() {
  const botMessage = document.createElement("div");
  botMessage.className = "message bot-message";
  botMessage.innerHTML = `
    <p>Please select one of the following options:</p>
    <ul>
      <li><button class="option-button" onclick="selectOption('question-1')">Question-1</button></li>
      <li><button class="option-button" onclick="selectOption('question-2')">Question-2</button></li>
      <li><button class="option-button" onclick="selectOption('other')">Other</button></li>
    </ul>
  `;
  const chatBox = document.getElementById("chat-box");
  chatBox.appendChild(botMessage);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function selectOption(option) {
  sendMessage(option); // Send the selected option as a message to the sendMessage function
}

function handleOptionClick(option) {
  sendMessage(option);
}

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
