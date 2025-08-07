// Mobile Navigation Toggle
// Minimalistic Loading Screen JavaScript

// Function to hide loading screen
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    if (loadingScreen) {
        // Add fade-out class for smooth transition
        loadingScreen.classList.add('fade-out');
        
        // Remove the loading screen from DOM after fade animation
        setTimeout(function() {
            loadingScreen.style.display = 'none';
        }, 500); // Match the CSS transition duration
    }
}

// Show loading screen immediately when script loads
document.addEventListener('DOMContentLoaded', function() {
    // Ensure loading screen is visible
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
        loadingScreen.style.opacity = '1';
    }
});

// Hide loading screen when page is fully loaded
window.addEventListener('load', function() {
    // Minimal loading time for clean experience
    setTimeout(function() {
        hideLoadingScreen();
    }, 1000); // Quick 1 second display
});

// Optional: Hide loading screen if it takes too long (fallback)
setTimeout(function() {
    hideLoadingScreen();
}, 8000); // 8 seconds maximum loading time

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

document.addEventListener('click', function(e) {
  const nav = document.getElementById("navLinks");
  const hamburger = document.querySelector(".hamburger");
  const navContainer = document.querySelector('.nav-container');
  
  if (!navContainer.contains(e.target) && nav.classList.contains('show')) {
    nav.classList.remove('show');
    hamburger.classList.remove('active');
  }
});


window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
  } else {
    navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.08)';
  }
});


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
  const animatedElements = document.querySelectorAll('.feature-card, .listing-card, .mission-item');
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});


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
  
  // Add your form submission logic here
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);
  
  console.log('Form submitted:', data);
  
 
  
  alert('Thank you for your inquiry! We will get back to you soon.');
}

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