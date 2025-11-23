// Bytez API Key (Frontend — risky; use backend if possible)
const BYTEZ_API_KEY = "38096021ad42c6262999bf38eafe7803";

// Enhanced Chat functionality with proper mobile keyboard handling
function initChat() {
    const chatWidget = document.getElementById('chat-widget');
    const chatToggle = document.getElementById('chat-toggle');
    const closeChat = document.getElementById('close-chat');
    const backToPortfolio = document.getElementById('back-to-portfolio');
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');

    if (!chatWidget || !chatToggle) return;

    chatToggle.classList.add('pulse');

    chatToggle.addEventListener('click', function(e) {
        e.preventDefault();
        openChat();
    });

    closeChat.addEventListener('click', function(e) {
        e.preventDefault();
        closeChatWidget();
    });

    backToPortfolio.addEventListener('click', function(e) {
        e.preventDefault();
        closeChatWidget();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    sendBtn.addEventListener('click', function(e) {
        e.preventDefault();
        sendMessage();
    });

    userInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });

    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            userInput.value = this.getAttribute('data-question');
            setTimeout(() => {
                userInput.focus();
                userInput.setSelectionRange(userInput.value.length, userInput.value.length);
            }, 100);
        });
    });

    userInput.addEventListener('input', function() {
        this.value = this.value.slice(0, 500);
        sendBtn.disabled = !this.value.trim();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && chatWidget.classList.contains('active')) {
            closeChatWidget();
        }
    });

    function updateBodyScroll() {
        if (chatWidget.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
    }

    function openChat() {
        chatWidget.classList.add('active');
        updateBodyScroll();
        setTimeout(() => userInput.focus(), 300);
        chatToggle.classList.remove('pulse');
    }

    function closeChatWidget() {
        userInput.blur();
        chatWidget.classList.remove('active');
        updateBodyScroll();
        setTimeout(() => chatToggle.classList.add('pulse'), 3000);
    }

    window.openChat = openChat;
    window.closeChatWidget = closeChatWidget;
}

function addMessage(msg, sender) {
    const chatBox = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    
    div.innerHTML = `
        <div class="message-avatar"><i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i></div>
        <div class="message-content">
            <p>${msg}</p>
            <span class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
    `;
    
    chatBox.appendChild(div);
    scrollToBottom();
}

function showTypingIndicator() {
    const chatBox = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.className = 'typing-indicator active';
    div.innerHTML = `
        <div class="message-avatar"><i class="fas fa-robot"></i></div>
        <div class="typing-content">
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    chatBox.appendChild(div);
    scrollToBottom();
    return div;
}

function hideTypingIndicator() {
    document.querySelectorAll('.typing-indicator').forEach(t => t.remove());
}

function scrollToBottom() {
    const chatBox = document.getElementById('chat-box');
    setTimeout(() => {
        chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
    }, 100);
}

async function sendMessage() {
    const input = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';
    sendBtn.disabled = true;

    const typing = showTypingIndicator();

    try {
        const response = await fetch("https://api.bytez.com/v1/papers", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${BYTEZ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: text,
                system_prompt: `
You are WisdomBot, assistant for Besong Wisdom — Web Developer & Designer from Cameroon.
Respond professionally, friendly, and under 150 words unless necessary.
Portfolio links:
GitHub: https://github.com/Wisdom614
LinkedIn: https://www.linkedin.com/feed/
WhatsApp: https://wa.link/ld47dz
Instagram: https://www.instagram.com/bewise135`,
                max_length: 300
            })
        });

        const data = await response.json();
        const reply = data?.content || data?.response || "I couldn't process that.";

        hideTypingIndicator();
        addMessage(reply, 'bot');

    } catch (err) {
        hideTypingIndicator();
        addMessage("Connection error. Please try again.", "bot");
    }

    sendBtn.disabled = false;
    setTimeout(() => input.focus(), 200);
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const statusMessage = document.querySelector('.status-message');

        submitBtn.disabled = true;
        submitBtn.classList.add('sending');

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                statusMessage.textContent = 'Message sent successfully!';
                statusMessage.className = 'status-message success';
                contactForm.reset();
            } else {
                throw new Error();
            }
        } catch {
            statusMessage.textContent = 'Error sending message.';
            statusMessage.className = 'status-message error';
        }

        submitBtn.disabled = false;
        submitBtn.classList.remove('sending');

        setTimeout(() => statusMessage.style.display = 'none', 5000);
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    initChat();
    initContactForm();

    // Mobile menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });

    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});
