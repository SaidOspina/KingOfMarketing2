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
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterClick(e));
        });

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e));
        }
    }

    handleFilterClick(e) {
        const btn = e.target;
        const category = btn.dataset.category;

        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCategory = category;
        this.renderProducts();
    }

    handleSearch(e) {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderProducts();
    }

    getFilteredProducts() {
        let filtered = productsDatabase;
        if (this.currentCategory !== 'todos') {
            filtered = filtered.filter(p => p.category === this.currentCategory);
        }
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
        const filtered = this.getFilteredProducts();

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
                    <h3 style="font-family: 'Playfair Display', serif; font-size: 1.8rem; color: var(--brown-deep); margin-bottom: 1rem;">
                        No encontramos productos
                    </h3>
                    <p style="font-size: 1.1rem; color: var(--text-medium);">
                        Intenta con otros términos de búsqueda o filtros
                    </p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(product => `
            <div class="product-card fade-in" data-product='${JSON.stringify(product)}'>
                <div class="product-image" onclick="catalog.openProductDetail(${product.id})" style="cursor: pointer;">
                    <img src="${product.image}" alt="${product.name}" class="product-img">
                </div>
                <div class="product-content">
                    <div class="product-category">${this.getCategoryLabel(product.category)}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">$${product.price.toLocaleString()}</div>
                    <button class="btn-add-cart" onclick="catalog.openProductDetail(${product.id})">
                        Ver Detalles y Personalizar
                    </button>
                </div>
            </div>
        `).join('');

        setTimeout(() => this.initScrollAnimations(), 100);
    }

    openProductDetail(productId) {
        const product = productsDatabase.find(p => p.id === productId);
        if (product && window.productModal) {
            window.productModal.open(product);
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
            btn.textContent = 'Agregado';
            btn.style.background = '#6B8E6B';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 1500);
        }
    }

    initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.fade-in').forEach(element => {
            observer.observe(element);
        });
    }
}

let catalog;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        catalog = new CatalogManager();
    });
} else {
    catalog = new CatalogManager();
}