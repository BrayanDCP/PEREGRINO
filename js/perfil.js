// ===========================
// perfil.js - Gestión de perfil de usuario
// Conectado a dashboard.js
// ===========================

// Cargar usuario desde localStorage o crear predeterminado
let usuario = JSON.parse(localStorage.getItem("usuario")) || {
    nombre: "Juan Pérez",
    email: "juan.perez@email.com",
    telefono: "+34 600 123 456",
    fechaRegistro: new Date().toLocaleDateString()
};

// ===========================
// Función para mostrar datos del perfil
// ===========================
function mostrarPerfil() {
    const campos = {
        nombre: "perfilNombre",
        email: "perfilEmail",
        telefono: "perfilTelefono",
        fechaRegistro: "perfilRegistro"
    };

    Object.keys(campos).forEach(key => {
        const el = document.getElementById(campos[key]);
        if(el) el.textContent = usuario[key];
    });

    // Si dashboard.html tiene elementos que muestran nombre/email, actualizar también
    const dashboardNombre = document.getElementById("dashboardUsuarioNombre");
    if(dashboardNombre) dashboardNombre.textContent = usuario.nombre;
}

// ===========================
// Función para editar perfil usando modal / inputs
// ===========================
function editarPerfil() {
    const nombreInput = prompt("Nombre:", usuario.nombre);
    const emailInput = prompt("Correo:", usuario.email);
    const telefonoInput = prompt("Teléfono:", usuario.telefono);

    if(!nombreInput || !emailInput || !telefonoInput) {
        alert("❌ Todos los campos son obligatorios. No se actualizó el perfil.");
        return;
    }

    // Validaciones simples
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if(!emailRegex.test(emailInput)) {
        alert("❌ Ingresa un correo válido.");
        return;
    }

    usuario.nombre = nombreInput.trim();
    usuario.email = emailInput.trim();
    usuario.telefono = telefonoInput.trim();

    // Guardar en localStorage
    localStorage.setItem("usuario", JSON.stringify(usuario));

    mostrarPerfil();
    alert("✅ Perfil actualizado correctamente!");
}

// ===========================
// Conectar botón editar perfil
// ===========================
const btnEditar = document.getElementById("btnEditarPerfil");
if(btnEditar) btnEditar.addEventListener("click", editarPerfil);

// ===========================
// Inicialización al cargar
// ===========================
window.onload = function() {
    mostrarPerfil();

    // También inicializar dashboard.js si la página es dashboard
    if(typeof actualizarTabla === "function") {
        actualizarTabla();
        checkRecordatorios();
        conectarNavbar();
    }
};