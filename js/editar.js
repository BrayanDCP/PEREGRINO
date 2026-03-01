// =======================================
// editar.js - Conectar con dashboard.js
// =======================================

// Cargar pagos desde localStorage
let pagos = JSON.parse(localStorage.getItem("pagos")) || [];

// Obtener índice de la deuda a editar
const editarIndice = localStorage.getItem("editarIndice");
if (editarIndice === null) {
    alert("❌ No se encontró deuda para editar");
    window.location.href = "dashboard.html";
}

// Obtener referencia al pago
let pago = pagos[editarIndice];

// ===========================
// Referencias a inputs del formulario
// ===========================
const form = document.getElementById("editarForm");
const bancoInput = document.getElementById("banco");
const conceptoInput = document.getElementById("concepto");
const montoTotalInput = document.getElementById("monto_total");
const cuotasInput = document.getElementById("cuotas");
const montoCuotaInput = document.getElementById("monto_cuota");
const fechaInicioInput = document.getElementById("fecha_inicio");
const fechaFinInput = document.getElementById("fecha_fin");
const montoFaltanteInput = document.getElementById("monto_faltante");

// ===========================
// Llenar formulario con datos existentes
// ===========================
bancoInput.value = pago.banco;
conceptoInput.value = pago.concepto;
montoTotalInput.value = pago.monto_total;
cuotasInput.value = pago.cuotas;
montoCuotaInput.value = pago.monto_cuota;
fechaInicioInput.value = pago.fecha_inicio;
fechaFinInput.value = pago.fecha_fin;
montoFaltanteInput.value = pago.monto_faltante;

// ===========================
// Calcular fecha fin automáticamente según fecha inicio y cuotas
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
// Mostrar errores debajo de inputs
// ===========================
function mostrarError(inputId, mensaje) {
    const input = document.getElementById(inputId);
    const errorElem = input.nextElementSibling;
    if (errorElem && errorElem.classList.contains("error-message")) {
        errorElem.textContent = mensaje;
    }
}

function limpiarErrores() {
    document.querySelectorAll(".error-message").forEach(e => e.textContent = "");
}

// ===========================
// Validar formulario antes de guardar
// ===========================
function validarFormulario() {
    limpiarErrores();
    let valido = true;

    if (!bancoInput.value.trim()) { mostrarError("banco", "Ingrese el banco o institución"); valido = false; }
    if (!conceptoInput.value.trim()) { mostrarError("concepto", "Ingrese un concepto o deuda"); valido = false; }

    const montoTotal = parseFloat(montoTotalInput.value);
    const cuotas = parseInt(cuotasInput.value);
    const montoCuota = parseFloat(montoCuotaInput.value);

    if (isNaN(montoTotal) || montoTotal <= 0) { mostrarError("monto_total", "Monto total inválido"); valido = false; }
    if (isNaN(cuotas) || cuotas <= 0 || cuotas > 60) { mostrarError("cuotas", "Número de cuotas inválido (1-60)"); valido = false; }
    if (isNaN(montoCuota) || montoCuota <= 0) { mostrarError("monto_cuota", "Monto por cuota inválido"); valido = false; }
    else if (montoCuota * cuotas < montoTotal) {
        mostrarError("monto_cuota", `Monto por cuota insuficiente para cubrir la deuda total (${montoTotal})`);
        valido = false;
    }

    if (!fechaInicioInput.value) { mostrarError("fecha_inicio", "Seleccione fecha de inicio"); valido = false; }
    if (!fechaFinInput.value) { mostrarError("fecha_fin", "Fecha de fin no válida"); valido = false; }

    return valido;
}

// ===========================
// Guardar cambios al enviar formulario
// ===========================
form.addEventListener("submit", function(e) {
    e.preventDefault();

    if (!validarFormulario()) return;

    // Actualizar datos del pago
    pago.banco = bancoInput.value.trim();
    pago.concepto = conceptoInput.value.trim();
    pago.monto_total = parseFloat(montoTotalInput.value);
    pago.cuotas = parseInt(cuotasInput.value);
    pago.monto_cuota = parseFloat(montoCuotaInput.value);

    // Recalcular monto faltante si excede el monto total
    if (pago.monto_faltante > pago.monto_total) pago.monto_faltante = pago.monto_total;

    pago.fecha_inicio = fechaInicioInput.value;
    pago.fecha_fin = fechaFinInput.value;

    // Guardar cambios en localStorage
    pagos[editarIndice] = pago;
    localStorage.setItem("pagos", JSON.stringify(pagos));

    alert("✅ Deuda actualizada correctamente");
    window.location.href = "dashboard.html";
});