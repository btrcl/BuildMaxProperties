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

// Enhanced navbar shadow on scroll
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
  } else {
    navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.08)';
  }
});

// Intersection Observer for animations
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

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
  const animatedElements = document.querySelectorAll('.contact-item, .contact-form-section');
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});

// Dropdown functionality
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

// Form handling 
function handleContactForm(event) {
  event.preventDefault();
  
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  // Add loading state
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  
  // Get form data
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);
  
  // Validate required fields
  if (!data.name || !data.email || !data.subject || !data.message) {
    alert('Please fill in all required fields.');
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    return;
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    alert('Please enter a valid email address.');
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    return;
  }
  
  // Simulate form submission (replace with actual submission logic)
  setTimeout(() => {
    console.log('Form submitted:', data);
    
    // Show success message
    alert('Thank you for your inquiry! We will get back to you within 24 hours.');
    
    // Reset form
    event.target.reset();
    
    // Reset button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    
    // Optional: redirect to success page or scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, 2000);
}

// Form field focus effects
document.addEventListener('DOMContentLoaded', function() {
  const formInputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');
  
  formInputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.classList.remove('focused');
      
      // Add validation styling
      if (this.hasAttribute('required') && !this.value.trim()) {
        this.style.borderColor = '#e74c3c';
      } else {
        this.style.borderColor = '#E5E5E5';
      }
    });
    
    input.addEventListener('input', function() {
      // Remove error styling on input
      this.style.borderColor = '#E5E5E5';
    });
  });
});

// // Phone number formatting (optional)
// document.addEventListener('DOMContentLoaded', function() {
//   const phoneInput = document.getElementById('phone');
  
//   if (phoneInput) {
//     phoneInput.addEventListener('input', function(e) {
//       let value = e.target.value.replace(/\D/g, '');
      
//       // Format as Nigerian phone number
//       if (value.length <= 11) {
//         if (value.startsWith('0')) {
//           value = value.substring(1);
//         }
//         if (value.length > 3) {
//           value = value.substring(0, 3) + ' ' + value.substring(3);
//         }
//         if (value.length > 7) {
//           value = value.substring(0, 8) + ' ' + value.substring(8);
//         }
//         e.target.value = '+234 ' + value;
//       }
//     });
//   }
// });

// Add loading states for better UX
function addLoadingState(element) {
  element.style.opacity = '0.7';
  element.style.pointerEvents = 'none';
}

function removeLoadingState(element) {
  element.style.opacity = '1';
  element.style.pointerEvents = 'auto';
}

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
  // Close mobile menu on resize to larger screen
  if (window.innerWidth > 768) {
    const nav = document.getElementById("navLinks");
    const hamburger = document.querySelector(".hamburger");
    
    if (nav.classList.contains('show')) {
      nav.classList.remove('show');
      hamburger.classList.remove('active');
    }
  }
}, 250);

window.addEventListener('resize', handleResize);

// Enhanced mobile dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
  // Mobile dropdown toggle
  const dropdownBtns = document.querySelectorAll('.dropdown .dropbtn');
  
  dropdownBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const dropdown = this.parentElement;
        const content = dropdown.querySelector('.dropdown-content');
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

