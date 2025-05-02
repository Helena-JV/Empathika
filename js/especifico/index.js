// BOTÓN Y MODAL INFO ===========================================================
function abrirModal(selector) {
  const modal = document.querySelector(selector);
  modal.classList.toggle('ocultar-modal');
}

function cerrarModalFondo(event, modal) {
  if (event.target === modal) {
    modal.classList.add('ocultar-modal');
  }
}



// ANIMACIÓN CRECIMIENTO PLANTAS ===========================================================
let stagger_plantas = 0.4;
let duracion_anim_hojas = 1;
let duracion_anim_lineas = 3;

gsap.registerPlugin(DrawSVGPlugin);

for (let i = 1; i <= 2; i++) {
  // Animación de líneas
  gsap.fromTo(
    document.querySelectorAll(`.plantagrow-index-${i} svg .plant${i}-linea`),
    { drawSVG: "0%" },
    { drawSVG: "100%", duration: duracion_anim_lineas, ease: "power1.inOut" }
  );
  
  // Animación de hojas
  for (let j = 1; j <= 2; j++) {
    gsap.fromTo(
      document.querySelectorAll(`.plantagrow-index-${i} .plant${i}-${j} .plant-${i}-hoja`),
      { scale: "0" },
      { scale: "1", duration: duracion_anim_hojas, ease: "power1.inOut", stagger: stagger_plantas }
    );
  }
}

// ANIMACIÓN CRECIMIENTO FLORES ===========================================================

for (let i = 1; i <= 2; i++){
  gsap.fromTo(
    document.querySelectorAll(`.index-flores .flores-${i} path`),
    { scale: "0" },
    { scale: "1", duration: 1, ease: "power1.inOut", stagger: 0.2 }
  );
}

// ANIMACIÓN FONDO =========================================================================

const bgAnim = [
  document.querySelector(".index-nubes"),
  document.querySelector(".index-sol"),
  document.querySelector(".index-mountain"),
  document.querySelector(".index-monticulo")
];

gsap.fromTo(
  bgAnim,
  { y: "50%" },
  {y: "0", duration: 3, ease: "power1.inOut", stagger: 0.2}
);
