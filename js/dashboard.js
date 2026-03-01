// =======================================
// dashboard.js - Hub central de Peregrino
// Cards dinámicas para dashboard
// =======================================

// ===========================
// LocalStorage: Pagos y Usuario
// ===========================
let pagos = JSON.parse(localStorage.getItem("pagos")) || [];
let usuario = JSON.parse(localStorage.getItem("usuario")) || {
    nombre: "Juan Pérez",
    email: "juan.perez@email.com",
    telefono: "+34 600 123 456",
    fechaRegistro: new Date().toLocaleDateString()
};

// ===========================
// Mensajes motivacionales
// ===========================
const mensajesMotivacion = [
    "¡Sigue así, tu responsabilidad te acerca a tus metas!",
    "Excelente, cada pago puntual mejora tu score financiero",
    "¡Vamos, otro paso hacia tu libertad financiera!"
];

// ===========================
// Función para actualizar cards de pagos
// ===========================
function actualizarCards() {
    const lista = document.getElementById("listaPagos");
    if (!lista) return;

    lista.innerHTML = "";

    if (pagos.length === 0) {
        lista.innerHTML = `<div class="text-center text-gray w-100">No hay deudas registradas</div>`;
        return;
    }

    const hoyStr = new Date().toISOString().split('T')[0];

    pagos.forEach((pago, index) => {
        // Determinar estado
        if (pago.monto_faltante <= 0) {
            pago.estado = "Pagado";
        } else if (hoyStr > pago.fecha_fin) {
            pago.estado = "Retrasado";
        } else {
            pago.estado = "Pendiente";
        }

        // Progreso del pago
        const porcentajePagado = ((pago.monto_total - pago.monto_faltante) / pago.monto_total) * 100;

        // Colores según estado
        let estadoColor = "";
        if (pago.estado === "Pagado") estadoColor = "bg-success text-white";
        else if (pago.estado === "Retrasado") estadoColor = "bg-danger text-white";
        else estadoColor = "bg-warning text-dark";

        // Crear card
        const card = document.createElement("div");
        card.className = "card card-pago p-3 shadow-sm";

        card.innerHTML = `
            <h5 class="card-title fw-bold">${pago.concepto}</h5>
            <p class="card-subtitle mb-2 text-muted">${pago.banco}</p>
            <p class="mb-1">Monto Total: $${pago.monto_total.toFixed(2)}</p>
            <p class="mb-1">Monto Faltante: $${pago.monto_faltante.toFixed(2)}</p>
            <p class="mb-1">Cuotas: ${pago.cuotas} | Monto/Cuota: $${pago.monto_cuota.toFixed(2)}</p>
            <p class="mb-1">Inicio: ${pago.fecha_inicio} | Fin: ${pago.fecha_fin}</p>
            <div class="progress mb-2">
                <div class="progress-bar ${estadoColor}" role="progressbar" style="width: ${porcentajePagado}%;">
                    ${porcentajePagado.toFixed(0)}%
                </div>
            </div>
            <div class="d-flex justify-content-between">
                <button class="btn btn-success btn-sm" onclick="irAPagar(${index})">Pagar</button>
                <button class="btn btn-warning btn-sm" onclick="editar(${index})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarDeuda(${index})">Eliminar</button>
            </div>
        `;

        lista.appendChild(card);
    });

    localStorage.setItem("pagos", JSON.stringify(pagos));
}

// ===========================
// Funciones navegación y acciones
// ===========================
function irAPagar(index){
    localStorage.setItem("pagarIndice", index);
    window.location.href = "pagar.html";
}

function editar(index){
    localStorage.setItem("editarIndice", index);
    window.location.href = "editar.html";
}

function eliminarDeuda(index){
    if(confirm("¿Estás seguro de eliminar esta deuda?")){
        pagos.splice(index, 1);
        actualizarCards();
    }
}

// ===========================
// Mensaje motivacional
// ===========================
function mostrarMotivacion(){
    const cont = document.getElementById("mensajeMotivacional");
    if(cont && pagos.length > 0){
        const msg = mensajesMotivacion[Math.floor(Math.random() * mensajesMotivacion.length)];
        cont.textContent = msg;
    } else if(cont){
        cont.textContent = "No tienes deudas pendientes, ¡sigue así!";
    }
}

// ===========================
// Recordatorios automáticos
// ===========================
function checkRecordatorios(){
    const hoy = new Date();
    pagos.forEach(pago => {
        const fechaFin = new Date(pago.fecha_fin);
        const unDiaAntes = new Date(fechaFin); unDiaAntes.setDate(unDiaAntes.getDate() -1);
        const unDiaDespues = new Date(fechaFin); unDiaDespues.setDate(unDiaDespues.getDate() +1);

        const hoyStr = hoy.toISOString().split('T')[0];

        if(pago.estado === "Pendiente"){
            if(hoyStr === unDiaAntes.toISOString().split('T')[0]){
                console.log(`⏰ Recordatorio: Mañana vence el pago de ${pago.concepto}`);
            } else if(hoyStr === fechaFin.toISOString().split('T')[0]){
                console.log(`📅 Hoy vence el pago de ${pago.concepto}`);
            } else if(hoyStr === unDiaDespues.toISOString().split('T')[0]){
                console.log(`⚠️ Pago retrasado de ${pago.concepto}`);
            }
        }
    });
}

// ===========================
// Conectar Navbar a todas las páginas
// ===========================
function conectarNavbar(){
    const links = {
        "Perfil": "perfil.html",
        "Cantidad Total": "cantidad_total.html",
        "Estadísticas": "estadistica.html",
        "Notificaciones": "notificaciones.html",
        "Login": "login.html",
        "Register": "register.html",
        "Dashboard": "dashboard.html"
    };

    document.querySelectorAll(".nav-link").forEach(link=>{
        const text = link.textContent.trim();
        if(links[text]){
            link.addEventListener("click", ()=>{ window.location.href = links[text]; });
        }
    });
}

// ===========================
// Mostrar usuario en dashboard o navbar
// ===========================
function mostrarUsuarioDashboard(){
    const spanNombre = document.getElementById("dashboardUsuarioNombre");
    if(spanNombre){
        spanNombre.textContent = usuario.nombre;
    }
}

// ===========================
// Inicialización al cargar página
// ===========================
window.onload = function(){
    actualizarCards();
    mostrarMotivacion();
    checkRecordatorios();
    conectarNavbar();
    mostrarUsuarioDashboard();
};

// ===========================
// Función para eliminar deuda
// ===========================
function eliminarDeuda(index){
    // Guardamos el índice en localStorage
    localStorage.setItem("eliminarIndice", index);
    // Redirigimos a la página eliminar.html
    window.location.href = "eliminar.html";
}