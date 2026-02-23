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
        const cartToggle = document.getElementById('cartToggle');
        if (cartToggle) {
            cartToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleCart();
            });
        }

        const cartClose = document.getElementById('cartClose');
        if (cartClose) {
            cartClose.addEventListener('click', () => this.closeCart());
        }

        const cartOverlay = document.getElementById('cartOverlay');
        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => this.closeCart());
        }

        const clearCart = document.getElementById('clearCart');
        if (clearCart) {
            clearCart.addEventListener('click', () => {
                if (confirm('¿Estás seguro de vaciar el carrito?')) {
                    this.clearCart();
                }
            });
        }

        // Add to cart buttons - open product modal instead of adding directly
        document.querySelectorAll('.btn-add-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.product-card');
                if (card && card.dataset.product) {
                    const productData = JSON.parse(card.dataset.product);
                    if (window.productModal) {
                        window.productModal.open(productData);
                    } else {
                        this.addItem(productData);
                        this.showAddedNotification(btn);
                    }
                }
            });
        });

        // Also handle clicking on the product card image
        document.querySelectorAll('.product-card .product-image').forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', (e) => {
                const card = e.target.closest('.product-card');
                if (card && card.dataset.product) {
                    const productData = JSON.parse(card.dataset.product);
                    if (window.productModal) {
                        window.productModal.open(productData);
                    }
                }
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

    addItemWithExtras(product, extras) {
        // Create a unique key for items with different customizations
        const extraKey = extras.map(e => e.name).sort().join(',');
        const itemKey = `${product.id}-${extraKey}`;
        
        const totalExtrasPrice = extras.reduce((sum, e) => sum + e.price, 0);
        
        const existingItem = this.items.find(item => item.customKey === itemKey);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                customKey: itemKey,
                extras: extras,
                price: product.price + totalExtrasPrice,
                basePrice: product.price,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartUI();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => 
            item.customKey ? item.customKey !== productId : item.id !== productId
        );
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(productId, change) {
        const item = this.items.find(item => 
            item.customKey ? item.customKey === productId : item.id === productId
        );
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

        if (!cartCount || !cartItems || !totalPrice) return;

        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

        if (this.items.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <div class="empty-icon" style="font-size: 2rem; opacity: 0.4;">&#9744;</div>
                    <p>Tu carrito está vacío</p>
                    <p class="empty-subtitle">Agrega productos para comenzar</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = this.items.map(item => {
                const itemId = item.customKey || item.id;
                const extrasText = item.extras && item.extras.length > 0 
                    ? `<div style="font-size: 0.8rem; color: #9B8E82; margin-top: 0.2rem;">${item.extras.map(e => '+ ' + e.name).join(', ')}</div>` 
                    : '';
                return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-category">${item.category}</div>
                        ${extrasText}
                        <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                        <div class="cart-item-quantity">
                            <button class="qty-btn" onclick="cart.updateQuantity('${itemId}', -1)">&minus;</button>
                            <span class="qty-number">${item.quantity}</span>
                            <button class="qty-btn" onclick="cart.updateQuantity('${itemId}', 1)">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="cart.removeItem('${itemId}')">&times;</button>
                </div>
            `}).join('');
        }

        totalPrice.textContent = `$${this.getTotal().toLocaleString()}`;
    }

    showAddedNotification(button) {
        const originalText = button.textContent;
        button.textContent = 'Agregado';
        button.style.background = '#6B8E6B';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 1500);
    }
}

// ============ PRODUCT DETAIL MODAL ============
class ProductDetailModal {
    constructor() {
        this.overlay = document.getElementById('productModalOverlay');
        this.content = document.getElementById('productModalContent');
        this.closeBtn = document.getElementById('productModalClose');
        this.currentProduct = null;
        this.selectedExtras = [];

        if (this.overlay && this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) this.close();
            });
        }
    }

    getAddons(category) {
        const addons = {
            'Charcutería Premium': [
                { name: 'Queso Brie adicional', price: 12000 },
                { name: 'Queso Manchego adicional', price: 15000 },
                { name: 'Jamón Serrano extra', price: 18000 },
                { name: 'Salami Italiano extra', price: 10000 },
                { name: 'Frutas frescas adicionales', price: 8000 },
                { name: 'Pan artesanal extra', price: 6000 },
                { name: 'Mermelada de higos', price: 7000 },
                { name: 'Frutos secos premium', price: 9000 },
            ],
            'Regalos Románticos': [
                { name: 'Rosas adicionales (6 pzas)', price: 15000 },
                { name: 'Chocolates extra (6 pzas)', price: 12000 },
                { name: 'Peluche pequeño', price: 20000 },
                { name: 'Vela aromática', price: 10000 },
                { name: 'Globos decorativos', price: 8000 },
            ],
            'Celebraciones': [
                { name: 'Globos adicionales', price: 15000 },
                { name: 'Tabla de charcutería extra', price: 65000 },
                { name: 'Arreglo floral adicional', price: 35000 },
                { name: 'Botella de vino', price: 45000 },
            ],
            'Delicias Dulces': [
                { name: 'Chocolates extra (6 pzas)', price: 10000 },
                { name: 'Fresas cubiertas (6 pzas)', price: 12000 },
                { name: 'Macarons (4 pzas)', price: 15000 },
                { name: 'Brownie especial', price: 8000 },
            ],
            'Sorpresas Únicas': [
                { name: 'Flores adicionales', price: 15000 },
                { name: 'Chocolates gourmet extra', price: 12000 },
                { name: 'Botella de vino premium', price: 50000 },
                { name: 'Tarjeta personalizada XL', price: 5000 },
            ],
            'Flores': [
                { name: '6 rosas adicionales', price: 18000 },
                { name: 'Follaje premium', price: 10000 },
                { name: 'Caja de presentación', price: 12000 },
                { name: 'Lazo de satén premium', price: 5000 },
            ],
        };
        return addons[category] || addons['Regalos Románticos'];
    }

    open(product) {
        this.currentProduct = product;
        this.selectedExtras = [];
        
        const addons = this.getAddons(product.category);
        const includes = product.includes || [];
        
        this.content.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="modal-product-image">
            <div class="modal-product-body">
                <div class="modal-product-category">${product.category}</div>
                <h2 class="modal-product-title">${product.name}</h2>
                <div class="modal-product-price">$${product.price.toLocaleString()}</div>
                <p class="modal-product-desc">${product.description || ''}</p>
                
                ${includes.length > 0 ? `
                    <h3 class="modal-section-title">Incluye</h3>
                    <ul class="modal-includes">
                        ${includes.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                ` : ''}
                
                <h3 class="modal-section-title">Personaliza tu pedido</h3>
                <div id="addonsList">
                    ${addons.map((addon, i) => `
                        <div class="addon-option">
                            <label>
                                <input type="checkbox" data-index="${i}" data-name="${addon.name}" data-price="${addon.price}" onchange="productModal.toggleAddon(this)">
                                ${addon.name}
                            </label>
                            <span class="addon-price">+$${addon.price.toLocaleString()}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="customization-group" style="margin-top: 1.2rem;">
                    <label>¿Tienes alguna alergia o restricción alimentaria?</label>
                    <select id="allergySelect">
                        <option value="">Sin alergias</option>
                        <option value="lacteos">Intolerancia a lácteos</option>
                        <option value="gluten">Intolerancia al gluten</option>
                        <option value="frutos_secos">Alergia a frutos secos</option>
                        <option value="mariscos">Alergia a mariscos</option>
                        <option value="otro">Otra (especificar abajo)</option>
                    </select>
                </div>

                <div class="customization-group">
                    <label>Notas adicionales</label>
                    <textarea id="customNotes" placeholder="Indica cualquier preferencia especial, dedicatoria, o información adicional..."></textarea>
                </div>

                <div class="modal-total">
                    <span>Total</span>
                    <span class="modal-total-price" id="modalTotalPrice">$${product.price.toLocaleString()}</span>
                </div>

                <button class="btn-modal-add" onclick="productModal.addToCart()">
                    Agregar al Carrito
                </button>
            </div>
        `;

        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    toggleAddon(checkbox) {
        const name = checkbox.dataset.name;
        const price = parseInt(checkbox.dataset.price);

        if (checkbox.checked) {
            this.selectedExtras.push({ name, price });
        } else {
            this.selectedExtras = this.selectedExtras.filter(e => e.name !== name);
        }

        this.updateModalTotal();
    }

    updateModalTotal() {
        const extrasTotal = this.selectedExtras.reduce((sum, e) => sum + e.price, 0);
        const total = this.currentProduct.price + extrasTotal;
        const priceEl = document.getElementById('modalTotalPrice');
        if (priceEl) {
            priceEl.textContent = `$${total.toLocaleString()}`;
        }
    }

    addToCart() {
        if (!this.currentProduct || !window.cart) return;

        if (this.selectedExtras.length > 0) {
            window.cart.addItemWithExtras(this.currentProduct, [...this.selectedExtras]);
        } else {
            window.cart.addItem(this.currentProduct);
        }

        // Show success feedback
        const btn = this.content.querySelector('.btn-modal-add');
        if (btn) {
            btn.textContent = 'Agregado al carrito';
            btn.style.background = '#6B8E6B';
        }

        setTimeout(() => {
            this.close();
        }, 800);
    }
}

// ============ INITIALIZE ============
let cart;
let productModal;

document.addEventListener('DOMContentLoaded', () => {
    cart = new ShoppingCart();
    window.cart = cart;

    productModal = new ProductDetailModal();
    window.productModal = productModal;
});

// ============ MENU HAMBURGUESA ============
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            navMenu.classList.toggle("active");
        });

        document.addEventListener("click", (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove("active");
            }
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove("active");
            });
        });
    }
});

// ============ LOADER ============
setTimeout(() => {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
}, 3000);

// ============ HEADER SCROLL EFFECT ============
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 80) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ============ SMOOTH SCROLL ============
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

// ============ INTERSECTION OBSERVER FOR ANIMATIONS ============
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
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

// ============ STAGGER DELAY FOR PRODUCT CARDS ============
document.querySelectorAll('.product-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.08}s`;
});