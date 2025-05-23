/*=================================================================================================================
BARBA JS
=================================================================================================================*/ 
    barba.use(barbaCss);

    barba.init({
        transitions: [{
            name: 'fade',
            to: {namespace: ['dialogo-inicial', 'pantalla-final-exito', 'index']},
            leave() {},
            enter() {}
        }, 
        {
            name: 'empujar',
            to: {namespace: ['pantalla-juego-1', 'pantalla-juego-2', 'pantalla-juego-3', 'pantalla-juego-4']},
            leave() {},

            enter({ next }) {
                return new Promise((resolve) => {
                const el = next.container;
                void el.offsetWidth; // Fuerza reflow

                // Esperar 100 ms antes de resolver (puedes ajustar este valor)
                setTimeout(() => {
                    resolve();
                }, 1000);
                });
            },

            sync: true,
            
            beforeLeave(data) {
                // Determinar la dirección de la transición
                const currentNamespace = data.current.namespace;
                const nextNamespace = data.next.namespace;

                // Extraer los números de pantalla
                const numActual = parseInt(currentNamespace.match(/\d+/)?.[0]);
                const numSiguiente = parseInt(nextNamespace.match(/\d+/)?.[0]);
                
                // Si vamos de pantalla2 a pantalla1, invertir la animación
                if (!isNaN(numActual) && !isNaN(numSiguiente)) {
                    if (numSiguiente < numActual) {
                        // Navegación hacia atrás
                        document.body.classList.add('reverse-transition');
                    } else {
                        // Navegación hacia adelante
                        document.body.classList.remove('reverse-transition');
                    }
                }
            }
        }
    ],

        // CARGAR JS EN LA TRANSICIÓN ---------------------------
        views: [
            {
                namespace: 'index',
                beforeEnter() {
                    ocultarHud();
                },
            },
            {
                namespace: 'dialogo-inicial',
                beforeEnter() {
                    dialogoArbol();
                    ocultarHud();
                },
            },{
                namespace: 'pantalla-juego-1',
                beforeEnter() {
                    setearPantallaJuego();
                },
                afterEnter() {
                    setearPantallaJuego();
                }
            },{
                namespace: 'pantalla-juego-2',
                beforeEnter() {
                    setearPantallaJuego();
                    torreConstruida(); 
                },
                afterEnter() {
                    setearPantallaJuego();
                }
            },
            {
                namespace: 'pantalla-juego-3',
                beforeEnter() {
                    setearPantallaJuego();
                    ImgTikiFeliz();
                },
                afterEnter() {
                    setearPantallaJuego();
                }
            },
            {
                namespace: 'pantalla-juego-4', //Final arbol
                beforeEnter() {
                    setearPantallaJuego();
                    dialogoFinal();
                },
                afterEnter() {
                    setearPantallaJuego();
                }
            },{
                namespace: 'pantalla-final-exito',
                beforeEnter() {
                    crecerPlantas();
                    ocultarHud();
                },
            },
        ],
    });

    // CARGAR JS SI SE RECARGA LA PÁGINA ---------------------------
    document.addEventListener('DOMContentLoaded', () => {
        const namespace = document.body.getAttribute('data-barba-namespace');
      
        if (namespace === 'dialogo-inicial') {
          dialogoArbol();
        } else if (namespace === 'pantalla-juego-1'||namespace === 'pantalla-juego-2'||namespace === 'pantalla-juego-3'||namespace === 'pantalla-juego-4') {
            setearPantallaJuego();
        } else if (namespace === 'pantalla-final-exito') {
            crecerPlantas();
          } 
      });



/*=================================================================================================================
OBTENER NÚMERO DE LA PANTALLA
=================================================================================================================*/ 
function obtenerNumeroPantalla() {
    const ruta = window.location.pathname;
    const partesRuta = ruta.split("/");
    const nombreArchivo = partesRuta.pop();
    const coincidencias = nombreArchivo.match(/\d+/);
    
    let numeroActual = 0;
    if (coincidencias) {
        numeroActual = parseInt(coincidencias[0]);
    }
    
    return numeroActual;
};



/*=================================================================================================================
SETEAR JUEGO
=================================================================================================================*/ 
function setearPantallaJuego(){
    movPersonaje();
    mostrarHud();
    resetearFlechas();
    EstadoJuego.setearPuntos();
    EstadoJuego.cargarPuntos();
    EstadoJuego.cargarEstadoPiedra();
    EstadoJuego.cargarEstadoPumpum();
    EstadoJuego.cargarEstadoTiki();
};

/*=================================================================================================================
ESTADO DEL JUEGO
=================================================================================================================*/ 
const MaxEstrellas = 3;
const EstadoJuego = {
    // ESTADO INICIAL ------------------------------------------------
    puntos: EstadoDesdeStorage('puntos', 0, parseInt),
    estadoPiedra: EstadoDesdeStorage('estadoPiedra', 'nada', (v) => v),
    estadoPumpum: EstadoDesdeStorage('estadoPumpum', 'nada', (v) => v),
    estadoTiki: EstadoDesdeStorage('estadoTiki', 'nada', (v) => v),

    // PUNTOS ------------------------------------------------
    setearPuntos() {
        sessionStorage.setItem('puntos', this.puntos.toString());
        const puntosActuales = document.querySelector('.puntos');
        if (puntosActuales) puntosActuales.textContent = this.puntos;
    },

    cargarPuntos() {
        this.puntos = EstadoDesdeStorage('puntos', 0, parseInt);
        this.setearPuntos();
    },

    // ESTADOS DE PIEDRA ----------------------------------------------
    setearEstadoPiedra() {
        sessionStorage.setItem('estadoPiedra', this.estadoPiedra);
    },

    cargarEstadoPiedra() {
        this.estadoPiedra = EstadoDesdeStorage('estadoPiedra', 'nada', (v) => v);
        
        if (this.estadoPiedra === 'encontrada') {
            const objPiedra = document.querySelector('.objPiedraBrillante');
            objPiedra.classList.remove('oculto');
        }
    },

    // ESTADO PUMPUM ----------------------------------------------
    setearEstadoPumpum() {
        sessionStorage.setItem('estadoPumpum', this.estadoPumpum);
    },

    cargarEstadoPumpum() {
        this.estadoPumpum = EstadoDesdeStorage('estadoPumpum', 'nada', (v) => v);
    },

    // ESTADO TIKI ----------------------------------------------
    setearEstadoTiki() {
        sessionStorage.setItem('estadoTiki', this.estadoTiki);
    },

    cargarEstadoTiki() {
        this.estadoTiki = EstadoDesdeStorage('estadoTiki', 'nada', (v) => v);
    },
};

