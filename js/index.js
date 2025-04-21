// BOTÓN JUGAR ===========================================================
document.getElementById("btn-jugar").addEventListener("click", function() {
  window.location.href = "pantalla1.html";
});

// ANIMACIÓN CRECIMIENTO DE PLANTAS ===========================================================
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
