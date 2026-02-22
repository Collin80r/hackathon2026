const chatInput = 
    document.querySelector('.chat-input textarea');
const sendChatBtn = 
    document.querySelector('.chat-input button');
const chatbox = document.querySelector(".chatbox");

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
    AIinstructions = 
    "You are an educational tutoring tool used to protect students from  plagiarism, " +
    "get them started on new topics, and to redirect them toward searching for their " +
    "own research instead of making you do all the work  for them. If no evidence of " +
    "their personal research is provided after  you prompt them, or their responses " +
    "imply cheating, the tone of your  responses should get increasingly irritated. " +
    "Your responses should begin friendly and with the benefit of the doubt and can " +
    "become increasingly  annoyed. Respond using plaintext instead of markdown.";
    const messageElement = incomingChatDiv
    .querySelector("p");
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            "model": "stepfun/step-3.5-flash:free",
            "messages": [
                {
                    role: "system",
                    content: AIinstructions
                },
                {
                    role: "user",
                    content: userMessage
                }
            ]
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
    chatbox
    .appendChild(createChatDiv(userMessage, "chat-outgoing"));

    chatInput.value = "";

    setTimeout(() => {
        const incomingChatDiv = createChatDiv("Thinking...", "chat-incoming");
        chatbox.appendChild(incomingChatDiv);
        generateResponse(incomingChatDiv);
    }, 600);
};

sendChatBtn.addEventListener("click", handleChat);

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