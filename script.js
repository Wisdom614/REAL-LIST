// -------------------------------
// Chat Widget Logic
// -------------------------------

// Select elements
const chatWindow = document.querySelector(".chat-window");
const chatToggle = document.querySelector(".chat-toggle");
const chatClose = document.querySelector(".chat-close");
const chatMessages = document.querySelector(".chat-messages");
const chatInput = document.querySelector("#chat-input");
const chatSendBtn = document.querySelector("#chat-send");

// Open chat
chatToggle.addEventListener("click", () => {
    chatWindow.classList.add("open");
});

// Close chat
chatClose.addEventListener("click", () => {
    chatWindow.classList.remove("open");
});

// Add message to UI
function addMessage(text, sender = "user") {
    const message = document.createElement("div");
    message.classList.add("message", sender);
    message.innerHTML = `
        <div class="bubble">${text}</div>
        <span class="time">${new Date().toLocaleTimeString()}</span>
    `;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// -------------------------------
// Bytez API FUNCTION
// -------------------------------
async function sendMessageToAI(userMessage) {
    const API_KEY = "38096021ad42c6262999bf38eafe7803";

    try {
        const response = await fetch("https://api.bytez.com/v1/chat", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "bytez-1",
                messages: [
                    { role: "user", content: userMessage }
                ]
            })
        });

        if (!response.ok) {
            throw new Error("Network response failed");
        }

        const data = await response.json();
        console.log("AI Response:", data);

        return data?.choices?.[0]?.message?.content || "I didn't understand that.";
    
    } catch (error) {
        console.error(error);
        return "Connection error. Please try again.";
    }
}

// -------------------------------
// SEND MESSAGE EVENT
// -------------------------------
chatSendBtn.addEventListener("click", async () => {
    const message = chatInput.value.trim();
    if (message === "") return;

    addMessage(message, "user");
    chatInput.value = "";

    // show loading bubble
    addMessage("Typing...", "bot");
    const loadingBubble = chatMessages.lastChild.querySelector(".bubble");

    // Fetch AI reply
    const reply = await sendMessageToAI(message);

    // Replace typing with real answer
    loadingBubble.innerText = reply;
});

// Allow enter key to send
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        chatSendBtn.click();
    }
});
