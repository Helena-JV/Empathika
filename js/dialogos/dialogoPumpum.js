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
                    dialogoContenidoElement.innerHTML = '<p class="hud">¿Qué podemos hacer ahora para que no se vualva a caer la torre?</p>';
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

                //NUEVO STADO _____________________________
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