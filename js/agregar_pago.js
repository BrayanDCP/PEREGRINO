// ===========================================
// agregar_pago.js - Formulario de nueva deuda
// Integrado con dashboard.js
// ===========================================

// Elementos del formulario
const form = document.getElementById("formAgregarPago");
const fechaInicioInput = document.getElementById("fecha_inicio");
const cuotasInput = document.getElementById("cuotas");
const fechaFinInput = document.getElementById("fecha_fin");

// ===========================
// Calcular fecha fin automáticamente según número de cuotas
// ===========================
function calcularFechaFin() {
    const fechaInicio = new Date(fechaInicioInput.value);
    const cuotas = parseInt(cuotasInput.value);

    if (!isNaN(fechaInicio.getTime()) && !isNaN(cuotas) && cuotas > 0) {
        const fechaFin = new Date(fechaInicio);
        fechaFin.setMonth(fechaFin.getMonth() + cuotas);
        fechaFinInput.value = fechaFin.toISOString().split('T')[0];
    } else {
        fechaFinInput.value = "";
    }
}

fechaInicioInput.addEventListener("change", calcularFechaFin);
cuotasInput.addEventListener("input", calcularFechaFin);

// ===========================
// Mostrar y limpiar errores debajo de inputs
// ===========================
function mostrarError(inputId, mensaje) {
    const input = document.getElementById(inputId);
    let errorElem = input.nextElementSibling;

    if (!errorElem || !errorElem.classList.contains("error-message")) {
        errorElem = document.createElement("div");
        errorElem.className = "error-message text-danger small mt-1";
        input.insertAdjacentElement("afterend", errorElem);
    }

    errorElem.textContent = mensaje;
}

function limpiarErrores() {
    document.querySelectorAll(".error-message").forEach(e => e.remove());
}

// ===========================
// Manejar submit del formulario
// ===========================
form.addEventListener("submit", function(e) {
    e.preventDefault();
    limpiarErrores();

    // Obtener valores
    const banco = document.getElementById("banco").value.trim();
    const concepto = document.getElementById("concepto").value.trim();
    const monto_total = parseFloat(document.getElementById("monto_total").value);
    const cuotas = parseInt(document.getElementById("cuotas").value);
    const monto_cuota = parseFloat(document.getElementById("monto_cuota").value);
    const fecha_inicio = fechaInicioInput.value;
    const fecha_fin = fechaFinInput.value;

    let valid = true;

    // ===========================
    // Validaciones
    // ===========================
    if (!banco) { mostrarError("banco", "Ingrese el banco o institución"); valid = false; }
    if (!concepto) { mostrarError("concepto", "Ingrese un concepto o deuda"); valid = false; }
    if (isNaN(monto_total) || monto_total <= 0) { mostrarError("monto_total", "Monto total inválido"); valid = false; }
    if (isNaN(cuotas) || cuotas <= 0 || cuotas > 60) { mostrarError("cuotas", "Número de cuotas inválido (1-60)"); valid = false; }
    if (isNaN(monto_cuota) || monto_cuota <= 0) { 
        mostrarError("monto_cuota", "Monto por cuota inválido"); valid = false;
    } else if (monto_cuota * cuotas < monto_total) {
        mostrarError("monto_cuota", `Monto por cuota insuficiente para cubrir la deuda total (${monto_total.toFixed(2)})`);
        valid = false;
    }
    if (!fecha_inicio) { mostrarError("fecha_inicio", "Seleccione fecha de inicio"); valid = false; }
    if (!fecha_fin) { mostrarError("fecha_fin", "Fecha de fin no válida"); valid = false; }

    if (!valid) return;

    // ===========================
    // Inicializar monto faltante
    // ===========================
    const monto_faltante = monto_total;

    // ===========================
    // Guardar en localStorage
    // ===========================
    let pagos = JSON.parse(localStorage.getItem("pagos")) || [];
    pagos.push({
        banco,
        concepto,
        monto_total,
        cuotas,
        monto_cuota,
        monto_faltante,
        fecha_inicio,
        fecha_fin
    });

    localStorage.setItem("pagos", JSON.stringify(pagos));

    // ===========================
    // Mensaje de confirmación
    // ===========================
    alert(`✅ Deuda agregada correctamente!\nBanco: ${banco}\nConcepto: ${concepto}`);

    // Redirigir al dashboard
    window.location.href = "dashboard.html";
});