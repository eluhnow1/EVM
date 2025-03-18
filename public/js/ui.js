// ui.js - UI enhancements for DeFund Me

document.addEventListener('DOMContentLoaded', function() {
    initUI();
    observeAnimatedElements();
  });
  
  // Initialize UI enhancements
  function initUI() {
    // Add the loader animation globally
    addLoaderAnimation();
    
    // Add confirmation animations and effects
    addButtonEffects();
    
    // Add form animations
    addFormAnimations();
    
    // Add smooth progress bar animations
    animateProgressBars();
    
    // Add toast notifications system
    initToastSystem();
    
    // Add scroll animations
    initScrollAnimations();
    
    // Initialize dark mode toggle if present
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
      initDarkMode(darkModeToggle);
    }
  }
  
  // Loading animation handler
  function addLoaderAnimation() {
    // Replace all loading divs with animated spinner
    const loadingElements = document.querySelectorAll('.loading');
    
    loadingElements.forEach(el => {
      el.innerHTML = `
        <div class="loading__spinner"></div>
        <p class="loading__text">Loading data...</p>
      `;
    });
  }
  
  // Add effects to buttons
  function addButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      // Add ripple effect on click
      button.addEventListener('click', function(e) {
        // Don't add effect if button is disabled
        if (this.disabled) return;
        
        // Prevent multiple ripples by checking if one already exists
        const existingRipple = this.querySelector('.ripple');
        if (existingRipple) {
          existingRipple.remove();
        }
        
        const circle = document.createElement('span');
        const diameter = Math.max(this.clientWidth, this.clientHeight);
        const radius = diameter / 2;
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - this.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${e.clientY - this.getBoundingClientRect().top - radius}px`;
        circle.classList.add('ripple');
        
        this.appendChild(circle);
        
        // Remove the ripple after animation completes
        setTimeout(() => {
          if (circle) {
            circle.remove();
          }
        }, 600);
      });
    });
  }
  
  // Add form animations
  function addFormAnimations() {
    // Enhance form fields with animations
    const formControls = document.querySelectorAll('.form__control');
    
    formControls.forEach(control => {
      // Focus and blur effects
      control.addEventListener('focus', function() {
        this.closest('.form__group').classList.add('is-focused');
      });
      
      control.addEventListener('blur', function() {
        this.closest('.form__group').classList.remove('is-focused');
      });
      
      // For character counters
      if (control.maxLength) {
        control.addEventListener('input', function() {
          const charCountEl = this.closest('.form__group').querySelector('.form__char-count');
          if (charCountEl) {
            const count = this.value.length;
            const max = this.maxLength;
            charCountEl.innerHTML = `<span>${count}</span>/${max}`;
            
            // Add warning class when approaching limit
            if (count > max * 0.8) {
              charCountEl.classList.add('form__char-count--limit');
            } else {
              charCountEl.classList.remove('form__char-count--limit');
            }
          }
        });
        
        // Trigger once to initialize counters
        control.dispatchEvent(new Event('input'));
      }
    });
    
    // Image preview functionality
    const imageUrlInputs = document.querySelectorAll('input[type="url"]');
    imageUrlInputs.forEach(input => {
      input.addEventListener('input', function() {
        const previewImg = document.getElementById('image-preview');
        if (previewImg) {
          previewImg.src = this.value || 'https://placehold.co/600x400?text=No+Image';
        }
      });
    });
  }
  
  // Animate progress bars
  function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress__fill');
    
    progressBars.forEach(bar => {
      // Get target width from data attribute or inline style
      const percentage = bar.getAttribute('data-percentage') || bar.style.width;
      
      // Reset width to 0 first
      bar.style.width = '0%';
      
      // Animate to target width
      setTimeout(() => {
        bar.style.width = percentage;
      }, 300);
    });
  }
  
  // Toast notification system
  function initToastSystem() {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
      
      // Add toast container styles
      const style = document.createElement('style');
      style.textContent = `
        .toast-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .toast {
          background-color: white;
          color: var(--gray-800);
          border-radius: var(--radius);
          padding: 1rem 1.5rem;
          box-shadow: var(--shadow-md);
          margin-top: 0.5rem;
          min-width: 250px;
          max-width: 90vw;
          animation: toast-in 0.3s ease forwards, toast-out 0.3s ease forwards 3.7s;
          transform: translateY(100%);
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-left: 4px solid var(--primary);
        }
        
        .toast--success { border-left-color: var(--success); }
        .toast--error { border-left-color: var(--danger); }
        .toast--warning { border-left-color: var(--warning); }
        
        .toast__message {
          margin-right: 1rem;
        }
        
        .toast__close {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.25rem;
          opacity: 0.5;
          transition: var(--transition-fast);
        }
        
        .toast__close:hover {
          opacity: 1;
        }
        
        @keyframes toast-in {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes toast-out {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(-20px); opacity: 0; }
        }
      `;
      
      document.head.appendChild(style);
    }
    
    // Expose showToast function globally
    window.showToast = function(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `toast toast--${type}`;
      toast.innerHTML = `
        <span class="toast__message">${message}</span>
        <button class="toast__close" aria-label="Close">&times;</button>
      `;
      
      // Add to container
      toastContainer.appendChild(toast);
      
      // Handle close button
      const closeBtn = toast.querySelector('.toast__close');
      closeBtn.addEventListener('click', () => {
        toast.style.animation = 'toast-out 0.3s ease forwards';
        setTimeout(() => {
          toast.remove();
        }, 300);
      });
      
      // Auto remove after animation completes
      toast.addEventListener('animationend', (e) => {
        if (e.animationName === 'toast-out') {
          toast.remove();
        }
      });
    };
    
    // Override default alert with our toast system
    const originalAlert = window.alert;
    window.alert = function(message) {
      window.showToast(message, 'info');
      // Uncomment below to also trigger the original alert
      // originalAlert(message);
    };
  }
  
  // Initialize scroll animations
  function initScrollAnimations() {
    // Add animation classes to elements as they come into view
    const animateOnScroll = document.querySelectorAll('.animate-on-scroll');
    
    if (animateOnScroll.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
          // Optionally stop observing the element after it's animated
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    animateOnScroll.forEach(el => {
      observer.observe(el);
    });
  }
  
  // Observer for animated elements
  function observeAnimatedElements() {
    // If Intersection Observer API is not available, add animation classes immediately
    if (!('IntersectionObserver' in window)) {
      const animateElements = document.querySelectorAll('.animate-fade-in, .animate-slide-up, .animate-scale-in');
      animateElements.forEach(el => {
        el.style.opacity = '1';
      });
      return;
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // If this is a staggered animation parent, don't set its opacity
          if (!entry.target.classList.contains('animate-stagger')) {
            entry.target.style.opacity = '1';
          }
          // For staggered animation containers, set children opacity
          if (entry.target.classList.contains('animate-stagger')) {
            Array.from(entry.target.children).forEach(child => {
              child.style.opacity = '1';
            });
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    // Observe all animated elements
    document.querySelectorAll('.animate-fade-in, .animate-slide-up, .animate-scale-in, .animate-stagger').forEach(el => {
      observer.observe(el);
    });
  }
  
  // Initialize dark mode
  function initDarkMode(toggle) {
    // Check for saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      toggle.checked = savedTheme === 'dark';
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggle.checked = true;
      }
    }
    
    // Toggle theme on change
    toggle.addEventListener('change', function() {
      const theme = this.checked ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    });
  }
  
  // Enhanced error handling for web3 interactions
  function enhanceWeb3ErrorHandling() {
    if (typeof donateToCampaign !== 'undefined') {
      const originalDonate = donateToCampaign;
      window.donateToCampaign = async function(id, amount) {
        try {
          const donateBtn = document.getElementById('donate-btn');
          if (donateBtn) {
            donateBtn.innerHTML = '<span class="loading-dots">Processing</span>';
          }
          
          const result = await originalDonate(id, amount);
          
          if (result) {
            window.showToast('Donation successful! Thank you for your support.', 'success');
          }
          
          return result;
        } catch (error) {
          console.error("Error donating:", error);
          window.showToast(`Donation failed: ${error.message || 'Unknown error'}`, 'error');
          return false;
        } finally {
          const donateBtn = document.getElementById('donate-btn');
          if (donateBtn) {
            donateBtn.innerHTML = 'Donate';
            donateBtn.disabled = false;
          }
        }
      };
    }
  }
  
  // Function to add smooth background animations
  function addBackgroundAnimations() {
    // Create animated background for header
    const header = document.querySelector('.header');
    if (header) {
      const canvas = document.createElement('canvas');
      canvas.className = 'header__canvas';
      header.appendChild(canvas);
      
      const ctx = canvas.getContext('2d');
      let width = canvas.width = window.innerWidth;
      let height = canvas.height = header.offsetHeight;
      
      // Resize handler
      window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = header.offsetHeight;
      });
      
      // Particle settings
      const particleCount = 50;
      const particles = [];
      
      // Create particles
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2 + 1,
          speed: Math.random() * 0.5 + 0.2,
          direction: Math.random() * Math.PI * 2,
          alpha: Math.random() * 0.5 + 0.1
        });
      }
      
      // Animation loop
      function animate() {
        // Clear canvas with semi-transparent background to create trails
        ctx.fillStyle = 'rgba(79, 70, 229, 0.02)';
        ctx.fillRect(0, 0, width, height);
        
        // Update and draw particles
        particles.forEach(p => {
          // Update position
          p.x += Math.cos(p.direction) * p.speed;
          p.y += Math.sin(p.direction) * p.speed;
          
          // Bounce off edges
          if (p.x < 0 || p.x > width) p.direction = Math.PI - p.direction;
          if (p.y < 0 || p.y > height) p.direction = -p.direction;
          
          // Draw particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.fill();
        });
        
        requestAnimationFrame(animate);
      }
      
      animate();
    }
  }
  
  // Function to enhance forms with validation
  function enhanceFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Add novalidate to handle validation manually
      form.setAttribute('novalidate', '');
      
      // Handle form submission
      form.addEventListener('submit', function(e) {
        let isValid = true;
        
        // Check all required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
          if (!field.value.trim()) {
            isValid = false;
            showFieldError(field, 'This field is required');
          } else {
            clearFieldError(field);
          }
        });
        
        // Check URL fields
        const urlFields = form.querySelectorAll('input[type="url"]');
        urlFields.forEach(field => {
          if (field.value.trim() && !isValidUrl(field.value)) {
            isValid = false;
            showFieldError(field, 'Please enter a valid URL');
          }
        });
        
        // Check number fields
        const numberFields = form.querySelectorAll('input[type="number"]');
        numberFields.forEach(field => {
          if (field.value.trim()) {
            const value = parseFloat(field.value);
            const min = parseFloat(field.min);
            const max = parseFloat(field.max);
            
            if (isNaN(value)) {
              isValid = false;
              showFieldError(field, 'Please enter a valid number');
            } else if (min && value < min) {
              isValid = false;
              showFieldError(field, `Value must be at least ${min}`);
            } else if (max && value > max) {
              isValid = false;
              showFieldError(field, `Value must be at most ${max}`);
            }
          }
        });
        
        // If not valid, prevent submission
        if (!isValid) {
          e.preventDefault();
          
          // Scroll to first error
          const firstError = form.querySelector('.form__error');
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      });
    });
    
    function showFieldError(field, message) {
      // Clear any existing error
      clearFieldError(field);
      
      // Add error class to the input
      field.classList.add('form__control--error');
      
      // Create error message
      const errorEl = document.createElement('div');
      errorEl.className = 'form__error';
      errorEl.textContent = message;
      
      // Add after the field
      field.parentNode.insertBefore(errorEl, field.nextSibling);
    }
    
    function clearFieldError(field) {
      field.classList.remove('form__control--error');
      const errorEl = field.parentNode.querySelector('.form__error');
      if (errorEl) {
        errorEl.remove();
      }
    }
    
    function isValidUrl(string) {
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
    }
  }
  
  // Initialize additional features if requested
  function initAdvancedFeatures() {
    // Uncomment these to enable additional features
    // addBackgroundAnimations();
    // enhanceFormValidation();
    // enhanceWeb3ErrorHandling();
  }
  
  // Call any additional initializations
  initAdvancedFeatures();