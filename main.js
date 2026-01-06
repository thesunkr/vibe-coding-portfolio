/**
 * 그린포트 (Green Pot) - Main JavaScript
 * 화분 웹사이트 포트폴리오
 */

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initProductFilter();
    initForms();
    initPasswordToggle();
    initSmoothScroll();
});

// ===== Navigation =====
function initNavigation() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateNavbar() {
        const scrollY = window.scrollY;
        
        // Add scrolled class when scrolled down
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        lastScrollY = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });
    
    // Initial check
    updateNavbar();
}

// ===== Mobile Menu =====
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!menuBtn || !mobileMenu) return;
    
    let isOpen = false;
    
    menuBtn.addEventListener('click', function() {
        isOpen = !isOpen;
        
        if (isOpen) {
            mobileMenu.classList.remove('hidden');
            // Trigger reflow for animation
            mobileMenu.offsetHeight;
            mobileMenu.classList.add('open');
            menuBtn.setAttribute('aria-expanded', 'true');
            menuBtn.setAttribute('aria-label', '메뉴 닫기');
            
            // Change icon to X
            menuBtn.innerHTML = `
                <svg class="w-6 h-6 text-forest-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            `;
        } else {
            closeMenu();
        }
    });
    
    // Close menu when clicking on links
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (isOpen) {
                closeMenu();
            }
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isOpen) {
            closeMenu();
        }
    });
    
    function closeMenu() {
        isOpen = false;
        mobileMenu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', '메뉴 열기');
        
        // Change icon back to hamburger
        menuBtn.innerHTML = `
            <svg class="w-6 h-6 text-forest-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
        `;
        
        // Hide after animation
        setTimeout(() => {
            if (!isOpen) {
                mobileMenu.classList.add('hidden');
            }
        }, 300);
    }
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animatedElements.length === 0) return;
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    animatedElements.forEach((el, index) => {
        // Add staggered delay
        el.style.transitionDelay = `${index * 100}ms`;
        observer.observe(el);
    });
}

// ===== Product Filter =====
function initProductFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const products = document.querySelectorAll('.product-card');
    
    if (categoryBtns.length === 0 || products.length === 0) return;
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            products.forEach(product => {
                const productCategory = product.dataset.category;
                
                if (category === 'all' || productCategory === category) {
                    product.style.display = '';
                    // Trigger animation
                    product.style.opacity = '0';
                    product.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        product.style.opacity = '1';
                        product.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });
}

// ===== Form Handling =====
function initForms() {
    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Simple validation
    if (!data.name || !data.email || !data.message) {
        showToast('모든 필수 항목을 입력해주세요.', 'error');
        return;
    }
    
    if (!isValidEmail(data.email)) {
        showToast('올바른 이메일 주소를 입력해주세요.', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '전송 중...';
    
    setTimeout(() => {
        showToast('문의가 성공적으로 전송되었습니다!', 'success');
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = '문의 보내기';
    }, 1500);
}

function handleLoginSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = document.getElementById('login-email');
    const password = document.getElementById('login-password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const submitBtn = document.getElementById('login-submit');
    
    // Reset errors
    email.classList.remove('error');
    password.classList.remove('error');
    emailError.classList.add('hidden');
    passwordError.classList.add('hidden');
    
    let hasError = false;
    
    // Validate email
    if (!email.value || !isValidEmail(email.value)) {
        email.classList.add('error');
        emailError.classList.remove('hidden');
        hasError = true;
    }
    
    // Validate password
    if (!password.value) {
        password.classList.add('error');
        passwordError.classList.remove('hidden');
        hasError = true;
    }
    
    if (hasError) return;
    
    // Show loading state
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');
    submitBtn.disabled = true;
    
    // Simulate login
    setTimeout(() => {
        showToast('로그인 되었습니다! 환영합니다.', 'success');
        
        // Reset button
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
        submitBtn.disabled = false;
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }, 2000);
}

// ===== Password Toggle =====
function initPasswordToggle() {
    const toggleBtn = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('login-password');
    
    if (!toggleBtn || !passwordInput) return;
    
    toggleBtn.addEventListener('click', function() {
        const eyeOpen = this.querySelector('.eye-open');
        const eyeClosed = this.querySelector('.eye-closed');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeOpen.classList.add('hidden');
            eyeClosed.classList.remove('hidden');
            this.setAttribute('aria-label', '비밀번호 숨기기');
        } else {
            passwordInput.type = 'password';
            eyeOpen.classList.remove('hidden');
            eyeClosed.classList.add('hidden');
            this.setAttribute('aria-label', '비밀번호 표시');
        }
    });
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            
            const navHeight = document.getElementById('navbar')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// ===== Utility Functions =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide and remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// ===== Keyboard Navigation Helper =====
function handleKeyboardNavigation(e) {
    // Tab trap for modals
    if (e.key === 'Tab') {
        const modal = document.querySelector('.modal-backdrop.show');
        if (modal) {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
}

document.addEventListener('keydown', handleKeyboardNavigation);

// ===== Touch Device Detection =====
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Add touch class to body for CSS targeting
if (isTouchDevice()) {
    document.body.classList.add('touch-device');
}

// ===== Viewport Height Fix for Mobile =====
function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setViewportHeight();
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', () => {
    setTimeout(setViewportHeight, 100);
});

// ===== Lazy Loading Images =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.remove('img-placeholder');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// Initialize lazy loading
initLazyLoading();

// ===== Add to Cart Animation (Demo) =====
function addToCart(productName) {
    showToast(`${productName}이(가) 장바구니에 추가되었습니다.`, 'success');
}

// Add click handlers to cart buttons
document.querySelectorAll('.product-card button').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.product-card');
        const productName = card.querySelector('h3').textContent;
        addToCart(productName);
    });
});

// ===== Console Welcome Message =====
console.log('%c🪴 누나네 화분가게에 오신 것을 환영합니다! 🪴', 'color: #3c7a4a; font-size: 20px; font-weight: bold;');
console.log('%c정성을 담아 키운 건강한 식물', 'color: #4f965e; font-size: 14px;');

