// ===========================
// notificaciones.js - Alertas dinámicas conectadas a dashboard.js
// ===========================

// Obtener pagos desde localStorage (dashboard.js también usa este array)
let pagos = JSON.parse(localStorage.getItem("pagos")) || [];

// Contenedor de notificaciones
const contenedor = document.getElementById("notificacionesContainer");

// Función para generar notificaciones
function generarNotificaciones() {
    contenedor.innerHTML = "";

    if (!pagos || pagos.length === 0) {
        contenedor.innerHTML = `<p class="text-center text-secondary">No hay deudas registradas</p>`;
        return;
    }

    const hoy = new Date();

    pagos.forEach((pago, index) => {
        // Determinar estado
        let estado = "";
        let mensaje = "";

        const fechaFin = new Date(pago.fecha_fin);
        const unDiaAntes = new Date(fechaFin); unDiaAntes.setDate(unDiaAntes.getDate() - 1);
        const unDiaDespues = new Date(fechaFin); unDiaDespues.setDate(unDiaDespues.getDate() + 1);

        const hoyStr = hoy.toISOString().split('T')[0];

        if (pago.monto_faltante <= 0) {
            estado = "pagado";
            mensaje = `✅ La deuda "${pago.concepto}" ya fue pagada.`;
        } else if (hoyStr === unDiaAntes.toISOString().split('T')[0]) {
            estado = "pendiente";
            mensaje = `⏰ Mañana vence la deuda "${pago.concepto}"`;
        } else if (hoyStr === fechaFin.toISOString().split('T')[0]) {
            estado = "pendiente";
            mensaje = `📅 Hoy vence la deuda "${pago.concepto}"`;
        } else if (hoyStr === unDiaDespues.toISOString().split('T')[0] || hoy > fechaFin) {
            estado = "retrasado";
            mensaje = `⚠️ Pago retrasado de "${pago.concepto}", paga cuanto antes`;
        } else {
            estado = "pendiente";
            mensaje = `🕒 Deuda pendiente: "${pago.concepto}"`;
        }

        // Crear notificación
        const div = document.createElement("div");
        div.className = `notification-item ${estado}`;
        div.innerHTML = `
            <span>${mensaje}</span>
            <button class="btn btn-sm btn-light ms-2 mark-read">✔️</button>
        `;

        // Evento para marcar como leída
        div.querySelector(".mark-read").addEventListener("click", () => {
            div.style.opacity = 0.5;
            div.querySelector(".mark-read").disabled = true;
        });

        contenedor.appendChild(div);
    });
}

// ===========================
// Inicialización al cargar
// ===========================
window.addEventListener("load", () => {
    generarNotificaciones();
});