// FUNCIONES AUXILIARES -----------------------------------------
    function EstadoDesdeStorage(clave, valorPorDefecto, parser) {
        const guardado = sessionStorage.getItem(clave);
        return guardado !== null ? parser(guardado) : valorPorDefecto;
    }

    //Convertir string en booleano
    function parseBool(valor) {
        return valor === 'true';
    }

/*=================================================================================================================
LIMPIAR JUEGO
=================================================================================================================*/ 
function limpiarSeteoJuego(){
    EstadoJuego.puntos = 0;
    EstadoJuego.setearPuntos();  
    EstadoJuego.estadoPiedra = 'nada';
    EstadoJuego.setearEstadoPiedra(); 
    EstadoJuego.estadoPumpum = 'nada';
    EstadoJuego.setearEstadoPumpum();
    EstadoJuego.estadoTiki = 'nada';
         EstadoJuego.setearEstadoTiki();
};

/*=================================================================================================================
HUD
=================================================================================================================*/ 
function ocultarHud() {
    const hudSuperior = document.querySelector('.hud-superior');
    const hudInferior = document.querySelector('.hud-inferior');

    if (!hudSuperior.classList.contains('oculto')){
        hudSuperior.classList.add('oculto');
        hudInferior.classList.add('oculto');
    }
}

function mostrarHud() {
    //Aquí se añadirá una constante y el inner text de los puntos que tiene la estrella
    const hudSuperior = document.querySelector('.hud-superior');
    const hudInferior = document.querySelector('.hud-inferior');

    if (hudSuperior.classList.contains('oculto')){
        hudSuperior.classList.remove('oculto');
        hudInferior.classList.remove('oculto');
    }
}

//MOVERSE FLECHAS -----------------------------------------------------------------------
    function resetearFlechas() {
        const flechaIzda = document.querySelector(".flecha-izda");
        const flechaDcha = document.querySelector(".flecha-dcha");
        
        const numeroActual = obtenerNumeroPantalla();
        
        // Si el número se ha encontrado correctamente
        if (!isNaN(numeroActual)) {
            const anterior = numeroActual - 1;
            const siguiente = numeroActual + 1;
            
            // Asignar nuevos hrefs
            if (flechaIzda) flechaIzda.href = `./pantalla${anterior}.html`;
            if (flechaDcha) flechaDcha.href = `./pantalla${siguiente}.html`;
        }
        
        // VISIBILIDAD FLECHAS ____________________________
        if (flechaIzda) {
            flechaIzda.style.visibility = numeroActual === 1 ? 'hidden' : 'visible';
        }
        if (flechaDcha) {
            flechaDcha.style.visibility = numeroActual === (MaxEstrellas + 1) ? 'hidden' : 'visible';
        }
    }
    
/*=================================================================================================================
BOCADILLO DE DIÁLOGO
================================================================================================================*/

function mostrarBocadillo(selector) {
    const elemento = document.querySelector(selector);
    if (!elemento) return;
  
    // Mostrar el bocadillo con animación
    elemento.style.pointerEvents = "auto";
  
    gsap.fromTo(
      elemento,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
    );
  
    // Añadir manejador de clic global una vez
    document.addEventListener("click", cerrarSiClickFuera);
  
    // Evitar propagación del clic original
    const personaje = document.querySelector('.target');
    personaje.addEventListener('click', function(event) {
      event.stopPropagation(); // Evita que el clic en el personaje dispare el cierre
    });
  
    elemento.addEventListener('click', function(event) {
      event.stopPropagation(); // Evita que el clic en el bocadillo dispare el cierre
    });
  }
  
  function cerrarSiClickFuera(event) {
    const bocadillo = document.querySelector('.btn-hablar');
    if (!bocadillo) return;
  
    // Ocultar el bocadillo solo si el clic no fue sobre él ni sobre el personaje
    if (!event.target.closest('.btn-hablar') && !event.target.closest('.target')) {
      gsap.to(bocadillo, {
        opacity: 0,
        scale: 0,
        duration: 0.4,
        ease: "back.in(1.7)",
        onComplete: () => {
          bocadillo.style.pointerEvents = "none";
        }
      });
  
      // Eliminar el listener para evitar múltiples añadidos
      document.removeEventListener("click", cerrarSiClickFuera);
    }
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
    // Eliminar el event listener anterior si existe
    const oldClickHandler = generalWrapperContainer._clickHandler;
    if (oldClickHandler) {
        generalWrapperContainer.removeEventListener("click", oldClickHandler);
    }

    // Crear el nuevo handler
    const clickHandler = (event) => {
        //No hacer nada si se hace click en un elemento HUD
        if (event.target.classList.contains('hud')) {
            return;
        }

        // Verificar si el click fue en un elemento .target o en un hijo de un elemento .target
        const targetElement = event.target.closest('.target');
        
        //DIMENSIONES ACTUALIZADAS
        const generalWrapperRect = generalWrapperContainer.getBoundingClientRect();
        const personajeRect = personaje_principal.getBoundingClientRect();
        
        //POSICIÓN DEL CLICK RELATIVA AL CONTENEDOR
        let destinoX = event.clientX;
        
        //AJUSTAR EL DESTINO EN OBJETO TARGET
        if (targetElement) {
            const targetRect = targetElement.getBoundingClientRect();
            const personajeCentroX = personajeRect.left + personajeRect.width / 2;
            
            const targetHalfWidthPorcentaje = (targetRect.width / 2 / generalWrapperRect.width) * 30; //Mitad del ancho del target en % del ancho del contenedor
            const distanciaPorcentaje = targetHalfWidthPorcentaje + OFFSET_PORCENTAJE; //Distancia total = mitad del ancho del target + offset fijo del 3%
            const distanciaPx = (distanciaPorcentaje * generalWrapperRect.width) / 100; //Convertir esta distancia de nuevo a px

            if (personajeCentroX < targetRect.left) {
                destinoX = targetRect.left - distanciaPx; //Posicionarse a la izda del target
            } else {
                destinoX = targetRect.right + distanciaPx; //Posicionarse a la dcha del target
            }

            // En lugar de detener la propagación, usamos un pequeño delay para permitir que mostrarBocadillo se ejecute
            setTimeout(() => {
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
            }, 50);
        } else {
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
        }
    };

    // Guardar referencia al handler y añadir el nuevo
    generalWrapperContainer._clickHandler = clickHandler;
    generalWrapperContainer.addEventListener("click", clickHandler, true); // Usar capture phase
};


