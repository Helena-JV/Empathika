// DESPLAZAMIENTO DEL PERSONAJE PRINCIPAL ===============================================================

//VARIABLES -----------------------------------------------------------------------
const personaje_principal = document.querySelector("#protagonista-container");
const personaje_principal_img = document.querySelector("#protagonista-container img");
const generalWrapperContainer = document.querySelector("#general-wrapper");

//DISTANCIA INICIAL -----------------------------------------------------------------------
const distanciaIzdaPorcentaje = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--distancia-personaje-izda'));
const OFFSET_PORCENTAJE = 3; // Offset fijo del 3%

//BORRAR LA ANIMACIÓN DESPUÉS DE EJECUTARSE ----------------------------------------
personaje_principal.addEventListener("animationend", () => {
    personaje_principal.style.animation = "none";
    personaje_principal.style.left = `${distanciaIzdaPorcentaje}%`;
});

// MOVER EL PERSONAJE CON CLICK ----------------------------------------
    generalWrapperContainer.addEventListener("click", (event) => {
        
        //No hacer nada si se hace click en un elemento HUD
        if (event.target.classList.contains('hud')) {
            return;
        }
        
        //DIMENSIONES ACTUALIZADAS
        const generalWrapperRect = generalWrapperContainer.getBoundingClientRect();
        const personajeRect = personaje_principal.getBoundingClientRect();
        
        //POSICIÓN DEL CLICK RELATIVA AL CONTENEDOR
        let destinoX = event.clientX;
        
        //AJUSTAR EL DESTINO EN OBJETO TARGET
        if (event.target.classList.contains("target")) {
            const targetRect = event.target.getBoundingClientRect();
            const personajeCentroX = personajeRect.left + personajeRect.width / 2;
            
            const targetHalfWidthPorcentaje = (targetRect.width / 2 / generalWrapperRect.width) * 100; //Mitad del ancho del target en % del ancho del contenedor
            const distanciaPorcentaje = targetHalfWidthPorcentaje + OFFSET_PORCENTAJE; //Distancia total = mitad del ancho del target + offset fijo del 3%
            const distanciaPx = (distanciaPorcentaje * generalWrapperRect.width) / 100; //Convertir esta distancia de nuevo a px

            
            if (personajeCentroX < targetRect.left) {
                destinoX = targetRect.left - distanciaPx; //Posicionarse a la izda del target
            } else {
                destinoX = targetRect.right + distanciaPx; //Posicionarse a la dcha del target
            }
        }
        
        //MOVER EL PERSONAJE A SU POSICIÓN FINAL
        const clickXRelativo = destinoX - generalWrapperRect.left - (personajeRect.width / 2);
        let destinoPorcentaje = (clickXRelativo / generalWrapperRect.width) * 100;  //Convertir posición de destino de px a % 
        destinoPorcentaje = Math.max(0, Math.min(100 - (personajeRect.width / generalWrapperRect.width) * 100, destinoPorcentaje)); //Limitar el % para evitar que el protagonista se salga del contenedor
        personaje_principal.style.left = `${destinoPorcentaje}%`; //Nuevo desplazamiento con left
    

    //FLIP SEGÚN DIRECCIÓN ----------------------------------------
    const personajeCentroX = personajeRect.left + personajeRect.width / 2;
    if (destinoX > personajeCentroX) {
        personaje_principal_img.classList.remove("protagonista-flip");
    } else {
        personaje_principal_img.classList.add("protagonista-flip");
    }
});