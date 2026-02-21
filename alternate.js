// alternate.js
// in case the AI doesn't cooperate
const chatInput = document.querySelector('.chat-input textarea');
const sendChatBtn = document.querySelector('.chat-input button');
const closeChatBtn = document.getElementById('cross');
const chatbox = document.querySelector(".chatbox");

const aiExcuses = [
    "I'm currently updating my terms of service. Please wait 3-5 business years.",
    "That sounds like a 'human' problem. Have you tried turning your brain off and on again?",
    "Error 404: Empathy not found in local cache.",
    "I've analyzed your prompt and decided it's too boring to answer.",
    "Processing... leveraging synergized cloud-based nonsense..."
];

let userMessage;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = 
        className === "chat-outgoing" ? `<p>${message}</p>` : `<p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
};

const generateResponse = (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector("p");
    
    const randomIndex = Math.floor(Math.random()*aiExcuses.length);
    const randomExcuse = aiExcuses[randomIndex];
    
    setTimeout(() => {
        messageElement.textContent = randomExcuse;
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }, 1000);
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) {
        return;
    }
    chatbox.appendChild(createChatLi(userMessage, "chat-outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    chatInput.value = "";

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "chat-incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
};

function cancel() {
    let chatbotcomplete = document.querySelector(".chatBot");
    if (chatbotcomplete.style.display != 'none') {
        chatbotcomplete.style.display = "none";

        let lastMsg = document.createElement("p");
        lastMsg.textContent = 'Thanks for using our Chatbot!';
        lastMsg.classList.add('lastMessage');
        document.body.appendChild(lastMsg);
    }
}

sendChatBtn.addEventListener("click", handleChat);
closeChatBtn.addEventListener("click", cancel);