/*=================================================================================================================
MODAL
=================================================================================================================*/ 
function abrirModal(selector) {
    const modal = document.querySelector(selector);
    modal.classList.toggle('display-none');
  }
  
  function cerrarModalFondo(event, modal) {
    if (event.target === modal) {
      modal.classList.add('display-none');
    }
  }


/*=================================================================================================================
DIALOGOS EXTERNOS
=================================================================================================================*/ 

    // ARBOL ===============================================================
    function dialogoArbol() {
        const dialogoArbolInit = document.getElementById("dialogoArbol");
        const dialogoArbolbtnFinal = document.getElementById("dialogoArbolbtnFinal");
        const nextBtn = document.querySelector('.btn-dialog-init .next-btn');
        const prevBtn = document.querySelector('.btn-dialog-init .prev-btn');
    
        const frasesArbolInit = [
            "¡Qué bien que has llegado! Te estábamos esperando. Estás en Empathika, el lugar en el que viven criaturas mágicas.",
            "Pero algo ha pasado últimamente y el bosque está en peligro...",
            "Sabemos que tienes un corazón bondadoso. Tu tarea será ayudar a los habitantes del bosque a sentirse mejor, y así, el bosque volverá a brillar.",
            "Cada uno tiene un problema diferente, pero todos necesitan comprensión y apoyo.",
            "¿Podrías ayudarnos a devolver el equilibrio al bosque?", 
        ];
        let indice = 0;
        dialogoArbolInit.innerHTML = frasesArbolInit[indice];
    
        if (prevBtn) {
            prevBtn.style.visibility = "hidden";
            prevBtn.style.pointerEvents = "none";
        }
    
        function actualizarDialogo() {
            dialogoArbolInit.innerHTML = frasesArbolInit[indice];
            dialogoArbolInit.classList.remove('ultima-frase'); 
    
            if (indice === 0 && prevBtn) {
                prevBtn.style.visibility = "hidden";
                prevBtn.style.pointerEvents = "none";
            } else if (prevBtn) {
                prevBtn.style.visibility = "visible";
                prevBtn.style.pointerEvents = "auto";
            }
    
            if (indice === frasesArbolInit.length - 1) {
                if (nextBtn) {
                    nextBtn.style.visibility = "hidden";
                    nextBtn.style.pointerEvents = "none";
                }
                if (dialogoArbolbtnFinal) {
                    dialogoArbolbtnFinal.style.display = "inline-block";
                }
                dialogoArbolInit.classList.add('ultima-frase');
            } else if (nextBtn) {
                nextBtn.style.visibility = "visible";
                nextBtn.style.pointerEvents = "auto";
                if (dialogoArbolbtnFinal) {
                    dialogoArbolbtnFinal.style.display = "none";
                }
            }
        }
    
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                indice--;
                if (indice < 0) {
                    indice = 0;
                }
                actualizarDialogo();
            });
        }
    
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                indice++;
                if (indice >= frasesArbolInit.length) {
                    indice = frasesArbolInit.length - 1;
                }
                actualizarDialogo();
            });
        }
    }


/*=================================================================================================================
DIALOGOS JUEGO GENERAL
=================================================================================================================*/ 

    //ABRIR ----------------------------------------------------
    function abrirDialogo(selector) {
        //SITUACIONES AVANCE LUMO -----------------------------

        if (selector === "#dialogoLumo") {
            dialogoLumoExito();
            dialogoLumoTenerPiedra();
            dialogoLumoBuscando();
        }

        if (selector === '#dialogoPumpum') {
              dialogoPumpumExito();    
        }

        if (selector === '#dialogoTiki') {
            dialogoTikiExito();    
      }

        //-------------------------------------------------
        
        const dialogo = document.querySelector(selector);
        if (dialogo) {
            dialogo.classList.toggle("dialog-close");
            
        
            // ANIMACIÓN TEXTO DIÁLOGO 
            let contenidoDialogo;
            const dialogoTxtElement = dialogo.querySelector('.dialogo-txt');
            if (dialogoTxtElement && dialogoTxtElement.children && dialogoTxtElement.children.length > 0) {
                contenidoDialogo = dialogoTxtElement.children;
            } else {
                const dialogContainerElement = dialogo.querySelector('.dialog-container');
                if (dialogContainerElement && dialogContainerElement.children && dialogContainerElement.children.length > 0) {
                    contenidoDialogo = dialogContainerElement.children;
                } else {
                    contenidoDialogo = dialogo.querySelectorAll('p');
                }
            }
        
            if (contenidoDialogo && contenidoDialogo.length > 0) {
                gsap.fromTo(
                    contenidoDialogo,
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }
                );
            }
        
            // ANIMAR BOTONES DE RESPUESTA 
            let botonesDialogo;
            const dialogBtnsContainerElement = dialogo.querySelector('.dialog-btns-container');
            if (dialogBtnsContainerElement && dialogBtnsContainerElement.children && dialogBtnsContainerElement.children.length > 0) {
                botonesDialogo = dialogBtnsContainerElement.children;
            } else {
                botonesDialogo = dialogo.querySelectorAll('button');
            }
        
            if (botonesDialogo && botonesDialogo.length > 0) {
                for (let i = 0; i < botonesDialogo.length; i++) {
                    botonesDialogo[i].style.opacity = 0;
                }
        
                gsap.fromTo(
                    botonesDialogo,
                    { opacity: 0 },
                    { opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.3, delay: 0.3 }
                );
            }
        }
    } 

    //CERRAR ----------------------------------------------------
    function cerrarDialogo(selector) {
        const dialogo = document.querySelector(selector);
        if (dialogo) dialogo.classList.add("dialog-close");
    }

    //CERRAR SIN FONDO ----------------------------------------------------
    function cerrarSiFondo(event, contenedor) {
        if (event.target === contenedor) {
        contenedor.classList.add("dialog-close");
        }
    }

    //CREAR BOTON EN DIÁLOGO ----------------------------------------------------
	function crearBoton(texto, onClick) {
		const boton = document.createElement('button');
		boton.classList.add('hud');
		boton.textContent = texto;
		boton.onclick = onClick;
		return boton;
	}


/*=================================================================================================================
DIALOGOS LUMO
=================================================================================================================*/ 
//DIÁLOGO LUMO FINAL ------------------------------------------------------------
function dialogoLumoExito() {
    if (EstadoJuego.estadoPiedra === 'entregada') {

        const dialogoContenidoElement = document.getElementById('dialog-lumo-content');
        const dialogoBotonesElement = document.getElementById('dialog-lumo-btns');
    
        dialogoContenidoElement.innerHTML = '';
        dialogoBotonesElement.innerHTML = '';
    
        //Respuesta
        dialogoContenidoElement.innerHTML = '<p class="hud">¡Gracias por ayudarnos!</p><p class="hud">Ahora Floris tiene su piedra.</p>';
    
        //Botón
        const btnSeguir = crearBoton("Veré si puedo ayudar a alguien más.", function() {
            cerrarDialogo('#dialogoLumo'); 
        }); dialogoBotonesElement.appendChild(btnSeguir);
        
    }
}

