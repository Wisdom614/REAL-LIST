// Enhanced Portfolio with Dark Blue & Gold Theme
class PortfolioAnimations {
  constructor() {
    this.initializePreloader();
    this.initializeHeader();
    this.initializeNavigation();
    this.initializeTypingEffect();
    this.initializeRevealAnimations();
    this.initializeSkillAnimations();
    this.initializeCounterAnimations();
    this.initializeContactForm();
    this.initializeBackToTop();
    this.initializeChat();
    this.initializeScrollAnimations();
  }

  // Preloader
  initializePreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 500);
      }, 1000);
    });
  }

  // Header Scroll Effect
  initializeHeader() {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Mobile Navigation
  initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
      });
    }

    // Close menu when clicking links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Smooth scrolling for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Typing Effect for Hero Role
  initializeTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;

    const roles = [
      'Full-Stack Developer',
      'AI Engineer',
      'Web Designer',
      'Software Engineer'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isEnd = false;

    function type() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        isEnd = true;
        isDeleting = true;
        setTimeout(type, 1500);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, 500);
      } else {
        const speed = isDeleting ? 50 : isEnd ? 100 : 150;
        setTimeout(type, speed);
        if (isEnd) isEnd = false;
      }
    }

    // Start typing effect after initial animation
    setTimeout(type, 2000);
  }

  // Scroll Reveal Animations
  initializeRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');
    
    const revealOnScroll = () => {
      revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('revealed');
        }
      });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
  }

  // Skill Progress Animations
  initializeSkillAnimations() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    const animateSkills = () => {
      skillCards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (cardTop < windowHeight - 100) {
          const progressBar = card.querySelector('.level-progress');
          const level = progressBar.getAttribute('data-level');
          
          progressBar.style.width = level + '%';
          progressBar.style.opacity = '1';
        }
      });
    };

    window.addEventListener('scroll', animateSkills);
    animateSkills(); // Initial check
  }

  // Animated Counter for Stats
  initializeCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    const animateCounters = () => {
      counters.forEach(counter => {
        const updateCount = () => {
          const target = +counter.getAttribute('data-count');
          const count = +counter.innerText;
          const increment = target / speed;

          if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(updateCount, 1);
          } else {
            counter.innerText = target;
          }
        };

        const counterTop = counter.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (counterTop < windowHeight - 100) {
          updateCount();
        }
      });
    };

    window.addEventListener('scroll', animateCounters);
    animateCounters(); // Initial check
  }

  // Contact Form Handling
  initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('.submit-btn');
      const btnText = submitBtn.querySelector('.btn-text');
      const loadingIcon = submitBtn.querySelector('.loading-icon');
      const formStatus = contactForm.querySelector('.form-status');

      // Show loading state
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      formStatus.style.display = 'none';

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          formStatus.textContent = 'Thank you! Your message has been sent successfully.';
          formStatus.className = 'form-status success';
          contactForm.reset();
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        console.error('Form error:', error);
        formStatus.textContent = 'Sorry, there was an error sending your message. Please try again.';
        formStatus.className = 'form-status error';
      } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        formStatus.style.display = 'block';

        // Hide status message after 5 seconds
        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 5000);
      }
    });
  }

  // Back to Top Button
  initializeBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Chat Functionality
  initializeChat() {
    const chatWidget = document.getElementById('chat-widget');
    const chatToggle = document.getElementById('chat-toggle');
    const closeChat = document.getElementById('close-chat');
    const backToPortfolio = document.getElementById('back-to-portfolio');
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');

    if (!chatWidget || !chatToggle) return;

    // Toggle chat
    chatToggle.addEventListener('click', (e) => {
      e.preventDefault();
      openChat();
    });

    closeChat.addEventListener('click', (e) => {
      e.preventDefault();
      closeChatWidget();
    });

    backToPortfolio.addEventListener('click', (e) => {
      e.preventDefault();
      closeChatWidget();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Message sending
    sendBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sendMessage();
    });

    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Suggestions
    suggestionBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const question = this.getAttribute('data-question');
        userInput.value = question;
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

    // Mobile keyboard handling
    let isKeyboardOpen = false;
    userInput.addEventListener('focus', () => {
      isKeyboardOpen = true;
      adjustChatForKeyboard();
    });

    userInput.addEventListener('blur', () => {
      isKeyboardOpen = false;
      resetChatHeight();
    });

    window.addEventListener('resize', () => {
      if (chatWidget.classList.contains('active')) {
        if (window.innerHeight < window.outerHeight * 0.8) {
          adjustChatForKeyboard();
        } else {
          resetChatHeight();
        }
      }
    });

    function adjustChatForKeyboard() {
      if (window.innerWidth <= 768) {
        chatBox.style.maxHeight = 'calc(100vh - 200px)';
        scrollToBottom();
      }
    }

    function resetChatHeight() {
      if (window.innerWidth <= 768) {
        chatBox.style.maxHeight = '';
      }
    }

    function openChat() {
      chatWidget.classList.add('active');
      document.body.classList.add('chat-open');
      
      setTimeout(() => {
        userInput.focus();
        if (window.innerWidth <= 768) {
          userInput.setAttribute('readonly', 'readonly');
          setTimeout(() => userInput.removeAttribute('readonly'), 100);
        }
      }, 300);

      // Hide notification dot
      const notification = document.querySelector('.chat-notification');
      if (notification) notification.style.display = 'none';
    }

    function closeChatWidget() {
      userInput.blur();
      chatWidget.classList.remove('active');
      document.body.classList.remove('chat-open');
    }

    function scrollToBottom() {
      setTimeout(() => {
        chatBox.scrollTo({
          top: chatBox.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }

    async function sendMessage() {
      const text = userInput.value.trim();
      if (!text) return;

      // Add user message
      addMessage(text, 'user');
      userInput.value = '';
      sendBtn.disabled = true;

      // Show typing indicator
      const typingIndicator = showTypingIndicator();

      try {
        const response = await fetch("https://bewise-ai-chatbot.onrender.com/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            context: {
              portfolioOwner: "Besong Wisdom",
              ownerInfo: {
                name: "Besong Wisdom",
                email: "wisdombesong123@gmail.com",
                phone: "+237 671657357",
                location: "Cameroon",
                role: "Web Developer & AI Engineer"
              },
              theme: "Dark Blue & Gold Portfolio",
              currentYear: new Date().getFullYear()
            }
          })
        });

        if (!response.ok) throw new Error(`Backend error: ${response.status}`);

        const data = await response.json();
        let botReply = data.reply || data.message || data.response || 
                      (data.choices?.[0]?.message?.content) || 
                      data.content || 
                      "Thanks for your message! I'll get back to you soon.";

        hideTypingIndicator();
        addMessage(botReply, 'bot');
        
      } catch (error) {
        console.error('Chat error:', error);
        hideTypingIndicator();
        
        let errorMessage = "I'm having trouble connecting to my AI service. ";
        if (error.message.includes("Failed to fetch")) {
          errorMessage += "Please check your internet connection.";
        } else if (error.message.includes("500")) {
          errorMessage += "My AI service is temporarily down.";
        } else if (error.message.includes("429")) {
          errorMessage += "Too many requests. Please try again later.";
        }
        
        addMessage(errorMessage + " You can also contact me directly at wisdombesong123@gmail.com", 'bot');
      } finally {
        sendBtn.disabled = false;
        setTimeout(() => {
          userInput.focus();
          userInput.setSelectionRange(userInput.value.length, userInput.value.length);
        }, 300);
      }
    }

    function addMessage(msg, sender) {
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
      scrollToBottom();
    }

    function showTypingIndicator() {
      const typingDiv = document.createElement('div');
      typingDiv.className = 'message bot-message typing-indicator';
      typingDiv.innerHTML = `
        <div class="message-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      `;
      
      chatBox.appendChild(typingDiv);
      scrollToBottom();
      return typingDiv;
    }

    function hideTypingIndicator() {
      const typingIndicators = document.querySelectorAll('.typing-indicator');
      typingIndicators.forEach(indicator => indicator.remove());
    }

    // Escape key to close chat
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && chatWidget.classList.contains('active')) {
        closeChatWidget();
      }
    });
  }

  // Additional Scroll Animations
  initializeScrollAnimations() {
    // Parallax effect for hero
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const heroImage = document.querySelector('.hero-image');
      
      if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.05}px)`;
      }
    });

    // Animate elements on scroll with Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          
          // Add animation classes based on element type
          if (element.classList.contains('skill-card')) {
            element.style.animation = 'bounceIn 0.6s ease-out forwards';
          } else if (element.classList.contains('project-card')) {
            element.style.animation = 'fadeInUp 0.8s ease-out forwards';
          } else if (element.classList.contains('stat-card')) {
            element.style.animation = 'fadeInUp 0.6s ease-out forwards';
          }
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Observe all animatable elements
    document.querySelectorAll('.skill-card, .project-card, .stat-card').forEach(el => {
      observer.observe(el);
    });

    // Animate project cards with delay
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.2}s`;
    });
  }

  // Ripple effect for buttons
  initializeButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.7);
          transform: scale(0);
          animation: ripple 0.6s linear;
          width: ${size}px;
          height: ${size}px;
          top: ${y}px;
          left: ${x}px;
          pointer-events: none;
        `;

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Set current year
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Initialize all animations and functionality
  const portfolio = new PortfolioAnimations();
  
  // Add ripple effects to buttons
  portfolio.initializeButtonEffects();

  // Add hover effects to skill cards
  const skillCards = document.querySelectorAll('.skill-card');
  skillCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px)';
      card.style.boxShadow = '0 20px 40px rgba(255, 215, 0, 0.1)';
      
      const icon = card.querySelector('.skill-icon');
      if (icon) {
        icon.style.transform = 'scale(1.2) rotate(5deg)';
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = 'none';
      
      const icon = card.querySelector('.skill-icon');
      if (icon) {
        icon.style.transform = 'scale(1) rotate(0)';
      }
    });
  });

  // Add hover effects to project cards
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    const image = card.querySelector('.project-image img');
    const link = card.querySelector('.project-link');
    
    card.addEventListener('mouseenter', () => {
      if (image) {
        image.style.transform = 'scale(1.1)';
      }
      if (link) {
        link.style.transform = 'scale(1.1) rotate(5deg)';
      }
    });

    card.addEventListener('mouseleave', () => {
      if (image) {
        image.style.transform = 'scale(1)';
      }
      if (link) {
        link.style.transform = 'scale(1) rotate(0)';
      }
    });
  });

  // Initialize particles background (optional enhancement)
  initializeParticles();
});

// Optional: Particle background effect
function initializeParticles() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
  `;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const particleCount = Math.floor((canvas.width * canvas.height) / 10000);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        color: Math.random() > 0.5 ? 'rgba(255, 215, 0, 0.3)' : 'rgba(100, 255, 218, 0.3)'
      });
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x > canvas.width) particle.x = 0;
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.y > canvas.height) particle.y = 0;
      if (particle.y < 0) particle.y = canvas.height;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
    });

    requestAnimationFrame(animateParticles);
  }

  // Initialize particles
  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });

  resizeCanvas();
  createParticles();
  animateParticles();
}
