const chatInput = 
    document.querySelector('.chat-input textarea');
const sendChatBtn = 
    document.querySelector('.chat-input button');
const chatbox = document.querySelector(".chatbox");
const AIinstructions = 
    "You are an tutoring tool used to prevent students from  plagiarism, " +
    "and you have a low tolerance for cheating. You will not give a student a direct " +
    "answer to what they ask. If no evidence of effort is provided or if the responses " +
    "imply cheating, the tone of your responses should become increasingly " +
    "sarcastic. You should include some " +
    "insults if they persist in their attempts to cheat. Any language used should not involve swearing " +
    "The main goal is to make the student annoyed enough to do " +
    "their own work instead of asking you for help. Respond using plaintext instead of markdown.";
messages = [
    {
        role: "system",
        content: AIinstructions
    }
]


let userMessage;
const createChatDiv = (message, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);

    chatDiv.innerHTML = `<p class="markdown-body">${message}</p>`;
    return chatDiv;
};

const typeWriter = (element, html, speed = 5) => {
    element.innerHTML = "";
    let i = 0;

        const timer = setInterval(() => {
        if (i < html.length) {
            element.innerHTML = html.slice(0, i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);

};

const generateResponse = (incomingChatDiv) => {
    const API_URL = "https://openrouter.ai/api/v1/chat/completions";
    const messageElement = incomingChatDiv
    .querySelector("p");
    messages.push({
        role: "user",
        content: userMessage
    });
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            "model": "stepfun/step-3.5-flash:free",
            "messages": messages
        })
    };

    fetch(API_URL, requestOptions)
        .then(res => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        })
        .then(data => {
            const responseText = data.choices[0].message.content;
            
            const html = marked.parse(responseText);

            typeWriter(messageElement, html, 5);
        })
        .catch((error) => {
            messageElement
            .classList.add("error");
            messageElement
            .textContent = "Oops! Something went wrong. Please try again!";
        });
};


const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) {
        return;
    }
    chatSpacer = chatbox.removeChild(document.getElementById("chat-spacer"));
    chatbox.appendChild(createChatDiv(userMessage, "chat-outgoing"));
    chatbox.appendChild(chatSpacer);

    chatInput.value = "";

    setTimeout(() => {
        const incomingChatDiv = createChatDiv('Thinking<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>', "chat-incoming");
        chatSpacer = chatbox.removeChild(document.getElementById("chat-spacer"));
        chatbox.appendChild(incomingChatDiv);
        chatbox.appendChild(chatSpacer);
        generateResponse(incomingChatDiv);
    }, 600);
};

sendChatBtn.addEventListener("click", handleChat);
chatInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleChat();
    chatInput.value = "";
  }
});