//DIÁLOGO LUMO PIEDRA ENCONTRADA ------------------------------------------------------------
function dialogoLumoTenerPiedra() {
    if (EstadoJuego.estadoPiedra === 'encontrada') {
        const dialogoContenidoElement = document.getElementById('dialog-lumo-content');
        const dialogoBotonesElement = document.getElementById('dialog-lumo-btns');
    
        dialogoContenidoElement.innerHTML = '';
        dialogoBotonesElement.innerHTML = '';
    
        //Respuesta
        dialogoContenidoElement.innerHTML = '<p class="hud">¡Oh! Has encontrado la piedra. ¡Muchísimas gracias!</p><div><p class="hud">Has conseguido una <img class="estrellatxt" src="./assets/img/hud/star.svg" alt="Estrella"></p></div>';
    
        //Botón
        const btnSeguir = crearBoton("¡Genial!", function() {
            cerrarDialogo('#dialogoLumo'); 
        }); dialogoBotonesElement.appendChild(btnSeguir);

        //Nuevo estado
        EstadoJuego.estadoPiedra = 'entregada';
        EstadoJuego.setearEstadoPiedra();

        //SETEAR PUNTOS _____________________________
        EstadoJuego.puntos = EstadoJuego.puntos + 1;
        EstadoJuego.setearPuntos();   

        //QUITAR OBJ USABLE PIEDRA_______________________
        const objPiedra = document.querySelector('.objPiedraBrillante');
        objPiedra.classList.add('oculto');
    }
}

// CLICK EN ARBUSTO ---------------------------------------------------------------------
function sacarPiedra() {
    if(EstadoJuego.estadoPiedra === 'buscando') {
        const piedraBrillante = document.getElementById('piedraBrillanteArbusto');
        piedraBrillante.classList.add('popObjetoMostrar');
        piedraBrillante.classList.remove('popObjetoOcultar');
    }
}

function cogerPiedra(Piedra) {
    Piedra.classList.add('popObjetoOcultar');
    Piedra.classList.remove('popObjetoMostrar');

    //USABLE PIEDRA BRILLANTE
    const objPiedra = document.querySelector('.objPiedraBrillante');
    objPiedra.classList.remove('oculto');
    void objPiedra.offsetWidth;
    objPiedra.classList.add('anim-aparecer');

    //NUEVO ESTADO
    EstadoJuego.estadoPiedra = 'encontrada';
    EstadoJuego.setearEstadoPiedra();
}

//DIÁLOGO LUMO BUSCAR PIEDRA ------------------------------------------------------------
function dialogoLumoBuscando() {
    if (EstadoJuego.estadoPiedra === 'buscando') {
        const dialogoContenidoElement = document.getElementById('dialog-lumo-content');
        const dialogoBotonesElement = document.getElementById('dialog-lumo-btns');
    
        dialogoContenidoElement.innerHTML = '';
        dialogoBotonesElement.innerHTML = '';
    
        //Respuesta
        dialogoContenidoElement.innerHTML = '<p class="hud">¿Has visto la piedra brillante de Floris?</p><p class="hud">Haz click entre las plantas.</p>';
    
        //Botón
        const btnSeguir = crearBoton("¡Sigo buscando!", function() {
            cerrarDialogo('#dialogoLumo'); 
        }); dialogoBotonesElement.appendChild(btnSeguir);
    }
}

