function validarNombreYApellido() {
    var nombreInput = document.getElementById("nombreyapellido");
    var errorNombre = document.getElementById("error-nombreyapellido");
    var nombre = nombreInput.value.trim();

    if (nombre.length < 3 || nombre.length > 45) {
        errorNombre.textContent = "* Ingrese un nombre válido (entre 3 y 45 caracteres)";
        return false;
    } else {
        errorNombre.textContent = "";
        return true;
    }
}

function validarTelefonoConsulta() {
    var telefonoInput = document.getElementById("celular");
    var errorTelefono = document.getElementById("error-celular");
    var telefono = telefonoInput.value.trim();

    if (!(/^\d{8,11}$/.test(telefono))) {
        errorTelefono.textContent = "* Ingrese un celular válido (entre 8 y 11 dígitos)";
        return false;
    } else {
        errorTelefono.textContent = "";
        return true;
    }
}

function validarEmailConsulta() {
    var emailInput = document.getElementById("mail");
    var errorEmail = document.getElementById("error-mail");
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

function validarFormularioConsulta() {
    var nombreValido = validarNombreYApellido();
    var telefonoValido = validarTelefonoConsulta();
    var emailValido = validarEmailConsulta();

    // Si todas las validaciones pasan ok, devuelve true
    return nombreValido && telefonoValido && emailValido;
}

function consultar() {
    if (validarFormularioConsulta()) {
        Swal.fire({
            icon: 'success',
            title: '¡Consulta recibida!',
            text: 'A la brevedad nos contactaremos contigo.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar',
        }).then((result) => {
            if (result.isConfirmed) {
                // Restablezco valores de los campos
                document.getElementById("nombreyapellido").value = "";
                document.getElementById("celular").value = "";
                document.getElementById("mail").value = "";
                document.getElementById("asunto").value = "";
                document.getElementById("mensaje").value = "";
            };
        });
    }
}
