// Catalog Filter and Search System
class CatalogManager {
    constructor() {
        this.currentCategory = 'todos';
        this.searchQuery = '';
        this.init();
    }

    init() {
        this.renderProducts();
        this.attachEventListeners();
        this.initScrollAnimations();
    }

    attachEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilterClick(e);
            });
        });

        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e);
            });
        }
    }

    handleFilterClick(e) {
        const btn = e.target;
        const category = btn.dataset.category;

        // Update active state
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update current category
        this.currentCategory = category;

        // Re-render products
        this.renderProducts();
    }

    handleSearch(e) {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderProducts();
    }

    getFilteredProducts() {
        let filtered = productsDatabase;

        // Filter by category
        if (this.currentCategory !== 'todos') {
            filtered = filtered.filter(p => p.category === this.currentCategory);
        }

        // Filter by search query
        if (this.searchQuery) {
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(this.searchQuery) ||
                p.description.toLowerCase().includes(this.searchQuery)
            );
        }

        return filtered;
    }

    getCategoryLabel(category) {
        const labels = {
            'sorpresas': 'Sorpresas Románticas',
            'charcuteria': 'Charcutería & Tablas',
            'eventos': 'Eventos & Celebraciones',
            'dulces': 'Chocolates & Dulces',
            'flores': 'Arreglos Florales'
        };
        return labels[category] || category;
    }

    renderProducts() {
        const grid = document.getElementById('productsGrid');
        const resultsCount = document.getElementById('resultsCount');
        const filtered = this.getFilteredProducts();

        // Update results count
        if (resultsCount) {
            resultsCount.innerHTML = `Mostrando <strong>${filtered.length}</strong> producto${filtered.length !== 1 ? 's' : ''}`;
        }

        // Render products
        if (filtered.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
                    <div style="font-size: 5rem; margin-bottom: 1rem;">😔</div>
                    <h3 style="font-family: 'Playfair Display', serif; font-size: 2rem; color: var(--charcoal); margin-bottom: 1rem;">
                        No encontramos productos
                    </h3>
                    <p style="font-size: 1.2rem; color: #666;">
                        Intenta con otros términos de búsqueda o filtros
                    </p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(product => `
            <div class="product-card fade-in" data-product='${JSON.stringify(product)}'>
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" class="product-img">
                </div>
                <div class="product-content">
                    <div class="product-category">${this.getCategoryLabel(product.category)}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">$${product.price.toLocaleString()}</div>
                    <button class="btn-add-cart" onclick="catalog.addToCart(${product.id})">
                        Agregar al Carrito 🛒
                    </button>
                </div>
            </div>
        `).join('');

        // Re-initialize scroll animations
        setTimeout(() => {
            this.initScrollAnimations();
        }, 100);

        // Scroll to products
        if (this.searchQuery || this.currentCategory !== 'todos') {
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    addToCart(productId) {
        const product = productsDatabase.find(p => p.id === productId);
        if (product && window.cart) {
            window.cart.addItem(product);
            this.showAddNotification(productId);
        }
    }

    showAddNotification(productId) {
        const card = document.querySelector(`[data-product*='"id":${productId}']`);
        if (card) {
            const btn = card.querySelector('.btn-add-cart');
            const originalText = btn.textContent;
            btn.textContent = '✓ Agregado!';
            btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 1500);
        }
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
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
    }
}

// Initialize catalog manager when DOM is ready
let catalog;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        catalog = new CatalogManager();
    });
} else {
    catalog = new CatalogManager();
}