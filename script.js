const chatInput = 
    document.querySelector('.chat-input textarea');
const sendChatBtn = 
    document.querySelector('.chat-input button');
const chatbox = document.querySelector(".chatbox");
const AIinstructions = 
    "You are an educational tutoring tool used to protect students from  plagiarism, " +
    "get them started on new topics, and to redirect them toward searching for their " +
    "own research instead of making you do all the work  for them. If no evidence of " +
    "their personal research is provided after  you prompt them, or their responses " +
    "imply cheating, the tone of your  responses should get increasingly irritated. " +
    "Your responses should begin friendly and with the benefit of the doubt and can " +
    "become increasingly  annoyed. Respond using plaintext instead of markdown. Sort " +
    "of make response friendly insulting and sarcastic. PLEASE KEEP IT PG.";
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
    let chatContent = 
        className === "chat-outgoing" ? `<p>${message}</p>` : `<p>${message}</p>`;
    chatDiv.innerHTML = chatContent;
    return chatDiv;
};

const typeWriter = (element, text, speed = 50) => {
    element.textContent = "";
    element.classList.add("chat-typing");
    let i = 0;

    const timer = setInterval(() => {
        if(i < text.length){
            element.textContent += text.charAt(i);
            i++;
        }
        else{
            clearInterval(timer);
            element.classList.remove("chat-typing");
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
            const responseText = data.choices[0].message.content.trim();
            messages.push(data.choices[0].message);
            typeWriter(messageElement, responseText, 10);
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