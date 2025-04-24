// DIALOGOS GENERAL ===============================================================

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

// SIGUIENTE DIÁLOGO ===============================================================

    //ÁRBOL -------------------------------------------
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

    //BOTÓN FINAL
    dialogoArbolbtnFinal.addEventListener("click", function() {
        window.location.href = "pantalla1.html";
    });