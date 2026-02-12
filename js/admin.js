// ============ ADMIN PANEL MANAGER ============

class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.orders = this.loadOrders();
        this.products = this.loadProducts();
        this.gallery = this.loadGallery();
        this.posts = this.loadPosts();
        this.testimonials = this.loadTestimonials();
        this.orderFilter = 'todos';
        this.init();
    }

    init() {
        this.checkAuth();
        this.attachEventListeners();
        this.renderDashboard();
        this.updateStats();
    }

    checkAuth() {
        const session = localStorage.getItem('adminSession');
        if (!session) {
            window.location.href = '../inicio.html';
            return;
        }

        try {
            const sessionData = JSON.parse(session);
            const currentTime = new Date().getTime();
            const elapsed = currentTime - sessionData.loginTime;

            if (elapsed > sessionData.expiresIn) {
                localStorage.removeItem('adminSession');
                window.location.href = '../inicio.html';
            }
        } catch (error) {
            window.location.href = '../inicio.html';
        }
    }

    attachEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleNavigation(e.target.closest('.nav-item'));
            });
        });

        // Logout
        document.getElementById('btnLogout').addEventListener('click', () => {
            this.logout();
        });

        // Modal close
        document.getElementById('modalClose').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'modalOverlay') {
                this.closeModal();
            }
        });

        // Add buttons
        document.getElementById('btnAddProduct')?.addEventListener('click', () => {
            this.showProductModal();
        });

        document.getElementById('btnAddImage')?.addEventListener('click', () => {
            this.showImageModal();
        });

        document.getElementById('btnAddPost')?.addEventListener('click', () => {
            this.showPostModal();
        });

        document.getElementById('btnAddTestimonial')?.addEventListener('click', () => {
            this.showTestimonialModal();
        });

        // Order filters
        document.querySelectorAll('#orders .filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleOrderFilter(e.target);
            });
        });

        // Search
        document.getElementById('orderSearch')?.addEventListener('input', (e) => {
            this.handleOrderSearch(e.target.value);
        });

        document.getElementById('productSearch')?.addEventListener('input', (e) => {
            this.handleProductSearch(e.target.value);
        });

        // Forms
        document.getElementById('contactForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.showNotification('Configuración guardada correctamente', 'success');
        });

        document.getElementById('socialForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.showNotification('Redes sociales actualizadas', 'success');
        });
    }

    handleNavigation(button) {
        const section = button.dataset.section;

        // Update active state
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        // Update sections
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');

        // Update header
        const titles = {
            dashboard: 'Dashboard',
            orders: 'Gestión de Pedidos',
            products: 'Gestión de Productos',
            gallery: 'Galería de Imágenes',
            blog: 'Publicaciones y Consejos',
            testimonials: 'Testimonios de Clientes',
            settings: 'Configuración del Sitio'
        };

        const subtitles = {
            dashboard: 'Resumen general del negocio',
            orders: 'Administra todos los pedidos',
            products: 'Gestiona el catálogo de productos',
            gallery: 'Gestiona las imágenes del sitio',
            blog: 'Administra consejos y publicaciones',
            testimonials: 'Gestiona opiniones de clientes',
            settings: 'Configuración general'
        };

        document.getElementById('pageTitle').textContent = titles[section];
        document.getElementById('pageSubtitle').textContent = subtitles[section];

        // Render section
        this.currentSection = section;
        this.renderSection(section);
    }

    renderSection(section) {
        switch(section) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'orders':
                this.renderOrders();
                break;
            case 'products':
                this.renderProducts();
                break;
            case 'gallery':
                this.renderGallery();
                break;
            case 'blog':
                this.renderPosts();
                break;
            case 'testimonials':
                this.renderTestimonials();
                break;
        }
    }

    // ============ DASHBOARD ============
    updateStats() {
        document.getElementById('totalOrders').textContent = this.orders.length;
        document.getElementById('pendingOrders').textContent = 
            this.orders.filter(o => o.status === 'nuevo').length;
        
        const revenue = this.orders
            .filter(o => o.status === 'completado')
            .reduce((sum, o) => sum + o.total, 0);
        document.getElementById('totalRevenue').textContent = 
            `$${(revenue / 1000000).toFixed(1)}M`;
        
        document.getElementById('totalProducts').textContent = this.products.length;
    }

    renderDashboard() {
        const recentOrders = this.orders.slice(0, 5);
        const tbody = document.getElementById('recentOrdersTable');
        
        tbody.innerHTML = recentOrders.map(order => `
            <tr>
                <td>#${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.items[0]?.name || 'N/A'}</td>
                <td>$${order.total.toLocaleString()}</td>
                <td><span class="status-badge status-${order.status}">${this.getStatusLabel(order.status)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-view" onclick="admin.viewOrder(${order.id})">👁️</button>
                        <button class="btn-action btn-edit" onclick="admin.editOrder(${order.id})">✏️</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // ============ ORDERS ============
    renderOrders() {
        let filtered = this.orders;

        if (this.orderFilter !== 'todos') {
            filtered = filtered.filter(o => o.status === this.orderFilter);
        }

        const tbody = document.getElementById('ordersTable');
        tbody.innerHTML = filtered.map(order => `
            <tr>
                <td>#${order.id}</td>
                <td>${order.date}</td>
                <td>
                    <div>
                        <strong>${order.customer}</strong><br>
                        <small>${order.email}</small><br>
                        <small>📱 ${order.phone}</small>
                    </div>
                </td>
                <td>
                    <div>
                        ${order.items.map(item => `${item.name} (x${item.quantity})`).join('<br>')}
                    </div>
                </td>
                <td><strong>$${order.total.toLocaleString()}</strong></td>
                <td><span class="status-badge status-${order.status}">${this.getStatusLabel(order.status)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-view" onclick="admin.viewOrder(${order.id})">👁️</button>
                        <button class="btn-action btn-edit" onclick="admin.editOrder(${order.id})">✏️</button>
                        <button class="btn-action btn-delete" onclick="admin.deleteOrder(${order.id})">🗑️</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    handleOrderFilter(button) {
        document.querySelectorAll('#orders .filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        this.orderFilter = button.dataset.filter;
        this.renderOrders();
    }

    handleOrderSearch(query) {
        // Implementation for search
        console.log('Searching orders:', query);
    }

    viewOrder(id) {
        const order = this.orders.find(o => o.id === id);
        if (!order) return;

        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <h2 class="modal-title">Pedido #${order.id}</h2>
            <div style="display: grid; gap: 1.5rem;">
                <div>
                    <h3 style="margin-bottom: 0.5rem;">Información del Cliente</h3>
                    <p><strong>Nombre:</strong> ${order.customer}</p>
                    <p><strong>Email:</strong> ${order.email}</p>
                    <p><strong>Teléfono:</strong> ${order.phone}</p>
                    <p><strong>Dirección:</strong> ${order.address}</p>
                </div>
                <div>
                    <h3 style="margin-bottom: 0.5rem;">Productos</h3>
                    ${order.items.map(item => `
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--rose-pale);">
                            <span>${item.name} x${item.quantity}</span>
                            <span>$${item.price.toLocaleString()}</span>
                        </div>
                    `).join('')}
                    <div style="display: flex; justify-content: space-between; padding: 1rem 0; font-weight: 700; font-size: 1.2rem;">
                        <span>Total</span>
                        <span style="color: var(--rose-deep);">$${order.total.toLocaleString()}</span>
                    </div>
                </div>
                <div>
                    <h3 style="margin-bottom: 0.5rem;">Estado del Pedido</h3>
                    <span class="status-badge status-${order.status}">${this.getStatusLabel(order.status)}</span>
                </div>
            </div>
        `;
        this.openModal();
    }

    editOrder(id) {
        const order = this.orders.find(o => o.id === id);
        if (!order) return;

        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <h2 class="modal-title">Editar Pedido #${order.id}</h2>
            <form class="modal-form" onsubmit="admin.updateOrder(event, ${id})">
                <div class="form-group">
                    <label>Estado del Pedido</label>
                    <select name="status" class="form-control">
                        <option value="nuevo" ${order.status === 'nuevo' ? 'selected' : ''}>Nuevo</option>
                        <option value="proceso" ${order.status === 'proceso' ? 'selected' : ''}>En Proceso</option>
                        <option value="completado" ${order.status === 'completado' ? 'selected' : ''}>Completado</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Notas Internas</label>
                    <textarea name="notes" rows="4" class="form-control">${order.notes || ''}</textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-cancel" onclick="admin.closeModal()">Cancelar</button>
                    <button type="submit" class="btn-submit">Guardar Cambios</button>
                </div>
            </form>
        `;
        this.openModal();
    }

    updateOrder(event, id) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const order = this.orders.find(o => o.id === id);
        
        order.status = formData.get('status');
        order.notes = formData.get('notes');
        
        this.saveOrders();
        this.renderOrders();
        this.updateStats();
        this.closeModal();
        this.showNotification('Pedido actualizado correctamente', 'success');
    }

    deleteOrder(id) {
        if (!confirm('¿Estás seguro de eliminar este pedido?')) return;
        
        this.orders = this.orders.filter(o => o.id !== id);
        this.saveOrders();
        this.renderOrders();
        this.updateStats();
        this.showNotification('Pedido eliminado', 'success');
    }

    // ============ PRODUCTS ============
    renderProducts() {
        const grid = document.getElementById('productsGrid');
        grid.innerHTML = this.products.map(product => `
            <div class="admin-card">
                <img src="${product.image}" alt="${product.name}" class="card-image">
                <div class="card-content">
                    <h3 class="card-title">${product.name}</h3>
                    <p class="card-description">${product.description}</p>
                    <div class="card-meta">
                        <span class="card-price">$${product.price.toLocaleString()}</span>
                        <span class="card-category">${product.category}</span>
                    </div>
                    <div class="card-actions">
                        <button class="btn-action btn-edit" onclick="admin.editProduct(${product.id})">✏️ Editar</button>
                        <button class="btn-action btn-delete" onclick="admin.deleteProduct(${product.id})">🗑️</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showProductModal(product = null) {
        const modalBody = document.getElementById('modalBody');
        const isEdit = product !== null;

        modalBody.innerHTML = `
            <h2 class="modal-title">${isEdit ? 'Editar' : 'Nuevo'} Producto</h2>
            <form class="modal-form" onsubmit="admin.saveProduct(event, ${isEdit ? product.id : 'null'})">
                <div class="form-group">
                    <label>Nombre del Producto</label>
                    <input type="text" name="name" value="${product?.name || ''}" required>
                </div>
                <div class="form-group">
                    <label>Descripción</label>
                    <textarea name="description" rows="3" required>${product?.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Precio</label>
                    <input type="number" name="price" value="${product?.price || ''}" required>
                </div>
                <div class="form-group">
                    <label>Categoría</label>
                    <select name="category" required>
                        <option value="sorpresas">Sorpresas Románticas</option>
                        <option value="charcuteria">Charcutería</option>
                        <option value="eventos">Eventos</option>
                        <option value="dulces">Dulces</option>
                        <option value="flores">Flores</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>URL de Imagen</label>
                    <input type="text" name="image" value="${product?.image || '../img/ImgProvicional.jpg'}" required>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-cancel" onclick="admin.closeModal()">Cancelar</button>
                    <button type="submit" class="btn-submit">Guardar</button>
                </div>
            </form>
        `;
        this.openModal();
    }

    editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            this.showProductModal(product);
        }
    }

    saveProduct(event, id) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const productData = {
            name: formData.get('name'),
            description: formData.get('description'),
            price: parseInt(formData.get('price')),
            category: formData.get('category'),
            image: formData.get('image')
        };

        if (id) {
            const product = this.products.find(p => p.id === id);
            Object.assign(product, productData);
        } else {
            productData.id = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
            this.products.push(productData);
        }

        this.saveProducts();
        this.renderProducts();
        this.closeModal();
        this.showNotification(`Producto ${id ? 'actualizado' : 'creado'} correctamente`, 'success');
    }

    deleteProduct(id) {
        if (!confirm('¿Eliminar este producto?')) return;
        
        this.products = this.products.filter(p => p.id !== id);
        this.saveProducts();
        this.renderProducts();
        this.showNotification('Producto eliminado', 'success');
    }

    handleProductSearch(query) {
        console.log('Searching products:', query);
    }

    // ============ GALLERY ============
    renderGallery() {
        const grid = document.getElementById('galleryGrid');
        grid.innerHTML = this.gallery.map((img, index) => `
            <div class="gallery-card">
                <img src="${img.url}" alt="${img.title}">
                <div class="gallery-overlay">
                    <button class="btn-action btn-edit" onclick="admin.editImage(${index})">✏️</button>
                    <button class="btn-action btn-delete" onclick="admin.deleteImage(${index})">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    showImageModal(image = null, index = null) {
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <h2 class="modal-title">${image ? 'Editar' : 'Nueva'} Imagen</h2>
            <form class="modal-form" onsubmit="admin.saveImage(event, ${index})">
                <div class="form-group">
                    <label>Título</label>
                    <input type="text" name="title" value="${image?.title || ''}" required>
                </div>
                <div class="form-group">
                    <label>URL de la Imagen</label>
                    <input type="text" name="url" value="${image?.url || ''}" required>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-cancel" onclick="admin.closeModal()">Cancelar</button>
                    <button type="submit" class="btn-submit">Guardar</button>
                </div>
            </form>
        `;
        this.openModal();
    }

    editImage(index) {
        this.showImageModal(this.gallery[index], index);
    }

    saveImage(event, index) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const imageData = {
            title: formData.get('title'),
            url: formData.get('url')
        };

        if (index !== null) {
            this.gallery[index] = imageData;
        } else {
            this.gallery.push(imageData);
        }

        this.saveGallery();
        this.renderGallery();
        this.closeModal();
        this.showNotification('Imagen guardada', 'success');
    }

    deleteImage(index) {
        if (!confirm('¿Eliminar esta imagen?')) return;
        
        this.gallery.splice(index, 1);
        this.saveGallery();
        this.renderGallery();
        this.showNotification('Imagen eliminada', 'success');
    }

    // ============ BLOG POSTS ============
    renderPosts() {
        const grid = document.getElementById('postsGrid');
        grid.innerHTML = this.posts.map(post => `
            <div class="admin-card">
                <div class="card-content">
                    <div class="card-category">${post.category}</div>
                    <h3 class="card-title">${post.title}</h3>
                    <p class="card-description">${post.excerpt}</p>
                    <div style="margin-top: 1rem; color: #999; font-size: 0.9rem;">
                        Por ${post.author} • ${post.date}
                    </div>
                    <div class="card-actions">
                        <button class="btn-action btn-edit" onclick="admin.editPost(${post.id})">✏️ Editar</button>
                        <button class="btn-action btn-delete" onclick="admin.deletePost(${post.id})">🗑️</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showPostModal(post = null) {
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <h2 class="modal-title">${post ? 'Editar' : 'Nueva'} Publicación</h2>
            <form class="modal-form" onsubmit="admin.savePost(event, ${post?.id || 'null'})">
                <div class="form-group">
                    <label>Título</label>
                    <input type="text" name="title" value="${post?.title || ''}" required>
                </div>
                <div class="form-group">
                    <label>Categoría</label>
                    <input type="text" name="category" value="${post?.category || ''}" required>
                </div>
                <div class="form-group">
                    <label>Extracto</label>
                    <textarea name="excerpt" rows="3" required>${post?.excerpt || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Contenido</label>
                    <textarea name="content" rows="8" required>${post?.content || ''}</textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-cancel" onclick="admin.closeModal()">Cancelar</button>
                    <button type="submit" class="btn-submit">Publicar</button>
                </div>
            </form>
        `;
        this.openModal();
    }

    editPost(id) {
        const post = this.posts.find(p => p.id === id);
        if (post) this.showPostModal(post);
    }

    savePost(event, id) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const postData = {
            title: formData.get('title'),
            category: formData.get('category'),
            excerpt: formData.get('excerpt'),
            content: formData.get('content'),
            author: 'Admin',
            date: new Date().toLocaleDateString()
        };

        if (id) {
            const post = this.posts.find(p => p.id === id);
            Object.assign(post, postData);
        } else {
            postData.id = this.posts.length > 0 ? Math.max(...this.posts.map(p => p.id)) + 1 : 1;
            this.posts.push(postData);
        }

        this.savePosts();
        this.renderPosts();
        this.closeModal();
        this.showNotification('Publicación guardada', 'success');
    }

    deletePost(id) {
        if (!confirm('¿Eliminar esta publicación?')) return;
        
        this.posts = this.posts.filter(p => p.id !== id);
        this.savePosts();
        this.renderPosts();
        this.showNotification('Publicación eliminada', 'success');
    }

    // ============ TESTIMONIALS ============
    renderTestimonials() {
        const grid = document.getElementById('testimonialsGrid');
        grid.innerHTML = this.testimonials.map(test => `
            <div class="admin-card">
                <div class="card-content">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, var(--rose-primary), var(--gold)); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                            ${test.avatar}
                        </div>
                        <div>
                            <h4 style="margin: 0; font-family: 'Playfair Display', serif;">${test.name}</h4>
                            <div style="color: var(--rose-primary);">${test.location}</div>
                            <div style="color: var(--gold);">${'★'.repeat(test.rating)}</div>
                        </div>
                    </div>
                    <p class="card-description">"${test.text}"</p>
                    <div class="card-actions">
                        <button class="btn-action btn-edit" onclick="admin.editTestimonial(${test.id})">✏️ Editar</button>
                        <button class="btn-action btn-delete" onclick="admin.deleteTestimonial(${test.id})">🗑️</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showTestimonialModal(testimonial = null) {
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <h2 class="modal-title">${testimonial ? 'Editar' : 'Nuevo'} Testimonio</h2>
            <form class="modal-form" onsubmit="admin.saveTestimonial(event, ${testimonial?.id || 'null'})">
                <div class="form-group">
                    <label>Nombre del Cliente</label>
                    <input type="text" name="name" value="${testimonial?.name || ''}" required>
                </div>
                <div class="form-group">
                    <label>Ubicación</label>
                    <input type="text" name="location" value="${testimonial?.location || 'Cúcuta'}" required>
                </div>
                <div class="form-group">
                    <label>Avatar (Emoji)</label>
                    <input type="text" name="avatar" value="${testimonial?.avatar || '💝'}" required>
                </div>
                <div class="form-group">
                    <label>Calificación (1-5)</label>
                    <input type="number" name="rating" min="1" max="5" value="${testimonial?.rating || 5}" required>
                </div>
                <div class="form-group">
                    <label>Testimonio</label>
                    <textarea name="text" rows="5" required>${testimonial?.text || ''}</textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-cancel" onclick="admin.closeModal()">Cancelar</button>
                    <button type="submit" class="btn-submit">Guardar</button>
                </div>
            </form>
        `;
        this.openModal();
    }

    editTestimonial(id) {
        const testimonial = this.testimonials.find(t => t.id === id);
        if (testimonial) this.showTestimonialModal(testimonial);
    }

    saveTestimonial(event, id) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const testimonialData = {
            name: formData.get('name'),
            location: formData.get('location'),
            avatar: formData.get('avatar'),
            rating: parseInt(formData.get('rating')),
            text: formData.get('text')
        };

        if (id) {
            const testimonial = this.testimonials.find(t => t.id === id);
            Object.assign(testimonial, testimonialData);
        } else {
            testimonialData.id = this.testimonials.length > 0 ? Math.max(...this.testimonials.map(t => t.id)) + 1 : 1;
            this.testimonials.push(testimonialData);
        }

        this.saveTestimonials();
        this.renderTestimonials();
        this.closeModal();
        this.showNotification('Testimonio guardado', 'success');
    }

    deleteTestimonial(id) {
        if (!confirm('¿Eliminar este testimonio?')) return;
        
        this.testimonials = this.testimonials.filter(t => t.id !== id);
        this.saveTestimonials();
        this.renderTestimonials();
        this.showNotification('Testimonio eliminado', 'success');
    }

    // ============ UTILITIES ============
    getStatusLabel(status) {
        const labels = {
            nuevo: 'Nuevo',
            proceso: 'En Proceso',
            completado: 'Completado'
        };
        return labels[status] || status;
    }

    openModal() {
        document.getElementById('modalOverlay').classList.add('active');
    }

    closeModal() {
        document.getElementById('modalOverlay').classList.remove('active');
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? 'linear-gradient(135deg, #2ecc71, #27ae60)' : 'linear-gradient(135deg, #e74c3c, #c0392b)'};
            color: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.4s ease;
            font-weight: 600;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }

    logout() {
        if (confirm('¿Cerrar sesión?')) {
            localStorage.removeItem('adminSession');
            window.location.href = '../inicio.html';
        }
    }

    // ============ DATA PERSISTENCE ============
    loadOrders() {
        const saved = localStorage.getItem('orders');
        if (saved) return JSON.parse(saved);

        // Mock data
        return [
            {
                id: 1001,
                date: '12/02/2026',
                customer: 'María González',
                email: 'maria@email.com',
                phone: '+57 300 111 2222',
                address: 'Calle 5 #10-20, Cúcuta',
                items: [
                    { name: 'Caja de Amor Clásica', quantity: 1, price: 45000 }
                ],
                total: 45000,
                status: 'nuevo',
                notes: ''
            },
            {
                id: 1002,
                date: '11/02/2026',
                customer: 'Carlos Ramírez',
                email: 'carlos@email.com',
                phone: '+57 300 333 4444',
                address: 'Av. Principal #15-30',
                items: [
                    { name: 'Tabla Gourmet Clásica', quantity: 2, price: 65000 }
                ],
                total: 130000,
                status: 'proceso',
                notes: 'Cliente prefiere entrega en la tarde'
            },
            {
                id: 1003,
                date: '10/02/2026',
                customer: 'Ana Martínez',
                email: 'ana@email.com',
                phone: '+57 300 555 6666',
                address: 'Carrera 8 #20-15',
                items: [
                    { name: 'Paquete Cumpleaños', quantity: 1, price: 120000 }
                ],
                total: 120000,
                status: 'completado',
                notes: 'Entrega exitosa'
            }
        ];
    }

    loadProducts() {
        const saved = localStorage.getItem('adminProducts');
        if (saved) return JSON.parse(saved);

        // Use catalog products as default
        if (typeof productsDatabase !== 'undefined') {
            return [...productsDatabase];
        }

        return [];
    }

    loadGallery() {
        const saved = localStorage.getItem('gallery');
        if (saved) return JSON.parse(saved);

        return [
            { title: 'Creación 1', url: '../img/ImgProvicional.jpg' },
            { title: 'Creación 2', url: '../img/ImgProvicional2.jpg' },
            { title: 'Creación 3', url: '../img/ImgProvicional3.jpg' }
        ];
    }

    loadPosts() {
        const saved = localStorage.getItem('posts');
        if (saved) return JSON.parse(saved);

        return [
            {
                id: 1,
                title: 'Cómo Armar una Tabla de Quesos Profesional',
                category: 'Charcutería',
                excerpt: 'Aprende a seleccionar, combinar y presentar quesos de manera profesional.',
                content: 'Contenido completo del post...',
                author: 'Mariols',
                date: '10/02/2026'
            }
        ];
    }

    loadTestimonials() {
        const saved = localStorage.getItem('testimonials');
        if (saved) return JSON.parse(saved);

        return [
            {
                id: 1,
                name: 'María González',
                location: 'Cúcuta',
                avatar: '💕',
                rating: 5,
                text: 'La tabla de charcutería que pedí fue simplemente espectacular. ¡Totalmente recomendado!'
            }
        ];
    }

    saveOrders() {
        localStorage.setItem('orders', JSON.stringify(this.orders));
    }

    saveProducts() {
        localStorage.setItem('adminProducts', JSON.stringify(this.products));
    }

    saveGallery() {
        localStorage.setItem('gallery', JSON.stringify(this.gallery));
    }

    savePosts() {
        localStorage.setItem('posts', JSON.stringify(this.posts));
    }

    saveTestimonials() {
        localStorage.setItem('testimonials', JSON.stringify(this.testimonials));
    }
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    .form-control {
        padding: 0.8rem 1rem;
        border: 2px solid var(--rose-pale);
        border-radius: 10px;
        font-size: 1rem;
        font-family: inherit;
        transition: all 0.3s ease;
        background: var(--cream);
        width: 100%;
    }
    .form-control:focus {
        outline: none;
        border-color: var(--rose-primary);
        background: white;
        box-shadow: 0 5px 20px rgba(212, 85, 122, 0.15);
    }
`;
document.head.appendChild(style);

// Initialize admin panel
let admin;
document.addEventListener('DOMContentLoaded', () => {
    admin = new AdminPanel();
});