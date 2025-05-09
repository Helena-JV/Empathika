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
        dialogoContenidoElement.innerHTML = '<p class="hud">¿Has visto la piedra brillante de Floris?</p><p class="hud">Debe estar entre las plantas.</p>';
    
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