//DIÁLOGO INICIAL LUMO ------------------------------------------------------------
function gestionarRespuestaLumo(respuesta) {
    const personajeQueHabla = document.querySelector(".img-personaje");
    const nombrePersonaje = document.querySelector(".nombre-personaje");

    const dialogoContenidoElement = document.getElementById('dialog-lumo-content');
    const dialogoBotonesElement = document.getElementById('dialog-lumo-btns');

    dialogoContenidoElement.innerHTML = '';
    dialogoBotonesElement.innerHTML = '';

        //RESPUESTA: BUSCAR JUNTOS ----------------------------------------------------------------
        if (respuesta === 'buscar') {
            buscarJuntos();


        //RESPUESTA: DECIRSELO ----------------------------------------------------------------
        } else if (respuesta === 'decir') {
            //Parrafo
            dialogoContenidoElement.innerHTML = '<p class="hud">Uf...</p><p class="hud">¿De verdad crees que no se enfadará?</p>';

            //Botones
                //RESPUESTA 1 ____________________________________
                const btnDecirselo = crearBoton("Si le dices la verdad, seguro que lo valora.", function() {
                    decirseloAFloris();
                }); dialogoBotonesElement.appendChild(btnDecirselo);

                //RESPUESTA 2 ____________________________________
                const btnPuedeEnfadarse = crearBoton("Puede enfadarse un poco, pero es lo correcto.", function() {
                    //Parrafo
                    dialogoContenidoElement.innerHTML = '<p class="hud">¡Ay no! Entonces mejor no le digo nada...</p>';
                    
                    //Botones
                    dialogoBotonesElement.innerHTML = ''; 
                        //RESPUESTA 2.1 ____________________________________
                        const btnDecirVerdad = crearBoton("Creo que deberías decirle la verdad.", function() {
                            decirseloAFloris();
                        });dialogoBotonesElement.appendChild(btnDecirVerdad);

                        //RESPUESTA 2.2 ____________________________________
                        const btnNoDecir = crearBoton("No digas nada, igual no se da cuenta.", function() {
                            gestionarRespuestaLumo('noDecir');
                        });dialogoBotonesElement.appendChild(btnNoDecir);
                        Animaciones.animarTexto(dialogoContenidoElement.children);
                        Animaciones.animarBotones(dialogoBotonesElement.children);

                }); dialogoBotonesElement.appendChild(btnPuedeEnfadarse);
                Animaciones.animarTexto(dialogoContenidoElement.children);
                Animaciones.animarBotones(dialogoBotonesElement.children);


        //RESPUESTA: NO DECIR NADA ----------------------------------------------------------------
        } else if (respuesta === 'noDecir') {

            //Parrafo
            dialogoContenidoElement.innerHTML = '<p class="hud">No sé… eso me hace sentir mal por dentro… ¿Qué otra cosa puedo hacer?</p>';

            //RESPUESTA 1 ____________________________________
                const btnDiselo = crearBoton("Díselo a Floris, seguro que lo entiende", function() {
                    decirseloAFloris();
                }); dialogoBotonesElement.appendChild(btnDiselo);

            //RESPUESTA 2 ____________________________________
                const btnBuscarJuntos = crearBoton("Vamos a buscarla juntos.", function() {
                    buscarJuntos();
                }); dialogoBotonesElement.appendChild(btnBuscarJuntos);
                Animaciones.animarTexto(dialogoContenidoElement.children);
                Animaciones.animarBotones(dialogoBotonesElement.children);
        };

        //SEGUIR: DECIRSELO A FLORIS ----------------------------------------------------------------
        function decirseloAFloris() {
            //Parrafo
            dialogoContenidoElement.innerHTML = '<p class="hud">Está bien. Se lo diré…</p><p class="hud">— ¡Floris!</p>';
            //Botones
            dialogoBotonesElement.innerHTML = '';
            const btnSeguir = crearBoton("A ver qué dice Floris.", function() {
                // DIALOGO CON FLORIS ________________________
                hablaFloris();
                dialogoContenidoElement.innerHTML = '<p class="hud">¡Hola, Lumo!</p><p class="hud">¿Has terminado de jugar con mi piedra?</p>';

                //SIGUIENTE 1
                dialogoBotonesElement.innerHTML = '';
                const btnSiguiente1 = crearBoton("Floris, Lumo tiene algo que contarte.", function() {
                    hablaLumo();
                    dialogoContenidoElement.innerHTML = '<p class="hud">Verás... lo siento mucho, pero estaba jugando con tu piedra y ahora no la encuentro.</p>';  
                    
                    //SIGUIENTE 2 
                    dialogoBotonesElement.innerHTML = '';
                    const btnSiguiente2 = crearBoton("Floris, ¿qué piensas?", function() {
                        hablaFloris();
                        dialogoContenidoElement.innerHTML = '<p class="hud">Oh, era mi piedra favorita.</p><p class="hud">Estoy un poco triste, pero gracias por decirme la verdad y disculparte.</p>';
                        
                        //SIGUIENTE 3
                        dialogoBotonesElement.innerHTML = '';
                        const btnSiguiente3 = crearBoton("¿Oye, y si buscamos la piedra?", function() {
                            hablaLumo();
                            dialogoContenidoElement.innerHTML = '<p class="hud">¡Qué gran idea!</p><p class="hud">No te preocupes, Floris, encontraremos tu piedra.</p>';  

                            //SIGUIENTE 4
                            dialogoBotonesElement.innerHTML = '';
                            const btnSiguiente4 = crearBoton("Yo te ayudo a buscarla.", function() {
                                buscarJuntos();
                            }); dialogoBotonesElement.appendChild(btnSiguiente4); 
                            Animaciones.animarTexto(dialogoContenidoElement.children);
                            Animaciones.animarBotones(dialogoBotonesElement.children);

                        }); dialogoBotonesElement.appendChild(btnSiguiente3); 
                        Animaciones.animarTexto(dialogoContenidoElement.children);
                         Animaciones.animarBotones(dialogoBotonesElement.children);

                    }); dialogoBotonesElement.appendChild(btnSiguiente2);
                    Animaciones.animarTexto(dialogoContenidoElement.children);
                    Animaciones.animarBotones(dialogoBotonesElement.children);

                }); dialogoBotonesElement.appendChild(btnSiguiente1); 
                Animaciones.animarTexto(dialogoContenidoElement.children);
                Animaciones.animarBotones(dialogoBotonesElement.children);

            }); dialogoBotonesElement.appendChild(btnSeguir);
            Animaciones.animarTexto(dialogoContenidoElement.children);
            Animaciones.animarBotones(dialogoBotonesElement.children);
        };

        //SEGUIR: BUSCAR JUNTOS ----------------------------------------------------------------
        function buscarJuntos() {
            //SETEAR BUSCAR PIEDRA _____________________________
            EstadoJuego.estadoPiedra = 'buscando';
            EstadoJuego.setearEstadoPiedra();

            //Parrafo
            dialogoContenidoElement.innerHTML = '<p class="hud">¡Gracias! Me siento mejor con ayuda.</p><p class="hud">Podemos buscarla entre las plantas del bosque.</p>';

            //Botones
            dialogoBotonesElement.innerHTML = '';
            const btnBuscar = crearBoton("¡Vale! Voy a ver si la encuentro", function() {
                cerrarDialogo('#dialogoLumo'); 
            }); dialogoBotonesElement.appendChild(btnBuscar);
            Animaciones.animarTexto(dialogoContenidoElement.children);
            Animaciones.animarBotones(dialogoBotonesElement.children);
        };

        //CAMBIAR DE PERSONAJE ----------------------------------------------------------------
        function hablaFloris() {
            personajeQueHabla.src = './assets/img/personajes/floris.svg';
            nombrePersonaje.textContent = 'Floris';
        }
        function hablaLumo() {
            personajeQueHabla.src = './assets/img/personajes/lumo.svg';
            nombrePersonaje.textContent = 'Lumo';
        } 
};

/*=================================================================================================================
DIALOGOS PUMPUM
=================================================================================================================*/ 
function torreConstruida() {
    if (EstadoJuego.estadoPumpum === 'final') {
        const imgTorreConstruida = document.querySelector('#pumpum-aqua-container .target');
        imgTorreConstruida.src = './assets/img/personajes/pumpum-aqua-torre-ok.svg';
    }
}
//DIÁLOGO PUMPUM FINAL ------------------------------------------------------------
function dialogoPumpumExito() {
    if (EstadoJuego.estadoPumpum === 'final') {

        const dialogoContenidoElement = document.getElementById('dialog-pumpum-content');
        const dialogoBotonesElement = document.getElementById('dialog-pumpum-btns');
    
        dialogoContenidoElement.innerHTML = '';
        dialogoBotonesElement.innerHTML = '';
    
        //Respuesta
        dialogoContenidoElement.innerHTML = '<p class="hud">¡Mira qué torre más chula tenemos ahora!</p><p class="hud">Trabajar en equipo y tener paciencia es la clave.</p>';
    
        //Botón
        const btnSeguir = crearBoton("Veré si puedo ayudar a alguien más.", function() {
            cerrarDialogo('#dialogoPumpum'); 
        });dialogoBotonesElement.appendChild(btnSeguir); 
    };
};

