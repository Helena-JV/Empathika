// DESPLAZAMIENTO DEL PERSONAJE PRINCIPAL ===============================================================

//VARIABLES -----------------------------------------------------------------------
const personaje_principal = document.querySelector("#personaje-principal-container");
const personaje_principal_img = document.querySelector("#personaje-principal-container img");
let desplazamientoActual;

//BORRAR LA ANIMACIÓN DESPUÉS DE EJECUTARSE ----------------------------------------
const distanciaIzda = getComputedStyle(document.documentElement).getPropertyValue('--distancia-personaje-izda').trim();
const valorNum = parseFloat(distanciaIzda); //3
const distanciaIzdaPx = (window.innerWidth * valorNum) / 100; //px equivalente

personaje_principal.addEventListener("animationend", () => {
    personaje_principal.style.animation = "none";
    personaje_principal.style.transform = `translateX(${distanciaIzdaPx}px)`; 
    desplazamientoActual = distanciaIzdaPx; 
});

//MOVER EL PERSONAJE SOLO SI NO HACES CLICK SOBRE UN ELEMENTO CON LA CLASE HUD--------
addEventListener("click", (event) => {
    if (event.target.classList.contains('hud')) {
        return;
    }

    //CONSTANTES DEL PERSONAJE ---------------------------------------------------------
    const personajeRect = personaje_principal.getBoundingClientRect();
    const personajeX = personajeRect.left + personajeRect.width / 2;

    let destinoX = event.clientX;

    //CLICK EN OBJETO CON LA CLASE TARGET ----------------------------------------------
    if (event.target.classList.contains("target")) {
        const targetRect = event.target.getBoundingClientRect();

        if (personajeX < targetRect.left) {
            destinoX = targetRect.left - personajeRect.width / 2;
        } else {
            destinoX = targetRect.right + personajeRect.width / 2;
        }
    }

    //CLICK EN OBJETO CON LA CLASE USABLE -----------------------------------------------
    
    //MOVER EL PERSONAJE A LA POSICIÓN FINAL--------------------------------------------
    const diferencia = destinoX - personajeX;
    desplazamientoActual += diferencia;

    personaje_principal.style.transform = `translateX(${desplazamientoActual}px)`;

    if (diferencia > 0) {
        personaje_principal_img.classList.remove("personaje-principal-flip");
    } else {
        personaje_principal_img.classList.add("personaje-principal-flip");
    }
});
