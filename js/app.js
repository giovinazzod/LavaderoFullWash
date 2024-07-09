const BASEURL = 'https://giovinazzod.pythonanywhere.com';

async function fetchData(url, method, data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : null, // Si hay datos, los convierte a JSON y los incluye en el cuerpo
    };
    try {
        const response = await fetch(url, options); // Realiza la petición fetch
        if (!response.ok) {
            throw new Error('Error: ${response.statusText}');
        }
        return await response.json(); // Devuelve la respuesta en formato JSON
    } catch (error) {
        console.error('Fetch error:', error);
        alert('An error occurred while fetching data. Please try again.');
    }
}

function buscarTurno() {
    const patente_vehiculo = document.getElementById('patente').value;
    if (patente_vehiculo.trim() === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Datos incompletos:',
            text: 'Por favor, ingrese una patente.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar',
        })
        return;
    }

    fetch(BASEURL + `/api/getTurnoByPatente/${patente_vehiculo}`)
        .then(response => response.json())
        .then(data => {

            if (data.length === 0) {
                alert("No se encontraron turnos para la patente ingresada.");
            } else {
                mostrarTurnos(data);
            }
        })
        .catch(error => {
            console.error("Error al buscar el turno:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error al buscar el turno.',
                text: 'Por favor, intente nuevamente.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar',
            })
        });
}

function mostrarTurnos(turnos) {
    const tbody = document.getElementById('tbody-table');
    tbody.innerHTML = ""; // Limpiar la tabla

    // Convertir el objeto a un array
    if (!Array.isArray(turnos)) {
        turnos = [turnos];
    }

    turnos.forEach(turno => {

        if (turno.message) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 9; // Ajusta esto según la cantidad de columnas en tu tabla
            td.textContent = 'No se encontraron registros';
            tr.appendChild(td);
            tbody.appendChild(tr);

        } else {
            const tr = document.createElement('tr');

            tr.innerHTML = `
            <td>${turno.fecha}</td>
            <td>${turno.hora}</td>
            <td>${turno.patente_vehiculo}</td>
            <td>${turno.nombre_persona}</td>
            <td>${turno.telefono_persona}</td>
            <td>${turno.mail_persona}</td>
            <td>${turno.servicio_descripcion}</td>
            <td>${turno.servicio_costo}</td>
            <td>
                <a href="#" onclick="editarTurno(this, ${turno.id})" title="Editar">
                    <i class="fas fa-edit fa-lg" style="color: #011638;"></i>
                </a>
                <a href="#" onclick="eliminarTurno(${turno.id})" title="Eliminar">
                    <i class="fas fa-trash-alt fa-lg" style="color: #011638;"></i>
                </a>
            </td>
            `;
            tbody.appendChild(tr);
        }
    });
}

function updateTurnoTest(id) {
    let turnos = JSON.parse(localStorage.getItem('turnos'));
    //se utiliza el metodo find para poder asegurarnos que exista un turno con el id que queremos editar.
    let turnoAActualizar = turnos.find(turno => turno.id === id);
    if (turnoAActualizar) {
        //Se buscan los elementos HTML del input
        const inputNombre = document.getElementById('nombre_persona').value.trim();
        const inputTelefono = document.getElementById('telefono_persona').value.trim();
        const inputPatente = document.getElementById('patente').value.trim();
        const inputMail = document.getElementById('mail_persona').value.trim();
        const inputFecha = document.getElementById('fecha').value;
        const inputHora = document.getElementById('hora').value;
        const inputServicio = document.querySelector('input[name="option"]:checked').nextSibling.textContent.split(' - ')[0];

        //Se cargan los inputs con los valores del turno encontrado
        inputId.value = turnoAActualizar.id;
        inputTitle.value = turnoAActualizar.title;
        inputDirector.value = turnoAActualizar.director;
        inputRating.value = turnoAActualizar.rating;
        inputReleaseDate.value = turnoAActualizar.releaseDate;
        inputBanner.value = turnoAActualizar.banner;
    }
}

function eliminarTurno(id) {
    Swal.fire({
        icon: 'warning',
        title: '¿Está seguro de eliminar el turno?',
        text: 'Esta acción no se puede deshacer',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        showCancelButton: true,
        cancelButtonColor: '#3085d6',
        cancelButtonText: "Cancelar",
    }).then(async (result) => {
        if (result.isConfirmed) {
            let response = await fetchData(`${BASEURL}/api/deleteTurno/${id}`, 'DELETE');
            showMovies();
            Swal.fire(response.message, "Turno eliminado", "success");
        }
    });
}

