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
                <a href="#" onclick="editarTurno(${turno.id})" title="Editar">
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

function editarTurno(id) {
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