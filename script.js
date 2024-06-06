let userName = ""; // Variable to store the user's name
let askingName = true; // Flag to check if the bot is asking for the user's name
let chatLog = []; // Array to store the chat log

const intents = {
  greeting: {
    utterances: ["hello", "hi", "hey"],
    responses: [
      "Hello there! What's your name?",
      "Hi, how can I help you today?",
      "Hey! Could you tell me your name, please?",
    ],
  },
  farewell: {
    utterances: ["bye", "goodbye", "see you"],
    responses: ["Goodbye!", "See you later!", "Bye! Have a great day!"],
  },
  question1: {
    utterances: ["question-1"],
    responses: ["Please explain what is the exact Question-1 you have."],
  },
  question2: {
    utterances: ["question-2"],
    responses: ["Please explain what is the exact Question-2 you have."],
  },
  other: {
    utterances: ["other"],
    responses: ["Please provide more details about your question."],
  },
  // Add more intents and their corresponding utterances and responses here
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
      } else if (userText.toLowerCase() === "no") {
        botResponse = questions.noResponse.message;
        createBotMessage(botResponse);
        setTimeout(
          () => createOptionButtons(questions.noResponse.options),
          1000
        );
        return; // Early return to avoid double response
      }
      createBotMessage(botResponse);
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

// Triggered when the chatbot is loaded
window.onload = function () {
  setTimeout(function () {
    createBotMessage(
      "Welcome to our survey today! These are the general instructions before you take the survey"
    );
  }, 500); // 3000 milliseconds = 3 seconds

  setTimeout(function () {
    createBotMessage("Hello, what is your name?");
  }, 1000); // 3000 milliseconds = 3 seconds
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
