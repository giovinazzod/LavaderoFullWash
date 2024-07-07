const BASEURL = 'http://127.0.0.1:5000';

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

    //fetch(`http://127.0.0.1:5000/api/getTurnoByPatente/${patente_vehiculo}`)
    //fetchData(BASEURL + `/api/getTurnoByPatente/${patente_vehiculo}`, 'GET')
    fetch(`https://giovinazzod.pythonanywhere.com/api/getTurnoByPatente/${patente_vehiculo}`)
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

    // turnos = [
    //     {
    //       "fecha": "2023-09-26",
    //       "hora": "9:30:00",
    //       "id": 1,
    //       "mail_persona": "adunphy0@linkedin.com",
    //       "nombre_persona": "Archibald Dunphy",
    //       "patente_vehiculo": "BS755DT",
    //       "servicio_costo": "5000.00",
    //       "servicio_descripcion": "Limpieza Interior Express",
    //       "telefono_persona": "4425-8276"
    //     },
    //     {
    //       "fecha": "2024-01-08",
    //       "hora": "12:00:00",
    //       "id": 2,
    //       "mail_persona": "ahanburry1@timesonline.co.uk",
    //       "nombre_persona": "Armando Hanburry",
    //       "patente_vehiculo": "HY932VQ",
    //       "servicio_costo": "7500.00",
    //       "servicio_descripcion": "Limpieza Interior Full",
    //       "telefono_persona": "4812-6967"
    //     },
    //     {
    //       "fecha": "2023-08-11",
    //       "hora": "14:00:00",
    //       "id": 5,
    //       "mail_persona": "cfedorchenko4@answers.com",
    //       "nombre_persona": "Costa Fedorchenko",
    //       "patente_vehiculo": "RW135QJ",
    //       "servicio_costo": "6500.00",
    //       "servicio_descripcion": "Limpieza Exterior Express",
    //       "telefono_persona": "4614-5039"
    //     }
    //   ]

    turnos.forEach(turno => {
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
                <button onclick="editarTurno(${turno.id})">Editar</button>
                <button onclick="eliminarTurno(${turno.id})">Eliminar</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function editarTurno(id){
    let turnos = JSON.parse(localStorage.getItem('turnos'));
    //se utiliza el metodo find para poder asegurarnos que exista un turno con el id que queremos editar.
    let turnoAActualizar = turnos.find(turno => turno.patente===patente_vehiculo);
    if(turnoAActualizar){
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
    fetch(`/api/deleteTurno/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Turno eliminado con éxito.',
                    text: 'Gracias por agendar tu turno.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar',
                })

                alert("Turno eliminado con éxito.");
                buscarTurno(); // Refrescar la lista de turnos
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al eliminar el turno.',
                    text: 'Por favor, intente nuevamente.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar',
                })
            }
        })
        .catch(error => {
            console.error("Error al eliminar el turno:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error al eliminar el turno.',
                text: 'Por favor, intente nuevamente.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar',
            })
        });
}

function agendarTurno() {
    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const patente = document.getElementById('patente').value.trim();
    const email = document.getElementById('email').value.trim();
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const servicio = document.querySelector('input[name="option"]:checked').nextSibling.textContent.split(' - ')[0];
    const costo = document.querySelector('input[name="option"]:checked').nextSibling.textContent.split(' - ')[1].replace('$', '').trim();

    const data = {
        nombre: nombre,
        telefono: telefono,
        patente: patente,
        email: email,
        fecha: fecha,
        hora: hora,
        servicio: servicio,
        costo: costo
    };

    fetch('http://127.0.0.1:5000/api/createTurno', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al agendar el turno');
            }
            return response.json();
        })
        .then(data => {
            console.log('Turno creado correctamente:', data.message);
        })
        .catch(error => {
            console.error('Error al agendar el turno:', error);
        });
}