function crearTurno() {
    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const patente = document.getElementById('patente').value.trim();
    const email = document.getElementById('email').value.trim();
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    let servicio_descripcion = "";
    let servicio_costo = "";

    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
        const label = selectedOption.nextElementSibling.textContent;
        const [servicio, costo] = label.split(' - ');

        servicio_descripcion = servicio.trim();
        servicio_costo = costo.replace('$', '').replace('.', '').trim();

    }

    const data = {
        nombre_persona: nombre,
        telefono_persona: telefono,
        patente_vehiculo: patente,
        mail_persona: email,
        fecha: fecha,
        hora: hora,
        servicio_descripcion: servicio_descripcion,
        servicio_costo: servicio_costo
    };

    fetch(BASEURL + '/api/crearTurno', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: '¡Formulario recibido!',
                text: 'Gracias por agendar tu turno.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar',
            })
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error al crear el turno',
                text: 'Por favor, intente nuevamente',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar',
            })
        });
}

function editarTurno(button, id) {
    // Obtengo la fila de la tabla del botón "Modificar" seleccionado
    var row = button.parentNode.parentNode;
    var cells = row.getElementsByTagName("td");

    // Obtengo los datos de la fila
    var fecha = cells[0].innerText;
    var hora = cells[1].innerText;
    var patente = cells[2].innerText;
    var nombre = cells[3].innerText;
    var telefono = cells[4].innerText;
    var email = cells[5].innerText;
    var servicio = cells[6].innerText;

    // Cargamos los datos en el formulario del modal
    document.getElementById("fecha").value = fecha;
    document.getElementById("hora").value = hora;
    document.getElementById("patente").value = patente;
    document.getElementById("nombre").value = nombre;
    document.getElementById("telefono").value = telefono;
    document.getElementById("email").value = email;

    // Seleccionamos el servicio correspondiente
    var servicios = document.getElementsByName("option");
    for (var i = 0; i < servicios.length; i++) {
        if (servicios[i].nextSibling.nodeValue.trim() === servicio) {
            servicios[i].checked = true;
            break;
        }
    }

    // Almacenamos el ID del turno en el botón "Guardar cambios"
    var btnGuardar = document.getElementById("btn-guardar");
    btnGuardar.setAttribute("data-id", id);

    // Mostramos el modal
    var myModal = new bootstrap.Modal(document.getElementById('modalEditarTurno'), {
        keyboard: false
    });
    myModal.show();
}

function guardarCambiosTest() {

    // Obtenemos los valores del formulario del modal
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const patente = document.getElementById('patente').value;
    const email = document.getElementById('email').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    let servicio_descripcion = "";
    let servicio_costo = "";

    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
        const label = selectedOption.nextElementSibling.textContent;
        const [servicio, costo] = label.split(' - ');

        servicio_descripcion = servicio.trim();
        servicio_costo = costo.replace('$', '').replace('.', '').trim();

    }

    const data = {
        nombre_persona: nombre,
        telefono_persona: telefono,
        patente_vehiculo: patente,
        mail_persona: email,
        fecha: fecha,
        hora: hora,
        servicio_descripcion: servicio_descripcion,
        servicio_costo: servicio_costo
    };

    fetch(BASEURL + '/api/crearTurno', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: '¡Formulario recibido!',
                text: 'Gracias por agendar tu turno.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar',
            })
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error al crear el turno',
                text: 'Por favor, intente nuevamente',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar',
            })
        });

    // Cerrar el modal después de guardar los cambios
    var myModal = document.getElementById('modalEditarTurno');
    var modal = bootstrap.Modal.getInstance(myModal);
    modal.hide();
}

function guardarCambios() {
    var id = document.getElementById("btn-guardar").getAttribute("data-id");

    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const patente = document.getElementById('patente').value.trim();
    const email = document.getElementById('email').value.trim();
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    let servicio_descripcion_value = "";
    let servicio_costo_value = "";

    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
        const label = selectedOption.nextElementSibling.textContent;
        const [servicio, costo] = label.split(' - ');

        servicio_descripcion_value = servicio.trim();
        servicio_costo_value = costo.replace('$', '').replace('.', '').trim();

    }

    const data = {
        nombre_persona: nombre,
        telefono_persona: telefono,
        patente_vehiculo: patente,
        mail_persona: email,
        fecha: fecha,
        hora: hora,
        servicio_descripcion: servicio_descripcion_value,
        servicio_costo: servicio_costo_value
    };

    fetch(BASEURL + '/api/modificarTurno/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: '¡Formulario recibido!',
                text: 'Gracias por agendar tu turno.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar',
            })
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error al crear el turno',
                text: 'Por favor, intente nuevamente',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar',
            })
        });
}