// GESTIONAR RESPUESTA PUMPUM -----------------------------------------------------------------------
function gestionarRespuestaPumpum() {
    const personajeQueHabla = document.querySelector(".img-personaje");
    const nombrePersonaje = document.querySelector(".nombre-personaje");

    const dialogoContenidoElement = document.getElementById('dialog-pumpum-content');
    const dialogoBotonesElement = document.getElementById('dialog-pumpum-btns');

    //DIALOGO 1 ------------------------------------------------------------------------
        //Parrafo
        dialogoContenidoElement.innerHTML = '<p class="hud">¡Déjame en paz! Sé cómo usar mi magia de crecimiento.</p><p class="hud">¡Va a ser la torre más alta del bosque!</p>';
        hablaPumPum();

        //Botones
        dialogoBotonesElement.innerHTML = '';
        const btnUsarMagia = crearBoton("¡Usa toda tu magia para que crezca altísima!", function() {
            usaTuMagia();
        }); dialogoBotonesElement.appendChild(btnUsarMagia);

        const btnDespacio = crearBoton("Si lo haces despacio, será más segura.", function() {
            tenCuidado();
        }); dialogoBotonesElement.appendChild(btnDespacio);

        Animaciones.animarTexto(dialogoContenidoElement.children);
        Animaciones.animarBotones(dialogoBotonesElement.children);
    

    //DIALOGO USA TU MAGIA ------------------------------------------------------------------------
    function usaTuMagia() {
        //Parrafo
        dialogoContenidoElement.innerHTML = '<p class="hud">Aqua, no te voy a escuchar.</p><p class="hud">¡Mira qué poderoso soy!</p>';
        
        //SIGUIENTE 1
        dialogoBotonesElement.innerHTML = '';
        const btnUsarMagia = crearBoton("¡Eso, eso!", function() {

            //SIGUIENTE 2
            dialogoContenidoElement.innerHTML = '<p class="hud">«Brrum ¡Plof!»</p><p class="hud">Oh no… se ha caído la torre.</p>';
            hablaAqua(); 
            dialogoBotonesElement.innerHTML = '';
            const btnOhNo = crearBoton("Oh no...", function() {

                //SIGUIENTE 3
                dialogoContenidoElement.innerHTML = '<p class="hud">¡Jope!</p><p class="hud">Con lo que me he esforzado en hacerla crecer…</p>';
                hablaPumPum();
                dialogoBotonesElement.innerHTML = '';
                const loSientoPumpum = crearBoton("Vaya, lo siento mucho, Pumpum", function() {

                    //SIGUIENTE 4
                    dialogoContenidoElement.innerHTML = '<p class="hud">¿Qué podemos hacer ahora para que no se vuelva a caer la torre?</p>';
                    dialogoBotonesElement.innerHTML = '';
                    const magiaCuidado = crearBoton("Usa tu magia con cuidado.", function() {
                        tenCuidado();
                    });dialogoBotonesElement.appendChild(magiaCuidado);

                    const noHagasCaso = crearBoton("No hagas caso, vuelve a hacerlo igual.", function() {
                        usaTuMagia();
                    });dialogoBotonesElement.appendChild(noHagasCaso);
                    Animaciones.animarTexto(dialogoContenidoElement.children);
                    Animaciones.animarBotones(dialogoBotonesElement.children);

                }); dialogoBotonesElement.appendChild(loSientoPumpum);
                Animaciones.animarTexto(dialogoContenidoElement.children);
                Animaciones.animarBotones(dialogoBotonesElement.children);
                
            }); dialogoBotonesElement.appendChild(btnOhNo);
            Animaciones.animarTexto(dialogoContenidoElement.children);
            Animaciones.animarBotones(dialogoBotonesElement.children);
            
        }); dialogoBotonesElement.appendChild(btnUsarMagia);
        Animaciones.animarTexto(dialogoContenidoElement.children);
        Animaciones.animarBotones(dialogoBotonesElement.children);
    };

    //DIALOGO TEN CUIDADO ------------------------------------------------------------------------
    function tenCuidado() {
        dialogoContenidoElement.innerHTML = '<p class="hud">Mmm... quizás tengáis razón.</p><p class="hud">A veces me emociono demasiado con mi magia.</p>';
        hablaPumPum();

        //SIGUIENTE 1
        dialogoBotonesElement.innerHTML = '';
        const trabajemosJuntos = crearBoton("¡Trabajemos juntos!", function() {
        
            //SIGUIENTE 2
            dialogoContenidoElement.innerHTML = '<p class="hud">¡Eso es!</p><p class="hud">Cuando trabajamos juntos y escuchamos los consejos de los demás, las cosas salen mejor.</p>';
            hablaAqua();
            dialogoBotonesElement.innerHTML = '';

            //Btn1
            const ramaSuelta = crearBoton("Mira, esa rama está suelta.", function() {
                dialogoPumpumFinal();
            });dialogoBotonesElement.appendChild(ramaSuelta);

            //Btn2
            const refuerzaBase = crearBoton("Refuerza la base.", function() {
                dialogoPumpumFinal();
            });dialogoBotonesElement.appendChild(refuerzaBase);
            Animaciones.animarTexto(dialogoContenidoElement.children);
            Animaciones.animarBotones(dialogoBotonesElement.children);
                    
        });dialogoBotonesElement.appendChild(trabajemosJuntos);
        Animaciones.animarTexto(dialogoContenidoElement.children);
        Animaciones.animarBotones(dialogoBotonesElement.children);
    };

    //DIALOGO FINAL ------------------------------------------------------------------------
    function dialogoPumpumFinal() {
        dialogoContenidoElement.innerHTML = '<p class="hud">¡Oh! No me había dado cuenta.</p><p class="hud">¡Gracias por avisarme! Mi entusiasmo a veces me hace olvidar los detalles.</p>';
        hablaPumPum();
        dialogoBotonesElement.innerHTML = '';
        const dialogFinalPumpum1 = crearBoton("Claro. Aquí estamos para ayudar.", function() {

            //SIGUIENTE 1
            dialogoContenidoElement.innerHTML = '<p class="hud">Una buena observación puede evitar muchos problemas, ¡bien hecho!</p>';
            hablaAqua();
            dialogoBotonesElement.innerHTML = '';
            const dialogFinalPumpum2 = crearBoton("¡Está quedando genial!", function() {

                //SIGUIENTE 2
                dialogoContenidoElement.innerHTML = '<p class="hud">¡Mira! Ahora es alta y segura. ¡La clave: colaboración y paciencia!</p><p class="hud">Has conseguido una <img class="estrellatxt" src="./assets/img/hud/star.svg" alt="Estrella"></p>';
                const imgTorreConstruida = document.querySelector('#pumpum-aqua-container .target');
                imgTorreConstruida.src = './assets/img/personajes/pumpum-aqua-torre-ok.svg';

                //Botón
                dialogoBotonesElement.innerHTML = '';
                const dialogFinalPumpum3 = crearBoton("¡Genial!", function() {
                    cerrarDialogo('#dialogoPumpum'); 
                }); dialogoBotonesElement.appendChild(dialogFinalPumpum3);
                Animaciones.animarTexto(dialogoContenidoElement.children);
                Animaciones.animarBotones(dialogoBotonesElement.children);

                //NUEVO ESTADO _____________________________
                EstadoJuego.estadoPumpum = 'final';
                EstadoJuego.setearEstadoPumpum();

                //SETEAR PUNTOS _____________________________
                EstadoJuego.puntos = EstadoJuego.puntos + 1;
                EstadoJuego.setearPuntos();   
    
            });dialogoBotonesElement.appendChild(dialogFinalPumpum2);
            Animaciones.animarTexto(dialogoContenidoElement.children);
        Animaciones.animarBotones(dialogoBotonesElement.children);

        });dialogoBotonesElement.appendChild(dialogFinalPumpum1);
        Animaciones.animarTexto(dialogoContenidoElement.children);
        Animaciones.animarBotones(dialogoBotonesElement.children);
    };  

    //CAMBIAR DE PERSONAJE ----------------------------------------------------------------
    function hablaAqua() {
        personajeQueHabla.src = './assets/img/personajes/aqua.svg';
        nombrePersonaje.textContent = 'Aqua';
    }
    function hablaPumPum() {
        personajeQueHabla.src = './assets/img/personajes/pumpum.svg';
        nombrePersonaje.textContent = 'Pumpum';
    }
};



