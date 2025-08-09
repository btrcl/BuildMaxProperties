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
  const data = Object.fromEntries(formData);
  
  // Validate all fields
  let isFormValid = true;
  const inputs = form.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    const fieldValid = validateField({ target: input });
    if (!fieldValid) {
      isFormValid = false;
    }
  });
  
  // Check terms and conditions
  const termsCheckbox = form.querySelector('#terms');
  if (!termsCheckbox.checked) {
    isFormValid = false;
    showFieldError(termsCheckbox, 'Please accept the terms and conditions');
  }
  
  if (!isFormValid) {
    // Scroll to first error
    const firstError = form.querySelector('.error-message');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }
  
  // Show loading state
  const submitButton = form.querySelector('.form-submit');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Submitting...';
  submitButton.disabled = true;
  submitButton.style.opacity = '0.7';
  
  // Simulate form submission
  setTimeout(() => {
    console.log('Form submitted:', data);
    
    // Show success message
    showSuccessMessage();
    
    // Reset form
    form.reset();
    
    // Reset button
    submitButton.textContent = originalText;
    submitButton.disabled = false;
    submitButton.style.opacity = '1';
    
  }, 2000);
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

// Resize handler with debounce
const handleResize = debounce(function() {
  if (window.innerWidth > 768) {
    const nav = document.getElementById("navLinks");
    const hamburger = document.querySelector(".hamburger");
    
    if (nav.classList.contains('show')) {
      nav.classList.remove('show');
      hamburger.classList.remove('active');
    }
    
    // Reset dropdowns on desktop
    document.querySelectorAll('.dropdown-content').forEach(content => {
      content.style.display = '';
    });
  }
}, 250);

window.addEventListener('resize', handleResize);

// Price animation on scroll
function animateNumbers() {
  const priceElements = document.querySelectorAll('.service-price');
  
  priceElements.forEach(element => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animatePrice(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(element);
  });
}

function animatePrice(element) {
  const text = element.textContent;
  const match = text.match(/₦([\d,]+)/);
  
  if (match) {
    const targetPrice = parseInt(match[1].replace(/,/g, ''));
    const prefix = text.split('₦')[0];
    const suffix = text.split(match[0])[1];
    
    let currentPrice = 0;
    const increment = targetPrice / 50;
    
    const timer = setInterval(() => {
      currentPrice += increment;
      
      if (currentPrice >= targetPrice) {
        currentPrice = targetPrice;
        clearInterval(timer);
      }
      
      const formattedPrice = Math.floor(currentPrice).toLocaleString();
      element.textContent = `${prefix}₦${formattedPrice}${suffix}`;
    }, 30);
  }
}

// Initialize price animation
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(animateNumbers, 500);
});

// Form field enhancements
document.addEventListener('DOMContentLoaded', function() {
  // Auto-format phone number
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      
      // Nigerian phone number formatting
      if (value.startsWith('234')) {
        value = '+' + value;
      } else if (value.startsWith('0') && value.length > 1) {
        value = '+234' + value.substring(1);
      }
      
      e.target.value = value;
    });
  }
  
  // Dynamic form updates based on property type
  const propertyTypeSelect = document.getElementById('propertyType');
  const purposeSelect = document.getElementById('purposeOfValuation');
  
  if (propertyTypeSelect && purposeSelect) {
    propertyTypeSelect.addEventListener('change', function() {
      updatePurposeOptions(this.value, purposeSelect);
    });
  }
});

