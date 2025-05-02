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
