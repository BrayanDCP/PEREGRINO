// ===========================
// cantidad_total.js - Resumen de pagos y totales
// ===========================

// Usamos la misma lista de pagos que dashboard.js
let pagos = JSON.parse(localStorage.getItem("pagos")) || [];

// ===========================
// Función para calcular totales
// ===========================
function calcularTotales() {
    let totalPagado = 0;
    let totalPendiente = 0;
    let totalGeneral = 0;

    pagos.forEach(pago => {
        totalGeneral += pago.monto_total;
        if (pago.monto_faltante <= 0) {
            totalPagado += pago.monto_total;
        } else {
            totalPendiente += pago.monto_faltante;
        }
    });

    return {
        pagado: totalPagado.toFixed(2),
        pendiente: totalPendiente.toFixed(2),
        total: totalGeneral.toFixed(2)
    };
}

// ===========================
// Función para mostrar totales en el HTML
// ===========================
function mostrarTotales() {
    const totales = calcularTotales();
    const contenedor = document.getElementById("resumenTotales");
    if (!contenedor) return;

    contenedor.innerHTML = `
        <div class="row text-center">
            <div class="col-md-4 mb-3">
                <div class="total-card p-3 rounded shadow">
                    <h4>Total Pagado</h4>
                    <p class="text-success fs-4">$${totales.pagado}</p>
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="total-card p-3 rounded shadow">
                    <h4>Total Pendiente</h4>
                    <p class="text-danger fs-4">$${totales.pendiente}</p>
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="total-card p-3 rounded shadow">
                    <h4>Total General</h4>
                    <p class="text-gold fs-4">$${totales.total}</p>
                </div>
            </div>
        </div>
    `;
}

// ===========================
// Conectar navbar desde dashboard.js
// ===========================
function conectarNavbarCantidadTotal() {
    if (typeof conectarNavbar === "function") {
        conectarNavbar();
    }
}

// ===========================
// Inicialización al cargar la página
// ===========================
window.onload = function() {
    // Cargar pagos desde localStorage
    pagos = JSON.parse(localStorage.getItem("pagos")) || [];

    mostrarTotales();
    conectarNavbarCantidadTotal();
};