function updatePurposeOptions(propertyType, purposeSelect) {
  const commonOptions = [
    { value: 'sale', text: 'Sale/Purchase' },
    { value: 'mortgage', text: 'Mortgage/Loan' },
    { value: 'insurance', text: 'Insurance' },
    { value: 'tax', text: 'Tax Assessment' },
    { value: 'legal', text: 'Legal/Court Matters' },
    { value: 'investment', text: 'Investment Decision' },
    { value: 'other', text: 'Other' }
  ];
  
  let specificOptions = [];
  
  switch (propertyType) {
    case 'commercial':
      specificOptions = [
        { value: 'rental', text: 'Rental Income Assessment' },
        { value: 'portfolio', text: 'Portfolio Valuation' },
        { value: 'acquisition', text: 'Acquisition/Merger' }
      ];
      break;
    case 'industrial':
      specificOptions = [
        { value: 'asset', text: 'Asset Valuation' },
        { value: 'compulsory', text: 'Compulsory Acquisition' },
        { value: 'financial', text: 'Financial Reporting' }
      ];
      break;
    case 'land':
      specificOptions = [
        { value: 'development', text: 'Development Planning' },
        { value: 'subdivision', text: 'Subdivision' }
      ];
      break;
  }
  
  // Clear existing options except the first one
  const firstOption = purposeSelect.firstElementChild;
  purposeSelect.innerHTML = '';
  purposeSelect.appendChild(firstOption);
  
  // Add common options
  commonOptions.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.textContent = option.text;
    purposeSelect.appendChild(optionElement);
  });
  
  // Add specific options if any
  if (specificOptions.length > 0) {
    // Add separator
    const separator = document.createElement('option');
    separator.disabled = true;
    separator.textContent = '--- Specialized Options ---';
    purposeSelect.appendChild(separator);
    
    specificOptions.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.text;
      purposeSelect.appendChild(optionElement);
    });
  }
}

// Add loading states for better UX
function addLoadingState(element) {
  element.style.opacity = '0.7';
  element.style.pointerEvents = 'none';
  element.style.cursor = 'wait';
}

function removeLoadingState(element) {
  element.style.opacity = '1';
  element.style.pointerEvents = 'auto';
  element.style.cursor = 'default';
}

// Enhance step animations
document.addEventListener('DOMContentLoaded', function() {
  const steps = document.querySelectorAll('.step-item');
  
  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          
          // Animate the step number
          const stepNumber = entry.target.querySelector('.step-number');
          if (stepNumber) {
            stepNumber.style.transform = 'scale(1.1)';
            setTimeout(() => {
              stepNumber.style.transform = 'scale(1)';
            }, 200);
          }
        }, index * 200);
        
        stepObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  
  steps.forEach(step => {
    step.style.opacity = '0';
    step.style.transform = 'translateY(30px)';
    step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    stepObserver.observe(step);
  });
});

// Service card hover enhancements
document.addEventListener('DOMContentLoaded', function() {
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
});

// Smooth scroll to form when clicking CTA buttons
document.addEventListener('DOMContentLoaded', function() {
  const ctaButtons = document.querySelectorAll('a[href="#valuation-form"]');
  
  ctaButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const target = document.getElementById('valuation-form');
      if (target) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = target.offsetTop - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Focus on first input after scroll
        setTimeout(() => {
          const firstInput = target.querySelector('input');
          if (firstInput) {
            firstInput.focus();
          }
        }, 500);
      }
    });
  });
});

// Enhanced error handling for form
window.addEventListener('unhandledrejection', function(event) {
  console.error('Form submission error:', event.reason);
  
  // Show user-friendly error message
  const errorModal = document.createElement('div');
  errorModal.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #e74c3c;
    color: white;
    padding: 1rem;
    border-radius: 6px;
    z-index: 10000;
    font-size: 14px;
    max-width: 300px;
  `;
  errorModal.textContent = 'There was an error submitting your request. Please try again.';
  
  document.body.appendChild(errorModal);
  
  setTimeout(() => {
    errorModal.remove();
  }, 5000);
});

// Initialize all enhancements
document.addEventListener('DOMContentLoaded', function() {
  // Add focus styles to form elements
  const formElements = document.querySelectorAll('input, select, textarea');
  formElements.forEach(element => {
    element.addEventListener('focus', function() {
      this.style.boxShadow = '0 0 0 3px rgba(156, 175, 136, 0.1)';
    });
    
    element.addEventListener('blur', function() {
      if (!this.style.borderColor.includes('e74c3c')) {
        this.style.boxShadow = '';
      }
    });
  });
});