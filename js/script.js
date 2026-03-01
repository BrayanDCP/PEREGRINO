// =======================================
// script.js - Manejo de index.html
// Pantalla de bienvenida: registro o login
// =======================================

// Esperar a que cargue todo el DOM
document.addEventListener("DOMContentLoaded", () => {

    const loader = document.querySelector(".loader");
    const mainContent = document.querySelector(".main-content");
    const btnCrear = document.querySelector("a[href='register.html']");
    const btnLogin = document.querySelector("a[href='login.html']");

    // ==========================
    // Mostrar loader y luego contenido
    // ==========================
    function ocultarLoader(delay = 1200) {
        if(loader){
            setTimeout(() => {
                loader.style.opacity = 0;
                setTimeout(() => loader.style.display = "none", 300);
                if(mainContent) mainContent.style.display = "flex";
            }, delay);
        } else {
            if(mainContent) mainContent.style.display = "flex";
        }
    }

    // ==========================
    // Comprobar si ya hay usuario logueado
    // ==========================
    const usuario = JSON.parse(localStorage.getItem("usuario")) || null;
    if(usuario && usuario.email){
        // Si hay usuario, redirigir directo al dashboard
        window.location.href = "dashboard.html";
        return;
    }

    // ==========================
    // Configurar botones Crear Cuenta / Iniciar Sesión
    // ==========================
    if(btnCrear){
        btnCrear.addEventListener("click", () => {
            window.location.href = "register.html";
        });
    }

    if(btnLogin){
        btnLogin.addEventListener("click", () => {
            window.location.href = "login.html";
        });
    }

    // ==========================
    // Ocultar loader y mostrar contenido
    // ==========================
    ocultarLoader();
});