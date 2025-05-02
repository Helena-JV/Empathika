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

        // CARGAR JS EN LA TRANSICIÓN ---------------------------
        views: [
            {
                namespace: 'dialogo-inicial',
                beforeEnter() {
                    dialogoArbol();
                },
            },{
                namespace: 'pantalla-juego-1',
                beforeEnter() {
                    abrirModal();
                    cerrarModalFondo();
                    movPersonaje();
                    abrirDialogo();
                    cerrarDialogo();
                    cerrarSiFondo();
                    crearBoton();
                    gestionarRespuestaLumo();
                },
            },
        ],
    });

    // CARGAR JS SI SE RECARGA LA PÁGINA ---------------------------
    document.addEventListener('DOMContentLoaded', () => {
        const namespace = document.body.getAttribute('data-barba-namespace');
      
        if (namespace === 'dialogo-inicial') {
          dialogoArbol();
        } else if (namespace === 'pantalla-juego-1') {
            abrirModal();
            cerrarModalFondo();
            movPersonaje();
            abrirDialogo();
            cerrarDialogo();
            cerrarSiFondo();
            crearBoton();
            gestionarRespuestaLumo();
        }
      });



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

    //CREAR BOTON EN DIÁLOGO
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
function gestionarRespuestaLumo(respuesta) {
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
        dialogoContenidoElement.innerHTML = '<p class="hud">Uf... ¿De verdad crees que no se enfadará?</p>';

		//Botones
			//RESPUESTA 1 ____________________________________
			const btnDecirselo = crearBoton("Si le dices la verdad, seguro que lo valora.", function() {
				decirseloAFloris();
			});
			dialogoBotonesElement.appendChild(btnDecirselo);

			//RESPUESTA 2 ____________________________________
			const btnPuedeEnfadarse = crearBoton("Puede enfadarse un poco, pero es lo correcto.", function() {
				//Parrafo
				dialogoContenidoElement.innerHTML = '<p class="hud">¡Ay no! Entonces mejor no le digo nada...</p>';
				
				//Botones
				dialogoBotonesElement.innerHTML = ''; 
					//RESPUESTA 2.1 ____________________________________
					const btnDecirVerdad = crearBoton("Creo que deberías decirle la verdad.", function() {
						decirseloAFloris();
					});
					dialogoBotonesElement.appendChild(btnDecirVerdad);

					//RESPUESTA 2.2 ____________________________________
					const btnNoDecir = crearBoton("No digas nada, igual no se da cuenta.", function() {
						gestionarRespuestaLumo('noDecir');
					});
					dialogoBotonesElement.appendChild(btnNoDecir);
			});
			dialogoBotonesElement.appendChild(btnPuedeEnfadarse);


	//RESPUESTA: NO DECIR NADA ----------------------------------------------------------------
    } else if (respuesta === 'noDecir') {

		//Parrafo
        dialogoContenidoElement.innerHTML = '<p class="hud">No sé… eso me hace sentir mal por dentro… ¿Qué otra cosa puedo hacer?</p>';

		//RESPUESTA 1 ____________________________________
			const btnDiselo = crearBoton("Díselo s Floris, seguro que lo entiende", function() {
				decirseloAFloris();
			});
			dialogoBotonesElement.appendChild(btnDiselo);

		//RESPUESTA 2 ____________________________________
			const btnBuscarJuntos = crearBoton("Vamos a buscarla juntos.", function() {
				buscarJuntos();
			});
			dialogoBotonesElement.appendChild(btnBuscarJuntos);
    };

	//SEGUIR: DECIRSELO A FLORIS ----------------------------------------------------------------
	function decirseloAFloris() {
		//Parrafo
        dialogoContenidoElement.innerHTML = '<p class="hud">Está bien. Se lo diré…</p><p class="hud">— ¡Floris!</p>';
        //Botones
		dialogoBotonesElement.innerHTML = '';
		const btnSeguir = crearBoton("A ver qué dice Floris.", function() {
			cerrarDialogo('#dialogoLumo'); 
		});
		dialogoBotonesElement.appendChild(btnSeguir);
		
				// TEXTO DE FLORIS
				//
				//
    };

	//SEGUIR: BUSCAR JUNTOS ----------------------------------------------------------------
	function buscarJuntos() {
		//Parrafo
        dialogoContenidoElement.innerHTML = '<p class="hud">¡Gracias! Me siento mejor con ayuda. Podemos a buscar por aquí…</p>';

		//Botones
		dialogoBotonesElement.innerHTML = '';
		const btnBuscar = crearBoton("¡Vale! Voy a ver si la encuentro", function() {
			cerrarDialogo('#dialogoLumo'); 
		});
        dialogoBotonesElement.appendChild(btnBuscar);
	};

  };
