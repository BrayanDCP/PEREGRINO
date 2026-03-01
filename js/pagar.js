// =======================================
// pagar.js - Conectado con dashboard.js
// =======================================

// Cargar pagos desde localStorage
let pagos = JSON.parse(localStorage.getItem("pagos")) || [];

// Obtener índice de la deuda a pagar
const pagarIndice = localStorage.getItem("pagarIndice");
if (pagarIndice === null || pagarIndice >= pagos.length) {
    alert("❌ No se encontró deuda para pagar");
    window.location.href = "dashboard.html";
}

// Referencias a inputs y elementos
const bancoInput = document.getElementById("banco");
const conceptoInput = document.getElementById("concepto");
const montoFaltanteInput = document.getElementById("monto_faltante");
const montoPagoInput = document.getElementById("monto_pago");
const errorMontoPago = document.getElementById("errorMontoPago");
const form = document.getElementById("pagarForm");

// Obtener deuda
let pago = pagos[pagarIndice];

// Mostrar datos en la pantalla
bancoInput.value = pago.banco;
conceptoInput.value = pago.concepto;
montoFaltanteInput.value = `$${pago.monto_faltante.toFixed(2)}`;

// ===========================
// Validación y registro de pago
// ===========================
form.addEventListener("submit", function(e) {
    e.preventDefault();
    errorMontoPago.textContent = "";

    let monto = parseFloat(montoPagoInput.value);
    if (isNaN(monto) || monto <= 0) {
        errorMontoPago.textContent = "Ingrese un monto válido mayor a 0";
        return;
    }

    if (monto > pago.monto_faltante) {
        errorMontoPago.textContent = `El monto excede el faltante ($${pago.monto_faltante.toFixed(2)})`;
        return;
    }

    // Registrar pago
    pago.monto_faltante -= monto;
    pago.monto_faltante = parseFloat(pago.monto_faltante.toFixed(2));

    // Actualizar estado automáticamente
    if (pago.monto_faltante <= 0) {
        pago.estado = "Pagado";
    } else {
        const hoy = new Date().toISOString().split('T')[0];
        pago.estado = hoy > pago.fecha_fin ? "Retrasado" : "Pendiente";
    }

    // Guardar cambios
    pagos[pagarIndice] = pago;
    localStorage.setItem("pagos", JSON.stringify(pagos));

    // Mensajes motivacionales
    const mensajesMotivacion = [
        "¡Sigue así, tu responsabilidad te acerca a tus metas!",
        "Excelente, cada pago puntual mejora tu score financiero",
        "¡Vamos, otro paso hacia tu libertad financiera!"
    ];
    const msg = mensajesMotivacion[Math.floor(Math.random() * mensajesMotivacion.length)];

    alert(`✅ Pago registrado correctamente!\n${msg}`);

    // Redirigir al dashboard y refrescar tabla automáticamente
    window.location.href = "dashboard.html";
});