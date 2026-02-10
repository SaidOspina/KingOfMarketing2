// ============ ADMIN PANEL MANAGEMENT SYSTEM ============

class AdminPanel {
    constructor() {
        this.currentSection = 'pedidos';
        this.init();
    }

    init() {
        this.setupLoginHandler();
        this.setupLogoutHandler();
        this.setupNavigation();
        this.loadMockData();
    }

    // ============ AUTHENTICATION ============
    setupLoginHandler() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simulación de autenticación
        if (username === 'admin' && password === 'mariols2026') {
            this.showSuccess('¡Bienvenido!');
            setTimeout(() => {
                document.getElementById('loginScreen').style.display = 'none';
                document.getElementById('adminDashboard').style.display = 'grid';
                this.loadSection('pedidos');
            }, 800);
        } else {
            this.showError('Usuario o contraseña incorrectos');
        }
    }

    setupLogoutHandler() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('¿Estás seguro de cerrar sesión?')) {
                    document.getElementById('adminDashboard').style.display = 'none';
                    document.getElementById('loginScreen').style.display = 'flex';
                    document.getElementById('username').value = '';
                    document.getElementById('password').value = '';
                }
            });
        }
    }

    // ============ NAVIGATION ============
    setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                this.switchSection(section);
            });
        });
    }

    switchSection(section) {
        // Update nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update content sections
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(`section-${section}`).classList.add('active');

        // Update header
        const titles = {
            pedidos: { title: 'Gestión de Pedidos', desc: 'Administra y procesa los pedidos de tus clientes' },
            especialidades: { title: 'Gestión de Especialidades', desc: 'Administra los productos destacados de la página principal' },
            catalogo: { title: 'Gestión del Catálogo', desc: 'Administra todos los productos disponibles' },
            galeria: { title: 'Gestión de Galería', desc: 'Administra las imágenes de la galería' },
            consejos: { title: 'Gestión de Consejos', desc: 'Administra los posts y consejos de la comunidad' }
        };

        document.getElementById('sectionTitle').textContent = titles[section].title;
        document.getElementById('sectionDescription').textContent = titles[section].desc;

        this.currentSection = section;
        this.loadSection(section);
    }

    loadSection(section) {
        switch(section) {
            case 'pedidos':
                this.loadPedidos();
                break;
            case 'especialidades':
                this.loadEspecialidades();
                break;
            case 'catalogo':
                this.loadCatalogo();
                break;
            case 'galeria':
                this.loadGaleria();
                break;
            case 'consejos':
                this.loadConsejos();
                break;
        }
    }

    // ============ MOCK DATA ============
    loadMockData() {
        // Datos simulados de pedidos
        this.pedidos = [
            { id: 'PED-001', cliente: 'María González', producto: 'Caja de Amor Clásica', fecha: '2026-02-10', total: 45000, estado: 'nuevo' },
            { id: 'PED-002', cliente: 'Carlos Ramírez', producto: 'Tabla Gourmet Premium', fecha: '2026-02-10', total: 85000, estado: 'proceso' },
            { id: 'PED-003', cliente: 'Ana Martínez', producto: 'Combo Romántico Especial', fecha: '2026-02-09', total: 95000, estado: 'completado' },
            { id: 'PED-004', cliente: 'Luis Pérez', producto: 'Desayuno Sorpresa', fecha: '2026-02-09', total: 65000, estado: 'nuevo' },
            { id: 'PED-005', cliente: 'Sofia Torres', producto: 'Arreglo Floral Premium', fecha: '2026-02-08', total: 75000, estado: 'proceso' },
            { id: 'PED-006', cliente: 'Diego Castro', producto: 'Paquete Aniversario', fecha: '2026-02-08', total: 145000, estado: 'completado' },
        ];

        // Datos de especialidades (productos destacados)
        this.especialidades = [
            { id: 1, name: 'Cajas de Amor', price: 45000, category: 'Regalos Románticos', image: 'img/ImgProvicional.jpg', description: 'Sorpresas personalizadas con flores y chocolates' },
            { id: 2, name: 'Tablas Gourmet', price: 65000, category: 'Charcutería Premium', image: 'img/ImgProvicional2.jpg', description: 'Selección exquisita de quesos artesanales' },
            { id: 3, name: 'Eventos Especiales', price: 120000, category: 'Celebraciones', image: 'img/ImgProvicional3.jpg', description: 'Paquetes personalizados para celebraciones' },
            { id: 4, name: 'Chocolates Artesanales', price: 35000, category: 'Delicias Dulces', image: 'img/ImgProvicional.jpg', description: 'Chocolates premium y postres gourmet' },
            { id: 5, name: 'Combos Personalizados', price: 85000, category: 'Sorpresas Únicas', image: 'img/ImgProvicional2.jpg', description: 'Combinaciones únicas de regalos' },
            { id: 6, name: 'Arreglos Florales', price: 55000, category: 'Amor Eterno', image: 'img/ImgProvicional3.jpg', description: 'Flores frescas y arreglos exclusivos' }
        ];

        // Imágenes de galería
        this.galeria = [
            { id: 1, image: 'img/ImgProvicional.jpg', alt: 'Creación romántica 1' },
            { id: 2, image: 'img/ImgProvicional2.jpg', alt: 'Tabla de quesos 1' },
            { id: 3, image: 'img/ImgProvicional3.jpg', alt: 'Evento especial 1' },
            { id: 4, image: 'img/ImgProvicional.jpg', alt: 'Creación romántica 2' },
            { id: 5, image: 'img/ImgProvicional2.jpg', alt: 'Tabla de quesos 2' },
            { id: 6, image: 'img/ImgProvicional3.jpg', alt: 'Evento especial 2' },
            { id: 7, image: 'img/ImgProvicional.jpg', alt: 'Creación romántica 3' },
            { id: 8, image: 'img/ImgProvicional2.jpg', alt: 'Tabla de quesos 3' }
        ];

        // Posts de consejos
        this.consejos = [
            { 
                id: 1, 
                title: 'Cómo Armar una Tabla de Quesos Profesional', 
                category: 'Charcutería',
                author: 'Mariols',
                date: '2026-02-08',
                excerpt: 'Tutorial paso a paso para seleccionar y presentar quesos...',
                likes: 245,
                comments: 18
            },
            { 
                id: 2, 
                title: '10 Ideas de Presentación para Cajas de Regalo', 
                category: 'Decoración',
                author: 'Mariols',
                date: '2026-02-05',
                excerpt: 'La presentación es tan importante como el contenido...',
                likes: 198,
                comments: 32
            },
            { 
                id: 3, 
                title: 'Guía Completa: Planifica tu Evento Especial', 
                category: 'Eventos',
                author: 'Mariols',
                date: '2026-02-03',
                excerpt: 'Planificar un evento puede ser estresante, pero con organización...',
                likes: 312,
                comments: 56
            }
        ];
    }

    // ============ PEDIDOS ============
    loadPedidos() {
        const table = document.getElementById('pedidosTable');
        if (!table) return;

        const statusLabels = {
            nuevo: 'Nuevo',
            proceso: 'En Proceso',
            completado: 'Completado'
        };

        table.innerHTML = this.pedidos.map(pedido => `
            <tr>
                <td><strong>${pedido.id}</strong></td>
                <td>${pedido.cliente}</td>
                <td>${pedido.producto}</td>
                <td>${pedido.fecha}</td>
                <td><strong>$${pedido.total.toLocaleString()}</strong></td>
                <td>
                    <span class="status-badge status-${pedido.estado}">
                        ${statusLabels[pedido.estado]}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-view" onclick="admin.viewPedido('${pedido.id}')" title="Ver detalles">
                            👁️
                        </button>
                        <button class="btn-action btn-edit" onclick="admin.editPedido('${pedido.id}')" title="Editar">
                            ✏️
                        </button>
                        <button class="btn-action btn-delete" onclick="admin.deletePedido('${pedido.id}')" title="Eliminar">
                            🗑️
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    viewPedido(id) {
        const pedido = this.pedidos.find(p => p.id === id);
        if (!pedido) return;

        this.openModal('view-pedido');
        document.getElementById('modalBody').innerHTML = `
            <h2 class="modal-title">Detalles del Pedido ${pedido.id}</h2>
            <div style="display: grid; gap: 1rem;">
                <div><strong>Cliente:</strong> ${pedido.cliente}</div>
                <div><strong>Producto:</strong> ${pedido.producto}</div>
                <div><strong>Fecha:</strong> ${pedido.fecha}</div>
                <div><strong>Total:</strong> $${pedido.total.toLocaleString()}</div>
                <div><strong>Estado:</strong> ${pedido.estado}</div>
            </div>
            <div class="modal-actions">
                <button class="btn-cancel" onclick="admin.closeModal()">Cerrar</button>
            </div>
        `;
    }

    editPedido(id) {
        this.showSuccess(`Editando pedido ${id} (función simulada)`);
    }

    deletePedido(id) {
        if (confirm(`¿Eliminar el pedido ${id}?`)) {
            this.pedidos = this.pedidos.filter(p => p.id !== id);
            this.loadPedidos();
            this.showSuccess('Pedido eliminado');
        }
    }

    // ============ ESPECIALIDADES ============
    loadEspecialidades() {
        const grid = document.getElementById('especialidadesGrid');
        if (!grid) return;

        grid.innerHTML = this.especialidades.map(item => `
            <div class="admin-card">
                <img src="${item.image}" alt="${item.name}" class="card-image">
                <div class="card-content">
                    <h3 class="card-title">${item.name}</h3>
                    <p class="card-description">${item.description}</p>
                    <div class="card-meta">
                        <div class="card-price">$${item.price.toLocaleString()}</div>
                        <div class="card-category">${item.category}</div>
                    </div>
                    <div class="card-actions">
                        <button class="btn-action btn-edit" onclick="admin.editEspecialidad(${item.id})">
                            ✏️ Editar
                        </button>
                        <button class="btn-action btn-delete" onclick="admin.deleteEspecialidad(${item.id})">
                            🗑️ Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    editEspecialidad(id) {
        const item = this.especialidades.find(e => e.id === id);
        if (!item) return;

        this.openModal('edit-especialidad');
        document.getElementById('modalBody').innerHTML = `
            <h2 class="modal-title">Editar Especialidad</h2>
            <form class="modal-form" onsubmit="admin.saveEspecialidad(event, ${id})">
                <div class="form-group">
                    <label>Nombre del Producto</label>
                    <input type="text" value="${item.name}" required>
                </div>
                <div class="form-group">
                    <label>Precio</label>
                    <input type="number" value="${item.price}" required>
                </div>
                <div class="form-group">
                    <label>Categoría</label>
                    <input type="text" value="${item.category}" required>
                </div>
                <div class="form-group">
                    <label>Descripción</label>
                    <textarea required>${item.description}</textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-cancel" onclick="admin.closeModal()">Cancelar</button>
                    <button type="submit" class="btn-submit">Guardar Cambios</button>
                </div>
            </form>
        `;
    }

    saveEspecialidad(event, id) {
        event.preventDefault();
        this.closeModal();
        this.showSuccess('Especialidad actualizada correctamente');
    }

    deleteEspecialidad(id) {
        if (confirm('¿Eliminar esta especialidad?')) {
            this.especialidades = this.especialidades.filter(e => e.id !== id);
            this.loadEspecialidades();
            this.showSuccess('Especialidad eliminada');
        }
    }

    // ============ CATÁLOGO ============
    loadCatalogo() {
        const grid = document.getElementById('catalogoGrid');
        if (!grid) return;

        // Usando los primeros 12 productos del catálogo
        const productos = window.productsDatabase ? window.productsDatabase.slice(0, 12) : [];

        grid.innerHTML = productos.map(producto => `
            <div class="admin-card">
                <img src="${producto.image}" alt="${producto.name}" class="card-image">
                <div class="card-content">
                    <h3 class="card-title">${producto.name}</h3>
                    <p class="card-description">${producto.description}</p>
                    <div class="card-meta">
                        <div class="card-price">$${producto.price.toLocaleString()}</div>
                        <div class="card-category">${producto.category}</div>
                    </div>
                    <div class="card-actions">
                        <button class="btn-action btn-edit" onclick="admin.editProducto(${producto.id})">
                            ✏️ Editar
                        </button>
                        <button class="btn-action btn-delete" onclick="admin.deleteProducto(${producto.id})">
                            🗑️ Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    editProducto(id) {
        this.showSuccess(`Editando producto #${id} (función simulada)`);
    }

    deleteProducto(id) {
        if (confirm('¿Eliminar este producto?')) {
            this.showSuccess('Producto eliminado');
        }
    }

    // ============ GALERÍA ============
    loadGaleria() {
        const grid = document.getElementById('galeriaGrid');
        if (!grid) return;

        grid.innerHTML = this.galeria.map(img => `
            <div class="gallery-card">
                <img src="${img.image}" alt="${img.alt}">
                <div class="gallery-overlay">
                    <button class="btn-action btn-edit" onclick="admin.editImagen(${img.id})">
                        ✏️
                    </button>
                    <button class="btn-action btn-delete" onclick="admin.deleteImagen(${img.id})">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');
    }

    editImagen(id) {
        this.showSuccess(`Editando imagen #${id} (función simulada)`);
    }

    deleteImagen(id) {
        if (confirm('¿Eliminar esta imagen?')) {
            this.galeria = this.galeria.filter(g => g.id !== id);
            this.loadGaleria();
            this.showSuccess('Imagen eliminada');
        }
    }

    // ============ CONSEJOS ============
    loadConsejos() {
        const grid = document.getElementById('consejosGrid');
        if (!grid) return;

        grid.innerHTML = this.consejos.map(post => `
            <div class="admin-card">
                <div class="card-content">
                    <div class="card-category">${post.category}</div>
                    <h3 class="card-title">${post.title}</h3>
                    <p class="card-description">${post.excerpt}</p>
                    <div style="display: flex; justify-content: space-between; margin: 1rem 0; color: #666; font-size: 0.9rem;">
                        <span>👍 ${post.likes}</span>
                        <span>💬 ${post.comments}</span>
                        <span>📅 ${post.date}</span>
                    </div>
                    <div class="card-actions">
                        <button class="btn-action btn-edit" onclick="admin.editConsejo(${post.id})">
                            ✏️ Editar
                        </button>
                        <button class="btn-action btn-delete" onclick="admin.deleteConsejo(${post.id})">
                            🗑️ Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    editConsejo(id) {
        const post = this.consejos.find(c => c.id === id);
        if (!post) return;

        this.openModal('edit-consejo');
        document.getElementById('modalBody').innerHTML = `
            <h2 class="modal-title">Editar Consejo</h2>
            <form class="modal-form" onsubmit="admin.saveConsejo(event, ${id})">
                <div class="form-group">
                    <label>Título</label>
                    <input type="text" value="${post.title}" required>
                </div>
                <div class="form-group">
                    <label>Categoría</label>
                    <input type="text" value="${post.category}" required>
                </div>
                <div class="form-group">
                    <label>Extracto</label>
                    <textarea required>${post.excerpt}</textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-cancel" onclick="admin.closeModal()">Cancelar</button>
                    <button type="submit" class="btn-submit">Guardar Cambios</button>
                </div>
            </form>
        `;
    }

    saveConsejo(event, id) {
        event.preventDefault();
        this.closeModal();
        this.showSuccess('Consejo actualizado correctamente');
    }

    deleteConsejo(id) {
        if (confirm('¿Eliminar este consejo?')) {
            this.consejos = this.consejos.filter(c => c.id !== id);
            this.loadConsejos();
            this.showSuccess('Consejo eliminado');
        }
    }

    // ============ MODAL MANAGEMENT ============
    openModal(type) {
        const modal = document.getElementById('modalContainer');
        modal.classList.add('active');

        // Si el tipo es genérico como add-*, mostrar formulario básico
        if (type.startsWith('add-')) {
            const itemType = type.replace('add-', '');
            this.showAddForm(itemType);
        }
    }

    showAddForm(itemType) {
        const titles = {
            'especialidad': 'Agregar Nueva Especialidad',
            'producto': 'Agregar Nuevo Producto',
            'imagen': 'Agregar Nueva Imagen',
            'consejo': 'Agregar Nuevo Consejo'
        };

        document.getElementById('modalBody').innerHTML = `
            <h2 class="modal-title">${titles[itemType]}</h2>
            <form class="modal-form" onsubmit="admin.submitAdd(event, '${itemType}')">
                <div class="form-group">
                    <label>Título/Nombre</label>
                    <input type="text" required placeholder="Ingresa el nombre">
                </div>
                <div class="form-group">
                    <label>Descripción</label>
                    <textarea required placeholder="Ingresa la descripción"></textarea>
                </div>
                ${itemType !== 'imagen' ? `
                <div class="form-group">
                    <label>Categoría</label>
                    <input type="text" required placeholder="Categoría del item">
                </div>
                ` : ''}
                ${itemType === 'especialidad' || itemType === 'producto' ? `
                <div class="form-group">
                    <label>Precio</label>
                    <input type="number" required placeholder="0">
                </div>
                ` : ''}
                <div class="form-group">
                    <label>Imagen</label>
                    <input type="file" accept="image/*">
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-cancel" onclick="admin.closeModal()">Cancelar</button>
                    <button type="submit" class="btn-submit">Agregar ${itemType}</button>
                </div>
            </form>
        `;
    }

    submitAdd(event, itemType) {
        event.preventDefault();
        this.closeModal();
        this.showSuccess(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} agregado correctamente`);
        
        // Recargar la sección actual
        setTimeout(() => {
            this.loadSection(this.currentSection);
        }, 500);
    }

    closeModal() {
        document.getElementById('modalContainer').classList.remove('active');
    }

    // ============ NOTIFICATIONS ============
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
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
            font-weight: 600;
            animation: slideInRight 0.4s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }
}

// Inicializar el panel de administración
let admin;
document.addEventListener('DOMContentLoaded', () => {
    admin = new AdminPanel();
});

// Agregar estilos de animación
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
`;
document.head.appendChild(style);