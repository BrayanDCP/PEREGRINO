// =======================================
// estadistica.js - Visualización de pagos con Chart.js
// Conectado con dashboard.js y localStorage
// =======================================

// Obtener pagos desde localStorage (siempre actualizados)
function obtenerPagos() {
    return JSON.parse(localStorage.getItem("pagos")) || [];
}

// ===========================
// Generar gráfico de estado de pagos
// ===========================
function generarGraficoEstado() {
    const pagos = obtenerPagos();
    const estados = { "Pagado": 0, "Pendiente": 0, "Retrasado": 0 };

    pagos.forEach(pago => {
        if (pago.monto_faltante <= 0) estados["Pagado"]++;
        else {
            const hoy = new Date().toISOString().split('T')[0];
            if (hoy > pago.fecha_fin) estados["Retrasado"]++;
            else estados["Pendiente"]++;
        }
    });

    const ctx = document.getElementById("estadoPagosChart").getContext("2d");
    return new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: Object.keys(estados),
            datasets: [{
                label: "Cantidad de Pagos",
                data: Object.values(estados),
                backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
                borderColor: "#fff",
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.raw} pagos` } }
            }
        }
    });
}

// ===========================
// Generar gráfico por banco / institución
// ===========================
function generarGraficoBanco() {
    const pagos = obtenerPagos();
    const bancos = {};

    pagos.forEach(pago => {
        if (!bancos[pago.banco]) bancos[pago.banco] = 0;
        bancos[pago.banco] += pago.monto_faltante;
    });

    const ctx = document.getElementById("bancoChart").getContext("2d");
    return new Chart(ctx, {
        type: "bar",
        data: {
            labels: Object.keys(bancos),
            datasets: [{
                label: "Monto Faltante por Banco",
                data: Object.values(bancos),
                backgroundColor: "#D4AF37"
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: ctx => `$${ctx.raw.toFixed(2)}` } }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: value => `$${value}` }
                }
            }
        }
    });
}

// ===========================
// Inicialización de gráficos
// ===========================
let chartEstado = null;
let chartBanco = null;

function inicializarEstadisticas() {
    if(chartEstado) chartEstado.destroy();
    if(chartBanco) chartBanco.destroy();

    chartEstado = generarGraficoEstado();
    chartBanco = generarGraficoBanco();
}

// ===========================
// Conectar con dashboard.js
// Actualizar gráficos cada vez que se carga la página
// ===========================
window.onload = function() {
    inicializarEstadisticas();

    // Opcional: actualizar dinámicamente si se vuelve de agregar/editar/eliminar
    window.addEventListener("storage", function() {
        inicializarEstadisticas();
    });
};