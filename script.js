// OpenAI Configuration - REPLACE THIS WITH YOUR ACTUAL API KEY
const OPENAI_API_KEY = "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";

// Enhanced Chat functionality with mobile fixes
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

    console.log('Initializing enhanced chat with mobile support...');

    // Add pulse animation to toggle button
    chatToggle.classList.add('pulse');

    // Chat toggle functionality
    chatToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Chat toggle clicked');
        
        const isOpening = !chatWidget.classList.contains('active');
        chatWidget.classList.toggle('active');
        
        if (chatWidget.classList.contains('active')) {
            // Opening chat
            userInput.focus();
            chatToggle.classList.remove('pulse');
            document.body.classList.add('chat-open');
            
            // Add small delay for iOS to handle focus properly
            setTimeout(() => {
                userInput.focus();
            }, 100);
        } else {
            // Closing chat
            document.body.classList.remove('chat-open');
            // Restart pulse animation after a delay when closing
            setTimeout(() => {
                if (!chatWidget.classList.contains('active')) {
                    chatToggle.classList.add('pulse');
                }
            }, 3000);
        }
    });
    
    closeChat.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        chatWidget.classList.remove('active');
        document.body.classList.remove('chat-open');
        
        // Restart pulse animation after a delay
        setTimeout(() => {
            if (!chatWidget.classList.contains('active')) {
                chatToggle.classList.add('pulse');
            }
        }, 3000);
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

    // Input validation
    userInput.addEventListener('input', function() {
        this.value = this.value.slice(0, 500);
        sendBtn.disabled = !this.value.trim();
    });

    // Touch events for better mobile handling
    chatWidget.addEventListener('touchstart', function(e) {
        e.stopPropagation();
    }, { passive: true });

    chatToggle.addEventListener('touchstart', function(e) {
        e.stopPropagation();
    }, { passive: true });

    // Close chat when clicking outside
    document.addEventListener('click', function(e) {
        if (chatWidget.classList.contains('active') && 
            !chatWidget.contains(e.target) && 
            !chatToggle.contains(e.target)) {
            chatWidget.classList.remove('active');
            document.body.classList.remove('chat-open');
            
            setTimeout(() => {
                if (!chatWidget.classList.contains('active')) {
                    chatToggle.classList.add('pulse');
                }
            }, 3000);
        }
    });

    // Handle escape key to close chat
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && chatWidget.classList.contains('active')) {
            chatWidget.classList.remove('active');
            document.body.classList.remove('chat-open');
        }
    });

    // Prevent zoom on input focus for mobile
    userInput.addEventListener('focus', function() {
        setTimeout(() => {
            this.setAttribute('readonly', 'readonly');
            setTimeout(() => {
                this.removeAttribute('readonly');
            }, 100);
        }, 10);
    });

    // Handle mobile virtual keyboard
    let initialViewport = document.querySelector('meta[name="viewport"]').content;
    
    userInput.addEventListener('focus', function() {
        document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no');
    });
    
    userInput.addEventListener('blur', function() {
        document.querySelector('meta[name="viewport"]').setAttribute('content', initialViewport);
    });
}

function addMessage(msg, sender) {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    
    const msgText = document.createElement('p');
    msgText.textContent = msg;
    msgDiv.appendChild(msgText);
    
    chatBox.appendChild(msgDiv);
    
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
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'typing-indicator active';
    
    const typingContent = document.createElement('div');
    typingContent.className = 'typing-dots';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        typingContent.appendChild(dot);
    }
    
    typingDiv.appendChild(typingContent);
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
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
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
