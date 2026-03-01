// ===========================
// login.js - Inicio de sesión con conexión a register.js
// ===========================

// Mostrar / ocultar contraseña
document.querySelectorAll(".toggle-password").forEach(element => {
    element.addEventListener("click", function(){
        const input = this.previousElementSibling;
        input.type = input.type === "password" ? "text" : "password";
    });
});

// Funciones de error
function showError(input, message){
    const errorEl = input.nextElementSibling;
    errorEl.textContent = message;
}
function clearError(input){
    const errorEl = input.nextElementSibling;
    errorEl.textContent = "";
}

// ===========================
// Manejo del formulario
// ===========================
document.getElementById('loginForm').addEventListener('submit', function(e){
    e.preventDefault();

    let hasError = false;

    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const emailRegex = /^[^\s@]+@(gmail|hotmail|yahoo|outlook)\.(com|pe|org)$/i;

    // Limpiar errores previos
    [email, password].forEach(clearError);

    // Validaciones básicas
    if(!email.value.trim()){
        showError(email, "El correo es obligatorio");
        hasError = true;
    } else if(!emailRegex.test(email.value.trim())){
        showError(email, "Correo inválido (gmail, hotmail, yahoo, outlook y .com/.pe/.org)");
        hasError = true;
    }

    if(!password.value.trim()){
        showError(password, "La contraseña es obligatoria");
        hasError = true;
    }

    if(hasError) return;

    // ===========================
    // Validar usuario en localStorage
    // ===========================
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarios.find(u => u.email === email.value.trim());

    if(!usuario){
        showError(email, "Usuario no registrado");
        return;
    }

    if(usuario.password !== password.value){
        showError(password, "Contraseña incorrecta");
        return;
    }

    // ===========================
    // Usuario válido -> guardar sesión y redirigir
    // ===========================
    localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
    alert(`✅ Bienvenido, ${usuario.nombre}!`);
    window.location.href = "dashboard.html";
});