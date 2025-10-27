// Global Variables
let isFormSubmitting = false;
let phoneInputs = [];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    initializeNavigation();
    initializePhoneMasks();
    initializeBackToTop();
    initializeForms();
    initializeModals();
    initializeAnimations();
}

// Navigation
function initializeNavigation() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('shadow');
        } else {
            navbar.classList.remove('shadow');
        }
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// Phone Input Mask
function initializePhoneMasks() {
    phoneInputs = document.querySelectorAll('.phone-mask');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.startsWith('375')) {
                value = value.substring(3);
            }
            
            if (value.length > 0) {
                let formatted = '+375';
                if (value.length > 0) formatted += ' (' + value.substring(0, 2);
                if (value.length > 2) formatted += ') ' + value.substring(2, 5);
                if (value.length > 5) formatted += '-' + value.substring(5, 7);
                if (value.length > 7) formatted += '-' + value.substring(7, 9);
                
                e.target.value = formatted;
            }
        });
        
        input.addEventListener('focus', function(e) {
            if (!e.target.value) {
                e.target.value = '+375 (';
            }
        });
        
        input.addEventListener('blur', function(e) {
            if (e.target.value === '+375 (') {
                e.target.value = '';
            }
        });
    });
}

// Back to Top Button
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Forms
function initializeForms() {
    // Hero Form
    const heroForm = document.getElementById('heroForm');
    if (heroForm) {
        heroForm.addEventListener('submit', handleHeroFormSubmit);
    }
    
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
    
    // Price Modal Form
    const priceForm = document.getElementById('priceForm');
    if (priceForm) {
        priceForm.addEventListener('submit', handlePriceFormSubmit);
    }
}

function handleHeroFormSubmit(e) {
    e.preventDefault();
    
    if (isFormSubmitting) return;
    
    const formData = new FormData(e.target);
    const data = {
        product: formData.get('product'),
        length: formData.get('length'),
        width: formData.get('width'),
        phone: formData.get('phone'),
        name: formData.get('name')
    };
    
    if (validateFormData(data)) {
        submitForm(e.target, data, 'Заявка на расчет стоимости');
    }
}

function handleContactFormSubmit(e) {
    e.preventDefault();
    
    if (isFormSubmitting) return;
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        service: formData.get('service'),
        message: formData.get('message')
    };
    
    if (validateFormData(data)) {
        submitForm(e.target, data, 'Заявка с сайта');
    }
}

function handlePriceFormSubmit(e) {
    e.preventDefault();
    
    if (isFormSubmitting) return;
    
    const formData = new FormData(e.target);
    const data = {
        product: formData.get('product'),
        length: formData.get('length'),
        width: formData.get('width'),
        height: formData.get('height'),
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        comment: formData.get('comment')
    };
    
    if (validateFormData(data)) {
        submitForm(e.target, data, 'Расчет стоимости');
    }
}

function validateFormData(data) {
    // Basic validation
    if (!data.name || data.name.trim().length < 2) {
        showAlert('Пожалуйста, введите корректное имя (минимум 2 символа)', 'warning');
        return false;
    }
    
    if (!data.phone || !isValidPhone(data.phone)) {
        showAlert('Пожалуйста, введите корректный номер телефона', 'warning');
        return false;
    }
    
    if (data.email && !isValidEmail(data.email)) {
        showAlert('Пожалуйста, введите корректный email', 'warning');
        return false;
    }
    
    return true;
}

function isValidPhone(phone) {
    const phoneRegex = /^\+375\s\(\d{2}\)\s\d{3}-\d{2}-\d{2}$/;
    return phoneRegex.test(phone);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function submitForm(form, data, type) {
    isFormSubmitting = true;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Отправка...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        isFormSubmitting = false;
        
        // Show success message
        showSuccessModal();
        
        // Reset form
        form.reset();
        
        // Close modal if open
        const modal = form.closest('.modal');
        if (modal) {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                bsModal.hide();
            }
        }
        
        // Log form data (in real app, send to server)
        console.log('Form submitted:', { type, data, timestamp: new Date().toISOString() });
        
    }, 2000); // Simulate network delay
}

function showSuccessModal() {
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        successModal.hide();
    }, 3000);
}

function showAlert(message, type = 'info') {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Modals
function initializeModals() {
    // Price modal product selection
    document.querySelectorAll('[data-product]').forEach(btn => {
        btn.addEventListener('click', function() {
            const product = this.getAttribute('data-product');
            const priceModal = document.getElementById('priceModal');
            const productInput = priceModal.querySelector('input[name="product"]');
            
            if (productInput) {
                productInput.value = product;
            }
        });
    });
    
    // Reset forms when modals are hidden
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('hidden.bs.modal', function() {
            const forms = this.querySelectorAll('form');
            forms.forEach(form => form.reset());
        });
    });
}

// Animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.advantage-card, .product-card, .work-step, .testimonial-card').forEach(el => {
        observer.observe(el);
    });
}

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-card h3');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            const suffix = counter.textContent.replace(/\d/g, '');
            counter.textContent = Math.floor(current) + suffix;
        }, 20);
    });
}

// Initialize counter animation when about section is visible
const aboutSection = document.getElementById('about');
if (aboutSection) {
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                aboutObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    aboutObserver.observe(aboutSection);
}

// Testimonials auto-play
function initializeTestimonialsAutoplay() {
    const carousel = document.getElementById('testimonialsCarousel');
    if (carousel) {
        const bsCarousel = new bootstrap.Carousel(carousel, {
            interval: 5000,
            wrap: true
        });
        
        // Pause on hover
        carousel.addEventListener('mouseenter', () => {
            bsCarousel.pause();
        });
        
        carousel.addEventListener('mouseleave', () => {
            bsCarousel.cycle();
        });
    }
}

// Initialize testimonials autoplay
document.addEventListener('DOMContentLoaded', () => {
    initializeTestimonialsAutoplay();
});

// Product tabs functionality
function initializeProductTabs() {
    const tabLinks = document.querySelectorAll('#productTabs .nav-link');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all tabs and panes
            tabLinks.forEach(l => l.classList.remove('active'));
            tabPanes.forEach(p => {
                p.classList.remove('show', 'active');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding pane
            const targetId = this.getAttribute('href').substring(1);
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('show', 'active');
            }
        });
    });
}

// Initialize product tabs
document.addEventListener('DOMContentLoaded', () => {
    initializeProductTabs();
});

// Window resize handler
window.addEventListener('resize', function() {
    // Recalculate navbar offset for smooth scrolling
    updateActiveNavLink();
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    showAlert('Произошла ошибка. Пожалуйста, обновите страницу.', 'danger');
});

// Prevent form resubmission on page refresh
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidPhone,
        isValidEmail,
        validateFormData
    };
}