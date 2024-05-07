let btnAgendar = document.querySelector("#btn-agendar");

let nombre = document.querySelector("#nombre");
let telefono = document.querySelector("#telefono");
let email = document.querySelector("#email");
let patente = document.querySelector("#patente");

function alertar(){
	if(nombre.value.trim()=='' || nombre.value.trim().length < 3 ){
        document.querySelector("#error-nombre").innerHTML ="Debes completar el campo nombre";
    }

    if(telefono.value.trim()=='' || telefono.value.trim().length < 3 ){
        document.querySelector("#error-telefono").innerHTML ="Debes completar el campo telefono";
    }

    if(email.value.trim()=='' || email.value.trim().length < 3 ){
        document.querySelector("#error-email").innerHTML ="Debes completar el campo email";
    }

    if(patente.value.trim()=='' || patente.value.trim().length < 3 ){
        document.querySelector("#error-patente").innerHTML ="Debes completar el campo patente";
    }
}