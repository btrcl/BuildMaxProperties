// Loading Screen Management
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        
        setTimeout(function() {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
        loadingScreen.style.opacity = '1';
    }
});

window.addEventListener('load', function() {
    setTimeout(function() {
        hideLoadingScreen();
    }, 1000);
});

setTimeout(function() {
    hideLoadingScreen();
}, 8000);

// Mobile Navigation Toggle
function toggleMenu() {
  const nav = document.getElementById("navLinks");
  const hamburger = document.querySelector(".hamburger");
  
  nav.classList.toggle("show");
  hamburger.classList.toggle("active");
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetSection.offsetTop - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        const nav = document.getElementById("navLinks");
        const hamburger = document.querySelector(".hamburger");
        
        if (nav.classList.contains('show')) {
          nav.classList.remove('show');
          hamburger.classList.remove('active');
        }
      }
    });
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
  const nav = document.getElementById("navLinks");
  const hamburger = document.querySelector(".hamburger");
  const navContainer = document.querySelector('.nav-container');
  
  if (!navContainer.contains(e.target) && nav.classList.contains('show')) {
    nav.classList.remove('show');
    hamburger.classList.remove('active');
  }
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
  } else {
    navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.08)';
  }
});

// Scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
  const animatedElements = document.querySelectorAll('.feature-card, .service-card, .step-item, .benefit-item');
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});

// Enhanced dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
  const dropdown = document.querySelector('.dropdown');
  const dropdownContent = document.querySelector('.dropdown-content');
  let timeoutId;

  if (dropdown && dropdownContent) {
    dropdown.addEventListener('mouseenter', function() {
      clearTimeout(timeoutId);
      dropdownContent.style.display = 'block';
    });

    dropdown.addEventListener('mouseleave', function() {
      timeoutId = setTimeout(() => {
        dropdownContent.style.display = 'none';
      }, 200);
    });

    dropdownContent.addEventListener('mouseenter', function() {
      clearTimeout(timeoutId);
    });

    dropdownContent.addEventListener('mouseleave', function() {
      timeoutId = setTimeout(() => {
        dropdownContent.style.display = 'none';
      }, 200);
    });
  }
});

// Form validation and submission
document.addEventListener('DOMContentLoaded', function() {
  const valuationForm = document.getElementById('valuationForm');
  
  if (valuationForm) {
    valuationForm.addEventListener('submit', handleFormSubmission);
    
    // Real-time validation
    const inputs = valuationForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', validateField);
      input.addEventListener('input', clearFieldError);
    });
  }
});

function validateField(event) {
  const field = event.target;
  const value = field.value.trim();
  
  // Remove existing error styling
  clearFieldError(event);
  
  // Validation rules
  let isValid = true;
  let errorMessage = '';
  
  if (field.hasAttribute('required') && !value) {
    isValid = false;
    errorMessage = 'This field is required';
  } else if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }
  } else if (field.type === 'tel' && value) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid phone number';
    }
  }
  
  if (!isValid) {
    showFieldError(field, errorMessage);
  }
  
  return isValid;
}

function clearFieldError(event) {
  const field = event.target;
  field.style.borderColor = '';
  
  // Remove error message if exists
  const errorElement = field.parentNode.querySelector('.error-message');
  if (errorElement) {
    errorElement.remove();
  }
}

function showFieldError(field, message) {
  field.style.borderColor = '#e74c3c';
  
  // Remove existing error message
  const existingError = field.parentNode.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  
  // Add new error message
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.style.color = '#e74c3c';
  errorElement.style.fontSize = '12px';
  errorElement.style.marginTop = '4px';
  errorElement.textContent = message;
  
  field.parentNode.appendChild(errorElement);
}

function handleFormSubmission(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const submitButton = form.querySelector('.form-submit');
  const originalText = submitButton.textContent;

  // Validate fields
  let isFormValid = true;
  const inputs = form.querySelectorAll('input, select, textarea');

  inputs.forEach(input => {
    const fieldValid = validateField({ target: input });
    if (!fieldValid) {
      isFormValid = false;
    }
  });

  const termsCheckbox = form.querySelector('#terms');
  if (!termsCheckbox.checked) {
    isFormValid = false;
    showFieldError(termsCheckbox, 'Please accept the terms and conditions');
  }

  if (!isFormValid) {
    const firstError = form.querySelector('.error-message');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  // Show loading state
  submitButton.textContent = 'Submitting...';
  submitButton.disabled = true;
  submitButton.style.opacity = '0.7';

  // Submit to Formspree
  fetch('https://formspree.io/f/mrbloqwr', {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    },
    body: formData
  })
    .then(response => {
      if (response.ok) {
        form.reset();
        showSuccessMessage();
      } else {
        alert('There was an issue submitting the form. Please try again.');
      }
    })
    .catch(() => {
      alert('Network error. Please try again later.');
    })
    .finally(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      submitButton.style.opacity = '1';
    });
}

function showSuccessMessage() {
  // Create success modal
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;
  
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: white;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    max-width: 400px;
    margin: 0 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  `;
  
  modalContent.innerHTML = `
    <div style="font-size: 3rem; color: #9CAF88; margin-bottom: 1rem;">✓</div>
    <h3 style="color: #8B4513; margin-bottom: 1rem;">Request Submitted!</h3>
    <p style="color: #666; margin-bottom: 1.5rem; font-size: 14px;">
      Thank you for your valuation request. Our team will contact you within 24 hours to discuss your requirements.
    </p>
    <button onclick="this.closest('.modal').remove()" style="
      background: #9CAF88;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    ">Close</button>
  `;
  
  modal.className = 'modal';
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  // Auto close after 5 seconds
  setTimeout(() => {
    if (document.body.contains(modal)) {
      modal.remove();
    }
  }, 5000);
}

// Enhanced mobile dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
  const dropdownBtns = document.querySelectorAll('.dropdown .dropbtn');
  
  dropdownBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const dropdown = this.parentElement;
        const content = dropdown.querySelector('.dropdown-content');
        
        // Close other dropdowns
        document.querySelectorAll('.dropdown-content').forEach(otherContent => {
          if (otherContent !== content) {
            otherContent.style.display = 'none';
          }
        });
        
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
      }
    });
  });

  // Close dropdowns when clicking elsewhere on mobile
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-content').forEach(content => {
          content.style.display = 'none';
        });
      }
    }
  });
});

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// // Resize handler with debounce
// const handleResize = debounce(function() {
//   if (window.