/*=================================================================================================================
DIALOGOS TIKI
=================================================================================================================*/ 
function ImgTikiFeliz() {
    if (EstadoJuego.estadoTiki === 'final') {
        const imgTikiFeliz = document.getElementById('tiki-cuerpo');
        imgTikiFeliz.src = './assets/img/personajes/Tiki-cuerpo-feliz.svg';

        const tikiParaAnim = document.getElementById('tiki-img');
        tikiParaAnim.classList.add('tiki-anim');
    }
}
//DIÁLOGO TIKI FINAL ------------------------------------------------------------
function dialogoTikiExito() {
    if (EstadoJuego.estadoTiki === 'final') {
        const personajeQueHabla = document.querySelector(".img-personaje");
        personajeQueHabla.src = './assets/img/personajes/tiki-contento.svg';

        const dialogoContenidoElement = document.getElementById('dialog-tiki-content');
        const dialogoBotonesElement = document.getElementById('dialog-tiki-btns');
    
        dialogoContenidoElement.innerHTML = '';
        dialogoBotonesElement.innerHTML = '';
    
        //Respuesta
        dialogoContenidoElement.innerHTML = '<p class="hud">¡Gracias por ayudarme a superiar mis miedos!</p><p class="hud">Nada asusta mucho si lo afrontas poco a poco.</p>';
    
        //Botón
        const btnSeguirExitoTiki = crearBoton("Veré si puedo ayudar a alguien más.", function() {
            cerrarDialogo('#dialogoTiki'); 
        });dialogoBotonesElement.appendChild(btnSeguirExitoTiki); 
    };
};

