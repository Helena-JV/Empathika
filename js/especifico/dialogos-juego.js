// DIALOGOS JUEGO GENERAL ===============================================================

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