/*=================================================================================================================
BARBA JS
=================================================================================================================*/ 
    barba.use(barbaCss);

    barba.init({
        transitions: [{
            name: 'fade',
                to: {namespace: ['dialogo-inicial', 'pantalla-juego-1']},
                leave() {},
                enter() {}
        },
        //{
            // name: 'clip',
            //     //sync: true,
            //     to: {namespace: ['pantalla-juego-1']},
            //     leave() {},
            //     enter() {}
        //}
    ],

        views: [
            {
                namespace: 'dialogo-inicial',
                beforeEnter() {
                    dialogoArbol();
                },
            },{
                namespace: 'pantalla-juego-1',
                beforeEnter() {
                    movPersonaje();
                },
            },
        ],
    });



/*=================================================================================================================
DIALOGOS
=================================================================================================================*/ 

    // DIALOGO LUMO ===============================================================

        //ABRIR
        function abrirDialogo() {
            const dialogo = document.getElementById("dialogoLumo");
            dialogo.classList.toggle("dialog-close");
        }

        //CERRAR
        function dialogoLumo() {
            document.addEventListener("DOMContentLoaded", () => {
                const dialogo = document.getElementById("dialogoLumo");
                const botones = dialogo.querySelectorAll("button");

                botones.forEach(boton => {
                    boton.onclick = () => {
                        dialogo.close();
                    };
                });
            });
        }

    // SIGUIENTE DIÁLOGO ===============================================================

        //ÁRBOL ------------------------------------------------------------------------
            function dialogoArbol() {
                const bocadilloDilalogInit = document.getElementById("bocadilloDilalog");
                const dialogoArbolInit = document.getElementById("dialogoArbol");
                const dialogoArbolbtnFinal = document.getElementById("dialogoArbolbtnFinal");
                const nextBtn = document.querySelector('.next-btn');

                //FRASES
                    const frasesArbolInit =[
                        "¡Qué bien que has llegado! Te estábamos esperando. Estás en Empathika, el lugar en el que viven criaturas mágicas.",
                        "Pero algo ha pasado últimamente y el bosque está en peligro...",
                        "Sabemos que tienes un corazón bondadoso. Tu tarea será ayudar a los habitantes del bosque a sentirse mejor, y así, el bosque volverá a brillar.",
                        "Cada uno tiene un problema diferente, pero todos necesitan comprensión y apoyo.",
                        "¿Podrías ayudarnos a devolver el equilibrio al bosque?",
                    ];


                let indice = 0;
                dialogoArbolInit.innerHTML = frasesArbolInit[indice];

                //NAVEGACIÓN ENTRE FRASES
                nextBtn.addEventListener('click', () => {
                    indice++;
                    if (indice < frasesArbolInit.length) {
                        dialogoArbolInit.innerHTML = frasesArbolInit[indice];
                    } else {
                        //Ocultar botón de siguiente, mostrar botón final
                        nextBtn.style.display = "none";
                        dialogoArbolbtnFinal.style.display = "inline-block";
                    }
            });
            }



/*=================================================================================================================
MOVIMIENTO PERSONAJE PRINCIPAL
=================================================================================================================*/ 

    function movPersonaje(){
        //VARIABLES -----------------------------------------------------------------------
        const personaje_principal = document.querySelector("#protagonista-container");
        const personaje_principal_img = document.querySelector("#protagonista-container img");
        const generalWrapperContainer = document.querySelector(".general-wrapper");

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
    }


/*=================================================================================================================
DIALOGOS JUEGO
=================================================================================================================*/ 
//ABRIR
function abrirDialogo(selector) {
    const dialogo = document.querySelector(selector);
    if (dialogo) dialogo.classList.toggle("dialog-close");
} 

//CERRAR
function cerrarDialogo(selector) {
const dialogo = document.querySelector(selector);
if (dialogo) dialogo.classList.add("dialog-close");
}

//CERRAR SIN FONDO
function cerrarSiFondo(event, contenedor) {
if (event.target === contenedor) {
  contenedor.classList.add("dialog-close");
}
}