// Scroll to top functionality (optional)
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Add scroll to top button (optional)
document.addEventListener('DOMContentLoaded', function() {
  // You can add a scroll to top button here if needed
  let scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.innerHTML = '↑';
  scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: var(--sage-green);
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    cursor: pointer;
    display: none;
    z-index: 1000;
    font-size: 1.2rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
  `;
  
  scrollToTopBtn.onclick = scrollToTop;
  document.body.appendChild(scrollToTopBtn);
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 500) {
      scrollToTopBtn.style.display = 'block';
    } else {
      scrollToTopBtn.style.display = 'none';
    }
  });
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  // Set active navigation item
  const currentPage = window.location.pathname.split('/').pop();
  if (currentPage === 'contact.html' || currentPage === '') {
    const contactLink = document.querySelector('.nav-links a[href="#contact"], .nav-links a[href="contact.html"]');
    if (contactLink) {
      contactLink.classList.add('active');
    }
  }
});

// Service Areas Animation
document.addEventListener('DOMContentLoaded', function() {
  // Animate service area cards on scroll
  const serviceCards = document.querySelectorAll('.area-card');
  const mobileService = document.querySelector('.mobile-service');
  
  // Set initial state for animations
  serviceCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
  });
  
  if (mobileService) {
    mobileService.style.opacity = '0';
    mobileService.style.transform = 'translateY(30px)';
    mobileService.style.transition = 'opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s';
  }
  
  // Intersection Observer for service areas
  const serviceObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('area-card')) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        } else if (entry.target.classList.contains('mobile-service')) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Observe service area elements
  serviceCards.forEach(card => {
    serviceObserver.observe(card);
  });
  
  if (mobileService) {
    serviceObserver.observe(mobileService);
  }
});

// Add hover effects for area cards
document.addEventListener('DOMContentLoaded', function() {
  const areaCards = document.querySelectorAll('.area-card');
  
  areaCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      // Add subtle scale effect to icon
      const icon = this.querySelector('.area-icon');
      if (icon) {
        icon.style.transform = 'scale(1.1) rotate(5deg)';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      // Reset icon transform
      const icon = this.querySelector('.area-icon');
      if (icon) {
        icon.style.transform = 'scale(1) rotate(0deg)';
      }
    });
  });
});

// Feature badges animation
document.addEventListener('DOMContentLoaded', function() {
  const featureBadges = document.querySelectorAll('.feature-badge');
  
  featureBadges.forEach((badge, index) => {
    badge.style.opacity = '0';
    badge.style.transform = 'scale(0.8)';
    badge.style.transition = `opacity 0.4s ease ${index * 0.1 + 0.5}s, transform 0.4s ease ${index * 0.1 + 0.5}s`;
    
    // Animate when mobile service section is visible
    const mobileService = badge.closest('.mobile-service');
    if (mobileService) {
      const badgeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              badge.style.opacity = '1';
              badge.style.transform = 'scale(1)';
            }, index * 100 + 800);
          }
        });
      }, { threshold: 0.3 });
      
      badgeObserver.observe(mobileService);
    }
  });
});

// Add pulse effect to mobile service icon
document.addEventListener('DOMContentLoaded', function() {
  const mobileIcon = document.querySelector('.mobile-icon');
  
  if (mobileIcon) {
    // Add periodic pulse effect
    setInterval(() => {
      if (isElementInViewport(mobileIcon)) {
        mobileIcon.style.animation = 'pulse 1.5s ease-in-out';
        setTimeout(() => {
          mobileIcon.style.animation = '';
        }, 1500);
      }
    }, 5000);
  }
});

// Utility function to check if element is in viewport
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Add CSS animation for pulse effect
document.addEventListener('DOMContentLoaded', function() {
  // Create and inject pulse animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(139, 69, 19, 0.4);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 0 0 10px rgba(139, 69, 19, 0);
      }
      100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(139, 69, 19, 0);
      }
    }
    
    .area-icon {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .mobile-icon {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
  `;
  document.head.appendChild(style);
});

// Stagger animation for area features
document.addEventListener('DOMContentLoaded', function() {
  const areaFeatures = document.querySelectorAll('.area-features li');
  
  areaFeatures.forEach((feature, index) => {
    feature.style.opacity = '0';
    feature.style.transform = 'translateX(-20px)';
    feature.style.transition = `opacity 0.4s ease ${index * 0.1}s, transform 0.4s ease ${index * 0.1}s`;
    
    const parentCard = feature.closest('.area-card');
    if (parentCard) {
      const featureObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const features = entry.target.querySelectorAll('.area-features li');
            features.forEach((feat, idx) => {
              setTimeout(() => {
                feat.style.opacity = '1';
                feat.style.transform = 'translateX(0)';
              }, idx * 100 + 400);
            });
          }
        });
      }, { threshold: 0.3 });
      
      featureObserver.observe(parentCard);
    }
  });
});

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".contact-form");
    const successMessage = document.getElementById("form-success-message");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(form);

      fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          form.reset();
          successMessage.style.display = "block";
        } else {
          response.json().then(data => {
            alert("Oops! Something went wrong.");
          });
        }
      }).catch(error => {
        alert("Error submitting the form. Please try again.");
      });
    });
  });

