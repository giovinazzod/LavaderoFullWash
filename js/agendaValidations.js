function validarNombre() {
    var nombreInput = document.getElementById("nombre");
    var errorNombre = document.getElementById("error-nombre");
    var nombre = nombreInput.value.trim();

    if (nombre.length < 3 || nombre.length > 45) {
        errorNombre.textContent = "* Ingrese un nombre válido (entre 3 y 45 caracteres)";
        return false;
    } else {
        errorNombre.textContent = "";
        return true;
    }
}

function validarTelefono() {
    var telefonoInput = document.getElementById("telefono");
    var errorTelefono = document.getElementById("error-telefono");
    var telefono = telefonoInput.value.trim();
    // var telRegex = /^\d{8,11}$/

    if (!(/^\d{8,11}$/.test(telefono))) { // if (!(telRegex.test(telefono)))
        errorTelefono.textContent = "* Ingrese un teléfono válido (entre 8 y 11 dígitos)";
        return false;
    } else {
        errorTelefono.textContent = "";
        return true;
    }
}

function validarEmail() {
    var emailInput = document.getElementById("email");
    var errorEmail = document.getElementById("error-email");
    var email = emailInput.value.trim();

    var emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;

    if (!emailRegex.test(email)) {
        errorEmail.textContent = "* Ingrese un email válido (usuario@email.com)";
        return false;
    } else {
        errorEmail.textContent = "";
        return true;
    }
}

function validarPatente() {
    var patenteInput = document.getElementById("patente");
    var errorPatente = document.getElementById("error-patente");
    var patente = patenteInput.value.trim();

    var patenteViejaRegex = /^[a-zA-Z]{3}[\d]{3}$/;
    var patenteNuevaRegex = /^[a-zA-Z]{2}[\d]{3}[a-zA-Z]{2}$/;

    if (!patenteViejaRegex.test(patente) && !patenteNuevaRegex.test(patente)) {
        errorPatente.textContent = "* Ingrese una patente válida (Formatos: AAA123 o AA123BB)";
        return false;
    } else {
        errorPatente.textContent = "";
        return true;
    }
}

function validarFechaYHora() {
    var fechaInput = document.getElementById("fecha");
    var horaInput = document.getElementById("hora");
    var errorFechaHora = document.getElementById("error-fecha-hora");

    console.log("fecha/Hora: ", fecha, hora);

    var fecha = fechaInput.value.trim();
    var hora = horaInput.value.trim();
    var ahora = new Date();

    if (fecha === "" || hora === "") {
        errorFechaHora.textContent = "* Por favor, seleccione fecha y hora";
        return false;
    }
    if (fecha < ahora) {
        errorFechaHora.textContent = "* Por favor, seleccione una fecha y hora futuros";
        return false;
    }
    else {
        errorFechaHora.textContent = "";
        return true;
    }

}

function validarServicio() {
    var opciones = document.querySelectorAll('input[type="radio"][name="option"]');
    var errorServicio = document.getElementById("error-servicioElegido");
    var seleccionada = false;

    opciones.forEach(function (opcion) {
        if (opcion.checked) {
            seleccionada = true;
        }
    });

    if (!seleccionada) {
        errorServicio.textContent = "* Por favor, seleccione un servicio";
        return false;
    } else {
        errorServicio.textContent = "";
        return true;
    }
}

function validarFormulario() {
    var nombreValido = validarNombre();
    var telefonoValido = validarTelefono();
    var emailValido = validarEmail();
    var patenteValida = validarPatente();
    var servicioValido = validarServicio();
    var fechaHoraValida = validarFechaYHora();

    // Si todas las validaciones pasan ok, devuelve true
    return nombreValido && telefonoValido && emailValido && patenteValida && servicioValido && fechaHoraValida;
}
// alertar
function agendarTurno() {
    if (validarFormulario()) {
        Swal.fire({
            icon: 'success',
            title: '¡Formulario recibido!',
            text: 'Gracias por agendar tu turno.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar',
        }).then((result) => {
            if (result.isConfirmed) {
                // Restablezco valores de los campos
                document.getElementById("nombre").value = "";
                document.getElementById("telefono").value = "";
                document.getElementById("email").value = "";
                document.getElementById("patente").value = "";
                document.getElementById("fecha").value = "";
                document.getElementById("hora").value = "";

                var opciones = document.querySelectorAll('input[type="radio"][name="option"]');
                opciones.forEach(function (opcion) {
                    opcion.checked = false;
                });
            };
        });
    }
}
