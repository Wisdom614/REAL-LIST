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

    // Check if chat elements exist
    if (!chatWidget || !chatToggle) {
        console.log('Chat elements not found');
        return;
    }

    console.log('Initializing full-screen chat with mobile keyboard support...');

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
            // Focus and ensure keyboard opens
            setTimeout(() => {
                userInput.focus();
                userInput.setSelectionRange(userInput.value.length, userInput.value.length);
            }, 100);
        });
    });

    // Input validation
    userInput.addEventListener('input', function() {
        this.value = this.value.slice(0, 500);
        sendBtn.disabled = !this.value.trim();
    });

    // Handle mobile keyboard events
    let isKeyboardOpen = false;
    let originalChatHeight = '';

    userInput.addEventListener('focus', function() {
        isKeyboardOpen = true;
        console.log('Keyboard focused');
        
        // Store original height
        originalChatHeight = chatWidget.style.height;
        
        // Adjust chat for mobile keyboard
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                chatWidget.style.height = '100vh';
                chatBox.style.maxHeight = 'calc(100vh - 200px)';
                scrollToBottom();
            }, 300);
        }
    });

    userInput.addEventListener('blur', function() {
        isKeyboardOpen = false;
        console.log('Keyboard blurred');
        
        // Reset chat height when keyboard closes
        setTimeout(() => {
            if (!originalChatHeight) {
                chatWidget.style.height = '';
                chatBox.style.maxHeight = '';
            }
        }, 200);
    });

    // Handle window resize (for keyboard show/hide on iOS)
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            if (window.innerHeight < window.outerHeight * 0.8) {
                // Keyboard is likely open
                isKeyboardOpen = true;
                adjustForKeyboard();
            } else {
                // Keyboard is likely closed
                isKeyboardOpen = false;
                resetChatHeight();
            }
        }, 100);
    });

    function adjustForKeyboard() {
        if (window.innerWidth <= 768 && chatWidget.classList.contains('active')) {
            chatBox.style.maxHeight = 'calc(100vh - 250px)';
            scrollToBottom();
        }
    }

    function resetChatHeight() {
        if (window.innerWidth <= 768 && chatWidget.classList.contains('active')) {
            chatBox.style.maxHeight = '';
        }
    }

    function scrollToBottom() {
        setTimeout(() => {
            chatBox.scrollTo({
                top: chatBox.scrollHeight,
                behavior: 'smooth'
            });
        }, 100);
    }

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
            // Lock body scroll but allow chat scroll
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.classList.remove('chat-open');
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
    }

    function openChat() {
        chatWidget.classList.add('active');
        updateBodyScroll();
        
        // Use a more reliable focus method for mobile
        setTimeout(() => {
            userInput.focus();
            // Force keyboard to open on mobile
            if (window.innerWidth <= 768) {
                userInput.setAttribute('readonly', 'readonly'); // Force keyboard to show
                setTimeout(() => {
                    userInput.removeAttribute('readonly');
                }, 100);
            }
        }, 300);
        
        chatToggle.classList.remove('pulse');
        
        // Hide notification dot when chat is opened
        const notification = document.querySelector('.chat-notification');
        if (notification) {
            notification.style.display = 'none';
        }
    }

    function closeChatWidget() {
        // Blur input first to hide keyboard
        userInput.blur();
        
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
    scrollToBottom();
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
    scrollToBottom();
    
    return typingDiv;
}

function hideTypingIndicator() {
    const typingIndicators = document.querySelectorAll('.typing-indicator');
    typingIndicators.forEach(indicator => {
        indicator.remove();
    });
}

function scrollToBottom() {
    const chatBox = document.getElementById('chat-box');
    setTimeout(() => {
        chatBox.scrollTo({
            top: chatBox.scrollHeight,
            behavior: 'smooth'
        });
    }, 100);
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

    // Don't blur on mobile - keep keyboard open for quick responses
    if (window.innerWidth > 768) {
        userInput.blur();
    }

    // Show typing indicator
    const typingIndicator = showTypingIndicator();

    try {
        // Send to your custom backend at bewise-ai-chatbot.onrender.com
        const response = await fetch("https://bewise-ai-chatbot.onrender.com/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: text,
                // Add context about the portfolio for personalized responses
                context: {
                    portfolioOwner: "Besong Wisdom",
                    ownerInfo: {
                        name: "Besong Wisdom",
                        email: "wisdombesong123@gmail.com",
                        phone: "+237 671657357",
                        location: "Cameroon",
                        role: "Web Developer & Designer"
                    },
                    portfolioLinks: {
                        github: "https://github.com/Wisdom614",
                        linkedin: "https://www.linkedin.com/feed/",
                        whatsapp: "https://wa.link/ld47dz",
                        instagram: "https://www.instagram.com/bewise135",
                        ecommerce: "https://wisdom-webstore.netlify.app",
                        shoppingList: "https://shopping-gen.netlify.app/"
                    }
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Backend error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // Handle different possible response formats
        let botReply;
        if (data.reply) {
            botReply = data.reply;
        } else if (data.message) {
            botReply = data.message;
        } else if (data.response) {
            botReply = data.response;
        } else if (data.choices && data.choices[0] && data.choices[0].message) {
            // OpenAI-compatible format
            botReply = data.choices[0].message.content;
        } else if (data.content) {
            botReply = data.content;
        } else if (typeof data === 'string') {
            botReply = data;
        } else {
            botReply = "Thanks for your message! I'll get back to you soon.";
        }

        // Remove typing indicator and add bot message
        hideTypingIndicator();
        addMessage(botReply, 'bot');
        
    } catch (error) {
        console.error('Chat error:', error);
        
        // Remove typing indicator
        hideTypingIndicator();
        
        let errorMessage = "I'm having trouble connecting to my AI service. ";
        
        if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
            errorMessage += "Please check your internet connection and try again. ";
        } else if (error.message.includes("500")) {
            errorMessage += "My AI service is temporarily down. ";
        } else if (error.message.includes("429")) {
            errorMessage += "Too many requests. Please try again in a moment. ";
        } else if (error.message.includes("404")) {
            errorMessage += "The chat service endpoint was not found. ";
        } else if (error.message.includes("401") || error.message.includes("403")) {
            errorMessage += "Authentication error with the chat service. ";
        }
        
        errorMessage += "You can also contact me directly at wisdombesong123@gmail.com or call +237 671657357.";
        
        addMessage(errorMessage, 'bot');
    } finally {
        sendBtn.disabled = false;
        
        // Refocus input for next message
        setTimeout(() => {
            userInput.focus();
            userInput.setSelectionRange(userInput.value.length, userInput.value.length);
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
            statusMessage.textContent = 'Sorry, there was an error sending your message. Please try again or email me directly at wisdombesong123@gmail.com';
            statusMessage.className = 'status-message error';
        } finally {
            submitBtn.classList.remove('sending');
            submitBtn.disabled = false;
            
            // Show status message
            statusMessage.style.display = 'block';
            
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

// Handle window resize for chat
let chatResizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(chatResizeTimeout);
    chatResizeTimeout = setTimeout(function() {
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
