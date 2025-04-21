// DIALOGOS ===============================================================

//ABRIR
    function abrirDialogo() {
        const dialogo = document.getElementById("dialogoLumo");
        dialogo.classList.toggle("dialog-close");
    }

 //CERRAR
    document.addEventListener("DOMContentLoaded", () => {
        const dialogo = document.getElementById("dialogoLumo");
        const botones = dialogo.querySelectorAll("button");

        botones.forEach(boton => {
            boton.onclick = () => {
                dialogo.close();
            };
        });
    });