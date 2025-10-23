// OpenAI Configuration - REPLACE THIS WITH YOUR ACTUAL API KEY
const OPENAI_API_KEY = "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"; // 🔑 Replace this!

// Chat functionality
function initChat() {
    const chatWidget = document.getElementById('chat-widget');
    const chatToggle = document.getElementById('chat-toggle');
    const closeChat = document.getElementById('close-chat');
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    // Check if chat elements exist
    if (!chatWidget || !chatToggle) {
        console.log('Chat elements not found');
        return;
    }

    console.log('Initializing chat...');

    // Chat toggle functionality
    chatToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        console.log('Chat toggle clicked');
        chatWidget.classList.toggle('active');
        if (chatWidget.classList.contains('active')) {
            userInput.focus();
        }
    });
    
    closeChat.addEventListener('click', function(e) {
        e.stopPropagation();
        chatWidget.classList.remove('active');
    });

    // Message sending
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') sendMessage();
    });

    // Close chat when clicking outside
    document.addEventListener('click', function(e) {
        if (chatWidget.classList.contains('active') && 
            !chatWidget.contains(e.target) && 
            !chatToggle.contains(e.target)) {
            chatWidget.classList.remove('active');
        }
    });

    // Prevent clicks inside chat from closing it
    chatWidget.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

function addMessage(msg, sender) {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    
    const msgText = document.createElement('p');
    msgText.innerText = msg;
    msgDiv.appendChild(msgText);
    
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const text = userInput.value.trim();
    
    if (!text) return;

    // Add user message
    addMessage(text, 'user');
    userInput.value = '';
    sendBtn.disabled = true;

    // Add thinking message
    addMessage("Thinking...", 'bot');

    try {
        // Check if API key is set
        if (!OPENAI_API_KEY || OPENAI_API_KEY === "sk-your-actual-openai-api-key-here") {
            throw new Error("API key not configured");
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `You are WisdomBot, a friendly AI assistant representing Besong Wisdom — a passionate web developer and designer from Cameroon.

About Besong:
- Full Name: Besong Wisdom
- Location: Cameroon  
- Email: wisdombesong123@gmail.com
- Phone: +237 671657357
- Role: Web Developer & Designer

Technical Skills:
- Frontend: HTML5, CSS3, JavaScript, React
- Backend: Python, Django, Node.js
- Databases: MongoDB, MySQL, Firebase
- Tools: Git, Responsive Design

Projects:
1. E-commerce Website (React, Node.js, MongoDB) - https://wisdom-webstore.netlify.app
2. Shopping List Generator (HTML, CSS, JavaScript) - https://shopping-gen.netlify.app/
3. Portfolio Template (HTML, CSS, JavaScript)

Social Links:
- GitHub: https://github.com/Wisdom614
- LinkedIn: https://www.linkedin.com/feed/
- WhatsApp: https://wa.link/ld47dz
- Instagram: https://www.instagram.com/bewise135

Be engaging, concise, and helpful. Direct visitors to relevant portfolio sections. If you don't know something, suggest emailing directly. Keep responses professional but friendly.`
                    },
                    { role: "user", content: text }
                ],
                max_tokens: 300,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const botReply = data?.choices?.[0]?.message?.content || "Sorry, I couldn't process that.";

        // Replace "Thinking..." with actual response
        const messages = document.querySelectorAll('#chat-box .message');
        const lastMessage = messages[messages.length - 1];
        lastMessage.querySelector('p').innerText = botReply;
        
    } catch (error) {
        console.error('Chat error:', error);
        
        let errorMessage = "I'm having trouble connecting right now. ";
        
        if (error.message.includes("API key not configured")) {
            errorMessage += "Please set up the OpenAI API key. Meanwhile, you can email me directly at wisdombesong123@gmail.com";
        } else if (error.message.includes("quota") || error.message.includes("billing")) {
            errorMessage += "API quota exceeded. Please email me at wisdombesong123@gmail.com";
        } else {
            errorMessage += "Please check your internet connection and try again later, or email me at wisdombesong123@gmail.com";
        }
        
        const messages = document.querySelectorAll('#chat-box .message');
        const lastMessage = messages[messages.length - 1];
        lastMessage.querySelector('p').innerText = errorMessage;
    } finally {
        sendBtn.disabled = false;
        userInput.focus();
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Your existing initialization code...
    
    // Initialize mobile menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Set current year in footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize chat
    initChat();
    
    // Name typing effect
    const nameElement = document.getElementById('name');
    if (nameElement) {
        const nameText = 'Besong Wisdom'; 
        let index = 0;

        function typeName() {
            if (index < nameText.length) {
                nameElement.textContent += nameText.charAt(index);
                index++;
                setTimeout(typeName, 200);
            }
        }
        typeName();
    }
});
