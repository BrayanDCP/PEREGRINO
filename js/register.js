// ===========================
// register.js - registro de usuario
// ===========================

// Mostrar / ocultar contraseña
document.querySelectorAll(".toggle-password").forEach(element => {
    element.addEventListener("click", function(){
        const input = this.previousElementSibling;
        input.type = input.type === "password" ? "text" : "password";
    });
});

// Mostrar input "Otros país" si se selecciona
document.getElementById('pais').addEventListener('change', function(){
    document.getElementById('otrosPaisContainer').style.display = this.value === "Otros" ? "block" : "none";
});

// Funciones de error
function showError(input, message){ input.nextElementSibling.textContent = message; }
function clearError(input){ input.nextElementSibling.textContent = ""; }

// ===========================
// Envío del formulario
// ===========================
document.getElementById('registerForm').addEventListener('submit', function(e){
    e.preventDefault();

    let hasError = false;

    const nombre = document.getElementById('nombre');
    const apellido = document.getElementById('apellido');
    const email = document.getElementById('email');
    const fechaNacimiento = document.getElementById('fechaNacimiento');
    const pais = document.getElementById('pais');
    const otrosPais = document.getElementById('otrosPais');
    const password = document.getElementById('password');
    const password2 = document.getElementById('password2');

    const letrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const emailRegex = /^[^\s@]+@(gmail|hotmail|yahoo|outlook)\.(com|pe|org)$/i;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%&*])[A-Za-z\d!@#$%&*]{8,}$/;

    [nombre, apellido, email, fechaNacimiento, pais, otrosPais, password, password2].forEach(clearError);

    // Validaciones
    if(!nombre.value.trim() || !letrasRegex.test(nombre.value.trim()) || nombre.value.length > 70){
        showError(nombre, "Nombre inválido (solo letras, max 70)");
        hasError = true;
    }
    if(!apellido.value.trim() || !letrasRegex.test(apellido.value.trim()) || apellido.value.length > 70){
        showError(apellido, "Apellido inválido (solo letras, max 70)");
        hasError = true;
    }
    if(!email.value.trim() || !emailRegex.test(email.value.trim())){
        showError(email, "Correo inválido");
        hasError = true;
    }
    if(!fechaNacimiento.value){
        showError(fechaNacimiento, "Fecha obligatoria");
        hasError = true;
    }
    if(!pais.value){
        showError(pais, "Selecciona un país");
        hasError = true;
    } else if(pais.value === "Otros" && !letrasRegex.test(otrosPais.value.trim())){
        showError(otrosPais, "Nombre de país inválido");
        hasError = true;
    }
    if(!password.value.trim() || !passwordRegex.test(password.value.trim())){
        showError(password, "Contraseña inválida");
        hasError = true;
    }
    if(password.value !== password2.value){
        showError(password2, "Las contraseñas no coinciden");
        hasError = true;
    }

    if(!hasError){
        // Guardar usuario en localStorage
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        // Verificar si email ya existe
        if(usuarios.some(u => u.email === email.value.trim())){
            alert("❌ Este correo ya está registrado");
            return;
        }

        const usuario = {
            nombre: nombre.value.trim(),
            apellido: apellido.value.trim(),
            email: email.value.trim(),
            fechaNacimiento: fechaNacimiento.value,
            pais: pais.value === "Otros" ? otrosPais.value.trim() : pais.value,
            password: password.value
        };

        usuarios.push(usuario);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        alert("✅ Registro exitoso");
        window.location.href = "login.html";
    }
});