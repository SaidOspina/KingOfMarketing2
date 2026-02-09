// Loader
setTimeout(() => {
    document.querySelector('.loader').style.display = 'none';
}, 3000);

// Floating particles
const floatingContainer = document.getElementById('floatingElements');
const particles = ['❤️', '💕', '💖', '💗', '💝', '🌹', '🎀', '✨'];

function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('float-particle');
    particle.textContent = particles[Math.floor(Math.random() * particles.length)];
    particle.style.left = Math.random() * 100 + '%';
    particle.style.fontSize = (Math.random() * 20 + 15) + 'px';
    particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
    particle.style.animationDelay = Math.random() * 5 + 's';
    
    floatingContainer.appendChild(particle);
    
    setTimeout(() => particle.remove(), 25000);
}

setInterval(createParticle, 3000);
for(let i = 0; i < 10; i++) {
    setTimeout(createParticle, i * 300);
}

// Header scroll effect
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// Parallax effect for hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroEmoji = document.querySelector('.hero-emoji');
    if (heroEmoji) {
        heroEmoji.style.transform = `translateY(${scrolled * 0.3}px) rotate(${scrolled * 0.1}deg)`;
    }
});

// Add stagger delay to product cards
document.querySelectorAll('.product-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// Random rotation for gallery items on hover
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        const rotation = (Math.random() - 0.5) * 10;
        this.style.transform = `scale(1.05) rotate(${rotation}deg)`;
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// Cursor trail effect (optional enhancement)
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.95) {
        const trail = document.createElement('div');
        trail.style.position = 'fixed';
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        trail.style.pointerEvents = 'none';
        trail.style.fontSize = '20px';
        trail.textContent = '✨';
        trail.style.opacity = '0';
        trail.style.transition = 'all 1s ease-out';
        trail.style.zIndex = '9999';
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            trail.style.opacity = '1';
            trail.style.transform = 'translateY(-50px) scale(0.5)';
        }, 10);
        
        setTimeout(() => trail.remove(), 1000);
    }
});