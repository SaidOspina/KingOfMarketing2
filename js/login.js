// ============ LOGIN HANDLER ============

class LoginManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoginHandler();
    }

    setupLoginHandler() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Check if already logged in
        if (this.isLoggedIn()) {
            window.location.href = 'html/admin.html';
        }
    }

    handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        // Simulación de autenticación
        if (username === 'admin' && password === 'mariols2026') {
            // Guardar sesión
            this.setSession();
            
            // Mostrar mensaje de éxito
            this.showSuccess('¡Bienvenido! Redirigiendo...');
            
            // Redirigir al panel
            setTimeout(() => {
                window.location.href = 'html/admin.html';
            }, 1000);
        } else {
            this.showError('Usuario o contraseña incorrectos');
            
            // Shake animation on error
            const card = document.querySelector('.login-card');
            card.style.animation = 'shake 0.5s';
            setTimeout(() => {
                card.style.animation = '';
            }, 500);
        }
    }

    setSession() {
        // Guardar en localStorage
        const sessionData = {
            user: 'admin',
            loginTime: new Date().getTime(),
            expiresIn: 24 * 60 * 60 * 1000 // 24 horas
        };
        localStorage.setItem('adminSession', JSON.stringify(sessionData));
    }

    isLoggedIn() {
        const session = localStorage.getItem('adminSession');
        if (!session) return false;

        try {
            const sessionData = JSON.parse(session);
            const currentTime = new Date().getTime();
            const elapsed = currentTime - sessionData.loginTime;

            // Verificar si la sesión ha expirado
            if (elapsed > sessionData.expiresIn) {
                localStorage.removeItem('adminSession');
                return false;
            }

            return true;
        } catch (error) {
            return false;
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }
}

// Agregar estilos de animación shake
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// Inicializar el manejador de login
let loginManager;
document.addEventListener('DOMContentLoaded', () => {
    loginManager = new LoginManager();
});