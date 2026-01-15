// Links del menú
const navLinks = document.querySelectorAll('.navigation .list a');
const navItems = document.querySelectorAll('.navigation .list');

// Indicador (funciona esté dentro o fuera del ul)
const indicator = document.querySelector('.navigation .indicator');

// Obtener targets reales desde los href (#inicio, #sobre-mi, etc.)
const targets = [...navLinks]
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

// Activa un item y mueve el indicador
function setActiveByIndex(index) {
  navItems.forEach(li => li.classList.remove('active'));
  navItems[index].classList.add('active');

  // Mover indicador centrado bajo el item
  if (indicator) {
    const li = navItems[index];
    const left = li.offsetLeft + (li.offsetWidth / 2) - (indicator.offsetWidth / 2);
    indicator.style.transform = `translateX(${left}px)`;
  }
}

// Click: activar inmediatamente (y dejar que el scroll haga el resto)
navItems.forEach((li, i) => {
  li.addEventListener('click', () => setActiveByIndex(i));
});

// Observer: activa según lo que realmente está en pantalla
const observer = new IntersectionObserver((entries) => {
  // Filtrar las que están visibles
  const visibles = entries.filter(e => e.isIntersecting);

  if (visibles.length === 0) return;

  // Elegir la más visible
  visibles.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
  const visibleId = visibles[0].target.id;

  const index = targets.findIndex(el => el.id === visibleId);
  if (index !== -1) setActiveByIndex(index);
}, {
  // Ajusta para que "cuente" como visible cuando entra bien en pantalla
  threshold: [0.2, 0.35, 0.5, 0.65],
  rootMargin: "-20% 0px -45% 0px"
});

// Observar cada sección objetivo
targets.forEach(el => observer.observe(el));

// Al cargar: colocar indicador en el active inicial
window.addEventListener('load', () => {
  const initial = document.querySelector('.navigation .list.active');
  const initialIndex = initial ? [...navItems].indexOf(initial) : 0;
  setActiveByIndex(initialIndex);
});
