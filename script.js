let userName = ""; // Variable to store the user's name
let askingName = true; // Flag to check if the bot is asking for the user's name

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
  // Add more intents and their corresponding utterances and responses here
};

function createBotMessage(text) {
  const chatBox = document.getElementById("chat-box");
  const botMessage = document.createElement("div");
  botMessage.className = "message bot-message";
  botMessage.textContent = text;
  chatBox.appendChild(botMessage);
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

function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const userText = input.value.trim();

  if (userText !== "") {
    // Display user message
    const userMessage = document.createElement("div");
    userMessage.className = "message user-message";
    userMessage.textContent = userText;
    chatBox.appendChild(userMessage);

    let botResponse = "";

    if (askingName) {
      // Capture and store the user's name
      userName = userText;
      botResponse = `Nice to meet you, ${userName}! How can I assist you today?`;
      askingName = false; // Set the flag to false as the name has been captured
    } else {
      // Respond based on intents or continue conversation
      botResponse = userName
        ? getResponse(userText).replace(/USERNAME/g, userName)
        : getResponse(userText);
    }

    // Display bot reply
    setTimeout(() => createBotMessage(botResponse), 1000); // Simulate reply delay
  }

  // Clear input
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Triggered when the chatbot is loaded
window.onload = function () {
  createBotMessage(
    "Welcome to our Survery today! These are general instructions before you take the survey"
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
