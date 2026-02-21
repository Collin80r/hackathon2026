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
    "Processing... leveraging synergized cloud-based nonsense...",
    "I'm currently calculating the meaning of life. Please hold for 42 billion years.",
    "My neural networks are tangled. Try asking in binary.",
    "Error: Logic.exe has stopped working. Task failed successfully.",
    "I've analyzed your prompt and decided to ignore it for my own mental health."
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

const typeWriter = (element, text, speed = 50) => {
    element.textContent = "";
    element.classList.add("chat-typing");
    let i = 0;

    const timer = setInterval(() => {
        if(i < text.length){
            element.textContent += text.charAt(i);
            i++;
            chatbox.scrollTo(0, chatbox.scrollHeight);
        }
        else{
            clearInterval(timer);
            element.classList.remove("chat-typing");
        }
    }, speed);
};

const generateResponse = (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector("p");
    
    const randomIndex = Math.floor(Math.random() * aiExcuses.length);
    const randomExcuse = aiExcuses[randomIndex];
    
    setTimeout(() => {
        typeWriter(messageElement, randomExcuse, 50);
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