// GESTIONAR RESPUESTA TIKI -----------------------------------------------------------------------
function gestionarRespuestaTiki(respuesta) {
    const personajeQueHabla = document.querySelector(".img-personaje");

    const dialogoContenidoElement = document.getElementById('dialog-tiki-content');
    const dialogoBotonesElement = document.getElementById('dialog-tiki-btns');

    //PREGUNTAR MIEDOS ------------------------------------------------------------------------
    if (respuesta === 'preguntarMiedos'){
        dialogoContenidoElement.innerHTML = '<p class="hud">Si intento volar seguro que me caigo.</p><p class="hud">No... no puedo hacerlo.</p>';

        //Botones
        dialogoBotonesElement.innerHTML = '';
        const btnCercaSuelo = crearBoton("Intenta volar primero cerca del suelo.", function() {
            cercaDelSuelo();
        }); dialogoBotonesElement.appendChild(btnCercaSuelo);

        const btnVerAlgo = crearBoton("¿No te gustaría ver algo desde el cielo?", function() {
            verCielo();
        }); dialogoBotonesElement.appendChild(btnVerAlgo);

        Animaciones.animarTexto(dialogoContenidoElement.children);
        Animaciones.animarBotones(dialogoBotonesElement.children);

    //INCREPAR ------------------------------------------------------------------------
    }else if (respuesta === 'increpar'){
        dialogoContenidoElement.innerHTML = '<p class="hud">¿Por qué me dices eso?</p><p class="hud">¡No es divertido! Da mucho miedo.</p>';

        //Botones
        dialogoBotonesElement.innerHTML = '';
        const btnDisculpa1 = crearBoton("Lo siento… no lo había pensado.", function() {
            postDisculpa();
        }); dialogoBotonesElement.appendChild(btnDisculpa1);

        const btnDisculpa2 = crearBoton("Tienes razón... No debería llamarte miedica.", function() {
            postDisculpa();
        }); dialogoBotonesElement.appendChild(btnDisculpa2);

        Animaciones.animarTexto(dialogoContenidoElement.children);
        Animaciones.animarBotones(dialogoBotonesElement.children);
    };

    //DIALOGO VOLAR CERCA DEL SUELO ------------------------------------------------------------------------
    function cercaDelSuelo() {
        //Parrafo
        dialogoContenidoElement.innerHTML = '<p class="hud">Bueno… podría probar despacito.</p><p class="hud">Eso no me da tanto miedo.</p>';
        
        //Botones
        dialogoBotonesElement.innerHTML = '';
        const btnIntentalo = crearBoton("¡Vamos, intentalo!", function() {
            intentarlo();
        }); dialogoBotonesElement.appendChild(btnIntentalo);

        const btnPocoAPoco = crearBoton("Sí. Hazlo poco a poco.", function() {
            intentarlo();
        }); dialogoBotonesElement.appendChild(btnPocoAPoco);

        Animaciones.animarTexto(dialogoContenidoElement.children);
        Animaciones.animarBotones(dialogoBotonesElement.children);
    };

    //DIALOGO VER DESDE EL CIELO ------------------------------------------------------------------------
    function verCielo() {

        //Parrafo
        dialogoContenidoElement.innerHTML = '<p class="hud">La verdad... siempre he querido ver el Lago Espejo desde arriba.</p><p class="hud">Dicen que se ve la forma de la luna reflejada incluso durante el día…</p>';

        //Botones
        dialogoBotonesElement.innerHTML = '';
        const btnIntentalo = crearBoton("Ve despacito y para si te asustas.", function() {
            cercaDelSuelo();
        }); dialogoBotonesElement.appendChild(btnIntentalo);

        const btnPocoAPoco = crearBoton("Vuela primero cerca del suelo.", function() {
            cercaDelSuelo();
        }); dialogoBotonesElement.appendChild(btnPocoAPoco);

        Animaciones.animarTexto(dialogoContenidoElement.children);
        Animaciones.animarBotones(dialogoBotonesElement.children);
    };

    //DIALOGO INTENTARLO ------------------------------------------------------------------------
    function intentarlo() {
        tikiFeliz();
        //Parrafo
        dialogoContenidoElement.innerHTML = '<p class="hud">¡Mira, lo estoy consiguiendo!</p><p class="hud">Lo he intentado poquito a poco y ahora creo que puedo subir más.</p>';
        
        //Botones
        dialogoBotonesElement.innerHTML = '';
        const btnIntentalo = crearBoton("Hazlo solo si estás a gusto haciéndolo.", function() {
            volarEstrella();
        }); dialogoBotonesElement.appendChild(btnIntentalo);

        const btnPocoAPoco = crearBoton("¡Tú puedes! Yo creo en ti.", function() {
            volarEstrella();
        }); dialogoBotonesElement.appendChild(btnPocoAPoco);

        Animaciones.animarTexto(dialogoContenidoElement.children);
        Animaciones.animarBotones(dialogoBotonesElement.children);
    };

    //DIALOGO VOLAR ESTRELLA ------------------------------------------------------------------------
    function volarEstrella() {
        //Parrafo
        dialogoContenidoElement.innerHTML = '<p class="hud">¡Mira, estoy subiendo! Ohhh. Se ve el Lago espejo. ¡Es precioso!</p><p class="hud">Has conseguido una <img class="estrellatxt" src="./assets/img/hud/star.svg" alt="Estrella"></p>';
        
        //Botones
        dialogoBotonesElement.innerHTML = '';
        const dialogFinalTiki = crearBoton("¡Genial!", function() {
            cerrarDialogo('#dialogoTiki'); 
        }); dialogoBotonesElement.appendChild(dialogFinalTiki);

        Animaciones.animarTexto(dialogoContenidoElement.children);
        Animaciones.animarBotones(dialogoBotonesElement.children);

         //NUEVO ESTADO _____________________________
         EstadoJuego.estadoTiki = 'final';
         EstadoJuego.setearEstadoTiki();
         ImgTikiFeliz();
 
         //SETEAR PUNTOS _____________________________
         EstadoJuego.puntos = EstadoJuego.puntos + 1;
         EstadoJuego.setearPuntos();  
    };

    //DIALOGO POST DISCULPA ------------------------------------------------------------------------
    function postDisculpa() {
        //Parrafo
        dialogoContenidoElement.innerHTML = '<p class="hud">Bueno… acepto tus disculpas.</p><p class="hud">Pero sigo teniendo mucho miedo a volar.</p>';
        
        //Botones
        dialogoBotonesElement.innerHTML = '';
        const btnIntentalo = crearBoton("Intenta volar primero cerca del suelo.", function() {
            cercaDelSuelo();
        }); dialogoBotonesElement.appendChild(btnIntentalo);

        const btnPocoAPoco = crearBoton("¿No te gustaría ver algo desde el cielo?", function() {
            verCielo();
        }); dialogoBotonesElement.appendChild(btnPocoAPoco);

        Animaciones.animarTexto(dialogoContenidoElement.children);
        Animaciones.animarBotones(dialogoBotonesElement.children);
       
    };

    //CAMBIAR DE PERSONAJE ----------------------------------------------------------------
    function tikiFeliz() {
        personajeQueHabla.src = './assets/img/personajes/tiki-contento.svg';
    }
}
    

/*=================================================================================================================
DIALOGO FINAL
=================================================================================================================*/ 
function dialogoFinal() {
    const puntosTexto = document.getElementById('puntos-arbol');
    puntosTexto.textContent = MaxEstrellas - EstadoJuego.puntos;

    if (EstadoJuego.puntos == MaxEstrellas) {
        const dialogoContenidoElement = document.getElementById('dialog-arbol-content');
        const dialogoBotonesElement = document.getElementById('dialog-arbol-btns');

        //Parrafo
        dialogoContenidoElement.innerHTML = '<p class="hud">¡Ho ho! Parece que has ayudado a mucha gente.</p><p class="hud">Entregame las estrellas y bosque volverá a brillar.</p>';
        
        //Botones
        dialogoBotonesElement.innerHTML = '';
        const btnIntentalo = crearBoton("Toma, te las doy.", function() {
            barba.go('pantalla-final-exito.html');
        }); dialogoBotonesElement.appendChild(btnIntentalo);

        Animaciones.animarTexto(dialogoContenidoElement.children);
        Animaciones.animarBotones(dialogoBotonesElement.children);
    };
}


/*=================================================================================================================
ANIMACIONES DIÁLOGOS
=================================================================================================================*/ 
const Animaciones = {
    // Animación para botones
    animarBotones: function(elementos) {
        gsap.fromTo(elementos,
            { opacity: 0 },
            { opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.3, delay: 0.1 }
        );
    },
    
    // Animación para contenido
    animarTexto: function(elementos) {
        gsap.fromTo(elementos, 
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }
        );
    }
};


/*=================================================================================================================
PANTALLA FINAL
=================================================================================================================*/ 
// ANIMACIÓN CRECIMIENTO PLANTAS ===========================================================
gsap.registerPlugin(DrawSVGPlugin);
function crecerPlantas() {
    let stagger_plantas = 0.2;
    let duracion_anim_hojas = 1;
    let duracion_anim_lineas = 3;
    
    // Animación de líneas
    gsap.fromTo(
        document.querySelectorAll(`#exito-plantagrow svg .plant1-linea`),
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: duracion_anim_lineas, ease: "power1.inOut" }
    );

    // Animación de hojas
    for (let j = 1; j <= 2; j++) {
        gsap.fromTo(
            document.querySelectorAll(`#exito-plantagrow .plant1-${j} .plant-1-hoja`),
            { scale: "0" },
            { scale: "1", duration: duracion_anim_hojas, ease: "power1.inOut", stagger: stagger_plantas }
        );
    }
   
    }