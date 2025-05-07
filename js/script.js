/*=================================================================================================================
BARBA JS
=================================================================================================================*/ 
    barba.use(barbaCss);

    barba.init({
        transitions: [{
            name: 'fade',
            to: {namespace: ['dialogo-inicial']},
            leave() {},
            enter() {}
        }, 
        {
            name: 'empujar',
            to: {namespace: ['pantalla-juego-1', 'pantalla-juego-2', 'pantalla-juego-3']},
            leave() {},
            enter() {},
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
                    movPersonaje();
                    mostrarHud();
                    resetearFlechas();
                    EstadoJuego.setearPuntos();
                    EstadoJuego.cargarPuntos();
                    EstadoJuego.cargarEstadoPiedra();
                }
            },{
                namespace: 'pantalla-juego-2',
                beforeEnter() {
                    movPersonaje();
                    mostrarHud();
                    resetearFlechas();
                    EstadoJuego.setearPuntos();
                    EstadoJuego.cargarPuntos();
                    EstadoJuego.cargarEstadoPiedra();
                }
            },
            {
                namespace: 'pantalla-juego-3',
                beforeEnter() {
                    movPersonaje();
                    mostrarHud();
                    resetearFlechas();
                    EstadoJuego.setearPuntos();
                    EstadoJuego.cargarPuntos();
                    EstadoJuego.cargarEstadoPiedra();
                }
            }
        ],
    });

    // CARGAR JS SI SE RECARGA LA PÁGINA ---------------------------
    document.addEventListener('DOMContentLoaded', () => {
        const namespace = document.body.getAttribute('data-barba-namespace');
      
        if (namespace === 'dialogo-inicial') {
          dialogoArbol();
        } else if (namespace === 'pantalla-juego-1'||namespace === 'pantalla-juego-2'||namespace === 'pantalla-juego-3') {
            movPersonaje();
            mostrarHud();
            resetearFlechas();
            EstadoJuego.setearPuntos();
            EstadoJuego.cargarPuntos();
            EstadoJuego.cargarEstadoPiedra();
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
}

/*=================================================================================================================
ESTADO DEL JUEGO
=================================================================================================================*/ 
const EstadoJuego = {
    // ESTADO INICIAL ------------------------------------------------
    puntos: EstadoDesdeStorage('puntos', 0, parseInt),
    estadoPiedra: EstadoDesdeStorage('estadoPiedra', 'nada', (v) => v),

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
            flechaDcha.style.visibility = numeroActual === 3 ? 'hidden' : 'visible';
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

        //SITUACIONES AVANCE -----------------------------
        dialogoLumoExito();
        dialogoLumoTenerPiedra();
        dialogoLumoBuscando();

        //-------------------------------------------------
        
        const dialogo = document.querySelector(selector);
        if (dialogo) {
            dialogo.classList.toggle("dialog-close");

            //VARIABLES CREADAS (nuevo código aquí)
            
        
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
        const btnSeguir = crearBoton("Voy a ver si puedo ayudar a laguien más", function() {
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
        dialogoContenidoElement.innerHTML = '<p class="hud">¡Oh! Has encontrado la piedra.</p><p class="hud">¡Muchísimas gracias!</p>';
    
        //Botón
        const btnSeguir = crearBoton("¡De nada!", function() {
            cerrarDialogo('#dialogoLumo'); 
        }); dialogoBotonesElement.appendChild(btnSeguir);

        //Nuevo estado
        EstadoJuego.estadoPiedra = 'entregada';
        EstadoJuego.setearEstadoPiedra();
    }
}

// CLICK EN ARBUSTO ---------------------------------------------------------------------
function sacarPiedra(e) {
    if(EstadoJuego.estadoPiedra === 'buscando') {
        const piedraBrillante = document.getElementById('piedraBrillanteArbusto');
        piedraBrillante.classList.add('popObjetoMostrar');
        piedraBrillante.classList.remove('popObjetoOcultar');
    }
}

function cogerPiedra(Piedra) {
    Piedra.classList.add('popObjetoOcultar');
    Piedra.classList.remove('popObjetoMostrar');
}

//DIÁLOGO LUMO BUSCAR PIEDRA ------------------------------------------------------------
function dialogoLumoBuscando() {
    if (EstadoJuego.estadoPiedra === 'buscando') {
        const dialogoContenidoElement = document.getElementById('dialog-lumo-content');
        const dialogoBotonesElement = document.getElementById('dialog-lumo-btns');
    
        dialogoContenidoElement.innerHTML = '';
        dialogoBotonesElement.innerHTML = '';
    
        //Respuesta
        dialogoContenidoElement.innerHTML = '<p class="hud">¿Has visto la piedra brillante de Floris?</p><p class="hud">Debe estar entre las plantas.</p>';
    
        //Botón
        const btnSeguir = crearBoton("¡Sigo buscando!", function() {
            cerrarDialogo('#dialogoLumo'); 
        }); dialogoBotonesElement.appendChild(btnSeguir);

        //Nuevo estado
        EstadoJuego.estadoPiedra = 'encontrada';
        EstadoJuego.setearEstadoPiedra();
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
                        animarBotones();
                        animarNuevoContenido();
                }); dialogoBotonesElement.appendChild(btnPuedeEnfadarse);
            animarNuevoContenido();
            animarBotones();


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
            
            animarBotones();
            animarNuevoContenido();
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
                            animarBotones();
                            animarNuevoContenido();
                        }); dialogoBotonesElement.appendChild(btnSiguiente3); 
                        animarBotones();
                        animarNuevoContenido();
                    }); dialogoBotonesElement.appendChild(btnSiguiente2);
                    animarBotones();
                    animarNuevoContenido(); 
                }); dialogoBotonesElement.appendChild(btnSiguiente1); 
                animarBotones();
                animarNuevoContenido();
            }); dialogoBotonesElement.appendChild(btnSeguir);
            animarBotones();
            animarNuevoContenido();
        };

        //SEGUIR: BUSCAR JUNTOS ----------------------------------------------------------------
        function buscarJuntos() {
            //SETEAR BUSCAR PIEDRA _____________________________
            EstadoJuego.estadoPiedra = 'buscando';
            EstadoJuego.setearEstadoPiedra();

            //SETEAR PUNTOS _____________________________
            if(EstadoJuego.estadoPiedra === 'buscando') {
                EstadoJuego.puntos = EstadoJuego.puntos + 1;
                EstadoJuego.setearPuntos();   
            };

            //Parrafo
            dialogoContenidoElement.innerHTML = '<p class="hud">¡Gracias! Me siento mejor con ayuda.</p><p class="hud">Podemos buscarla entre las plantas del bosque.</p>';

            //Botones
            dialogoBotonesElement.innerHTML = '';
            const btnBuscar = crearBoton("¡Vale! Voy a ver si la encuentro", function() {
                cerrarDialogo('#dialogoLumo'); 
            }); dialogoBotonesElement.appendChild(btnBuscar);
            animarBotones();
            animarNuevoContenido();
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

        //ANIMACIONES ----------------------------------------------------------------
        // ANIMACIÓN BOTONES
        function animarBotones() {
            gsap.fromTo(dialogoBotonesElement.children,
                { opacity: 0 },
                { opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.3, delay: 0.1 }
            );
        }
        
        // ANIMACIÓN CONTENIDO
        function animarNuevoContenido() {
            gsap.fromTo(dialogoContenidoElement.children, 
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }
            );
        };
    
};

//ANIMACIONES -------------------------------------------------------------------