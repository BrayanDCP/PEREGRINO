// Mostrar / ocultar contraseña
document.querySelectorAll(".toggle-password").forEach(function(element){
    element.addEventListener("click", function(){
        const input = this.previousElementSibling;
        input.type = input.type === "password" ? "text" : "password";
    });
});

// Validación y eliminación
document.getElementById("eliminarForm").addEventListener("submit", function(e){
    e.preventDefault();

    const passwordInput = document.getElementById("passwordEliminar");
    const errorEl = passwordInput.nextElementSibling;

    errorEl.textContent = "";

    // Ejemplo: contraseña del usuario temporal
    const contraseñaUsuario = "123456Ab!"; // Aquí luego se toma de DB real

    if(!passwordInput.value.trim()){
        errorEl.textContent = "Debes ingresar tu contraseña";
        return;
    }

    if(passwordInput.value !== contraseñaUsuario){
        errorEl.textContent = "Contraseña incorrecta";
        return;
    }

    // Confirmación final
    if(confirm("¿Estás seguro de eliminar este pago? Esta acción no se puede deshacer.")){
        // Aquí eliminarías el pago de la DB o del array temporal
        alert("Pago eliminado correctamente");

        // Redirigir al dashboard
        window.location.href = "dashboard.html";
    }
});