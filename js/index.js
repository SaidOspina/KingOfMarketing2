// ============ SHOPPING CART FUNCTIONALITY ============
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.updateCartUI();
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Toggle cart
        document.getElementById('cartToggle').addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleCart();
        });

        document.getElementById('cartClose').addEventListener('click', () => {
            this.closeCart();
        });

        document.getElementById('cartOverlay').addEventListener('click', () => {
            this.closeCart();
        });

        // Clear cart
        document.getElementById('clearCart').addEventListener('click', () => {
            if (confirm('¿Estás seguro de vaciar el carrito?')) {
                this.clearCart();
            }
        });

        // Add to cart buttons
        document.querySelectorAll('.btn-add-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.product-card');
                const productData = JSON.parse(card.dataset.product);
                this.addItem(productData);
                this.showAddedNotification(btn);
            });
        });
    }

    toggleCart() {
        document.getElementById('cartSidebar').classList.toggle('active');
        document.getElementById('cartOverlay').classList.toggle('active');
        document.body.style.overflow = 
            document.getElementById('cartSidebar').classList.contains('active') ? 'hidden' : '';
    }

    closeCart() {
        document.getElementById('cartSidebar').classList.remove('active');
        document.getElementById('cartOverlay').classList.remove('active');
        document.body.style.overflow = '';
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartUI();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(productId, change) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartUI();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const totalPrice = document.getElementById('totalPrice');

        // Update count
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

        // Update items display
        if (this.items.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <div class="empty-icon">🎁</div>
                    <p>Tu carrito está vacío</p>
                    <p class="empty-subtitle">¡Agrega productos para comenzar!</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = this.items.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-category">${item.category}</div>
                        <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                        <div class="cart-item-quantity">
                            <button class="qty-btn" onclick="cart.updateQuantity(${item.id}, -1)">−</button>
                            <span class="qty-number">${item.quantity}</span>
                            <button class="qty-btn" onclick="cart.updateQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="cart.removeItem(${item.id})">🗑️</button>
                </div>
            `).join('');
        }

        // Update total
        totalPrice.textContent = `$${this.getTotal().toLocaleString()}`;
    }

    showAddedNotification(button) {
        const originalText = button.textContent;
        button.textContent = '✓ Agregado!';
        button.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 1500);
    }
}

// Initialize cart
let cart;
document.addEventListener('DOMContentLoaded', () => {
    cart = new ShoppingCart();
});

// ============ ORIGINAL FUNCTIONALITY ============

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
        const href = this.getAttribute('href');
        if (href === '#' || !href.startsWith('#')) return;
        
        e.preventDefault();
        const target = document.querySelector(href);
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
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        heroImage.style.transform = `scale(${1 + scrolled * 0.0001}) translateY(${scrolled * 0.1}px)`;
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
let lastTrailTime = 0;
document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTrailTime < 100) return; // Throttle trail creation
    lastTrailTime = now;
    
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

const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });