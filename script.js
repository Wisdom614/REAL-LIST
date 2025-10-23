// OpenAI Configuration - REPLACE THIS WITH YOUR ACTUAL API KEY
const OPENAI_API_KEY = "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";

// Enhanced Chat functionality with full-screen support
function initChat() {
    const chatWidget = document.getElementById('chat-widget');
    const chatToggle = document.getElementById('chat-toggle');
    const closeChat = document.getElementById('close-chat');
    const backToPortfolio = document.getElementById('back-to-portfolio');
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');

    // Check if chat elements exist
    if (!chatWidget || !chatToggle) {
        console.log('Chat elements not found');
        return;
    }

    console.log('Initializing full-screen chat...');

    // Add pulse animation to toggle button
    chatToggle.classList.add('pulse');

    // Chat toggle functionality
    chatToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openChat();
    });
    
    // Close chat functionality
    closeChat.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeChatWidget();
    });
    
    // Back to portfolio functionality
    backToPortfolio.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeChatWidget();
        
        // Smooth scroll to top of portfolio
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Message sending
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

    // Suggestion buttons
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            userInput.value = question;
            sendMessage();
        });
    });

    // Input validation
    userInput.addEventListener('input', function() {
        this.value = this.value.slice(0, 500);
        sendBtn.disabled = !this.value.trim();
    });

    // Close chat with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && chatWidget.classList.contains('active')) {
            closeChatWidget();
        }
    });

    // Prevent body scroll when chat is open
    function updateBodyScroll() {
        if (chatWidget.classList.contains('active')) {
            document.body.classList.add('chat-open');
        } else {
            document.body.classList.remove('chat-open');
        }
    }

    function openChat() {
        chatWidget.classList.add('active');
        updateBodyScroll();
        userInput.focus();
        chatToggle.classList.remove('pulse');
        
        // Hide notification dot when chat is opened
        const notification = document.querySelector('.chat-notification');
        if (notification) {
            notification.style.display = 'none';
        }
        
        // Add small delay for iOS to handle focus properly
        setTimeout(() => {
            userInput.focus();
        }, 100);
    }

    function closeChatWidget() {
        chatWidget.classList.remove('active');
        updateBodyScroll();
        
        // Restart pulse animation after a delay
        setTimeout(() => {
            if (!chatWidget.classList.contains('active')) {
                chatToggle.classList.add('pulse');
            }
        }, 3000);
    }

    // Make functions globally available
    window.openChat = openChat;
    window.closeChatWidget = closeChatWidget;
}

function addMessage(msg, sender) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i>
        </div>
        <div class="message-content">
            <p>${msg}</p>
            <span class="message-time">${time}</span>
        </div>
    `;
    
    chatBox.appendChild(messageDiv);
    
    // Scroll to bottom with smooth behavior
    setTimeout(() => {
        chatBox.scrollTo({
            top: chatBox.scrollHeight,
            behavior: 'smooth'
        });
    }, 100);
}

function showTypingIndicator() {
    const chatBox = document.getElementById('chat-box');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator active';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="typing-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatBox.appendChild(typingDiv);
    
    // Scroll to show typing indicator
    setTimeout(() => {
        chatBox.scrollTo({
            top: chatBox.scrollHeight,
            behavior: 'smooth'
        });
    }, 100);
    
    return typingDiv;
}

function hideTypingIndicator() {
    const typingIndicators = document.querySelectorAll('.typing-indicator');
    typingIndicators.forEach(indicator => {
        indicator.remove();
    });
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

    // Hide mobile keyboard
    userInput.blur();

    // Show typing indicator
    const typingIndicator = showTypingIndicator();

    try {
        // Check if API key is set
        if (!OPENAI_API_KEY || OPENAI_API_KEY === "your-actual-openai-api-key-here") {
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

Be engaging, concise, and helpful. Direct visitors to relevant portfolio sections. If you don't know something, suggest emailing directly. Keep responses professional but friendly. Keep responses under 150 words unless absolutely necessary.`
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

        // Remove typing indicator and add bot message
        hideTypingIndicator();
        addMessage(botReply, 'bot');
        
    } catch (error) {
        console.error('Chat error:', error);
        
        // Remove typing indicator
        hideTypingIndicator();
        
        let errorMessage = "I'm having trouble connecting right now. ";
        
        if (error.message.includes("API key not configured")) {
            errorMessage += "Please set up the OpenAI API key. Meanwhile, you can email me directly at wisdombesong123@gmail.com";
        } else if (error.message.includes("quota") || error.message.includes("billing")) {
            errorMessage += "API quota exceeded. Please email me at wisdombesong123@gmail.com";
        } else if (error.message.includes("network") || error.message.includes("fetch")) {
            errorMessage += "Network connection issue. Please check your internet and try again.";
        } else {
            errorMessage += "Please try again later or email me at wisdombesong123@gmail.com";
        }
        
        addMessage(errorMessage, 'bot');
    } finally {
        sendBtn.disabled = false;
        // Refocus input for next message
        setTimeout(() => {
            userInput.focus();
        }, 300);
    }
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitBtnText = submitBtn.querySelector('.btn-text');
        const loadingIcon = submitBtn.querySelector('.loading-icon');
        const statusMessage = document.querySelector('.status-message');
        
        // Show loading state
        submitBtn.classList.add('sending');
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                statusMessage.textContent = 'Thank you! Your message has been sent successfully.';
                statusMessage.className = 'status-message success';
                contactForm.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            statusMessage.textContent = 'Sorry, there was an error sending your message. Please try again or email me directly.';
            statusMessage.className = 'status-message error';
        } finally {
            submitBtn.classList.remove('sending');
            submitBtn.disabled = false;
            
            // Hide status message after 5 seconds
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 5000);
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
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
        
        // Start typing after a short delay
        setTimeout(typeName, 1000);
    }
    
    // Initialize contact form
    initContactForm();
    
    // Initialize chat with a small delay to ensure everything is loaded
    setTimeout(initChat, 1000);
});

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Adjust chat widget if needed
        const chatWidget = document.getElementById('chat-widget');
        if (chatWidget && chatWidget.classList.contains('active')) {
            // Force reflow for mobile orientation changes
            chatWidget.style.display = 'none';
            setTimeout(() => {
                chatWidget.style.display = 'flex';
            }, 10);
        }
    }, 250);
});
