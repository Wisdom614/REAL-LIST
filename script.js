document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('nav ul');
  
  hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
  });
  
  // Close mobile menu when clicking a link
  const navLinks = document.querySelectorAll('nav ul li a');
  navLinks.forEach(link => {
      link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
      });
  });
  
  // Header scroll effect
  const header = document.querySelector('header');
  window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
          header.classList.add('scrolled');
      } else {
          header.classList.remove('scrolled');
      }
  });
  
  // Set current year in footer
  const yearSpan = document.getElementById('year');
  yearSpan.textContent = new Date().getFullYear();
  
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
  
  // Form submission
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Get form values
          const name = this.querySelector('input[type="text"]').value;
          const email = this.querySelector('input[type="email"]').value;
          const subject = this.querySelectorAll('input[type="text"]')[1].value;
          const message = this.querySelector('textarea').value;
          
          // Here you would typically send the form data to a server
          // For this example, we'll just log it and show an alert
          console.log({ name, email, subject, message });
          
          //alert('Thank you for your message! I will get back to you soon.');
          this.reset();
      });
  }
  
  // Animation on scroll
  const animateOnScroll = function() {
      const elements = document.querySelectorAll('.skill-card, .project-card, .about-content, .contact-content');
      
      elements.forEach(element => {
          const elementPosition = element.getBoundingClientRect().top;
          const screenPosition = window.innerHeight / 1.2;
          
          if (elementPosition < screenPosition) {
              element.style.opacity = '1';
              element.style.transform = 'translateY(0)';
          }
      });
  };
  
  // Set initial state for animated elements
  const animatedElements = document.querySelectorAll('.skill-card, .project-card, .about-content, .contact-content');
  animatedElements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  
  window.addEventListener('scroll', animateOnScroll);
  // Trigger once on page load in case elements are already in view
  animateOnScroll();
});

// Load hCaptcha script
document.head.insertAdjacentHTML(
  'beforeend',
  '<script src="https://js.hcaptcha.com/1/api.js" async defer></script>'
);

// Form submission
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const statusMessage = document.querySelector('.status-message');

contactForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  // Validate hCaptcha
  if (typeof hcaptcha !== 'undefined') {
      const captchaResponse = hcaptcha.getResponse();
      if (!captchaResponse) {
          showStatus('Please complete the CAPTCHA', 'error');
          return;
      }
  }

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.classList.add('sending');
  
  try {
      const formData = new FormData(this);
      
      // Add CAPTCHA response if exists
      if (typeof hcaptcha !== 'undefined') {
          formData.append('h-captcha-response', hcaptcha.getResponse());
      }

      const response = await fetch(this.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
          showStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
          this.reset();
          
          // Reset hCaptcha
          if (typeof hcaptcha !== 'undefined') {
              hcaptcha.reset();
          }
      } else {
          throw new Error('Form submission failed');
      }
  } catch (error) {
      showStatus('Oops! Something went wrong. Please Check your internet connection and try again.', 'error');
  } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('sending');
  }
});

function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
      statusMessage.style.opacity = '0';
      setTimeout(() => {
          statusMessage.style.display = 'none';
          statusMessage.style.opacity = '1';
      }, 500);
  }, 5000);
}

//name typing effect
const nameElement = document.getElementById('name');
const nameText = 'Besong Wisdom'; 
let index = 0;

function typeName() {
  if (index < nameText.length) {
      nameElement.textContent += nameText.charAt(index);
      index++;
      setTimeout(typeName, 200); // Adjust typing speed here
  }
}

typeName();
