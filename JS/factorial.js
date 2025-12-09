function calcularFactorial() {
    const input = document.getElementById("numero").value.trim();
    const mensaje = document.getElementById("mensaje");

    mensaje.innerHTML = "";

    // Validación
    const soloEnteros = /^\d+$/;

    if (!soloEnteros.test(input)) {
        mensaje.innerHTML = `
            <div class="alert alert-danger">
                 Error: Ingresa solo números enteros sin punto ni decimales.
            </div>
        `;
        return;
    }

    const numero = Number(input);

    // Cálculo factorial
    let factorial = 1;
    for (let i = 1; i <= numero; i++) {
        factorial *= i;
    }

    mensaje.innerHTML = `
        <div class="alert alert-success">
             El factorial de <strong>${numero}</strong> es <strong>${factorial}</strong>.
        </div>
    `;
}
