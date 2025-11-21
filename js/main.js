// Menú responsive (hamburguesa)
const toggle = document.querySelector('.nav__toggle');
const nav = document.getElementById('nav');
if (toggle && nav){
    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.contains('nav--open');
        nav.classList.toggle('nav--open');
        toggle.setAttribute('aria-expanded', String(!isOpen));
    });
}

// Header que se oculta/muestra al hacer scroll
let lastScrollY = 0;
const header = document.querySelector('.header');

if (header) {
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Si está en el tope de la página, siempre mostrar
        if (currentScrollY <= 0) {
            header.classList.remove('hidden');
            header.classList.add('visible');
            return;
        }
        
        // Si hace scroll hacia abajo, ocultar
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.classList.add('hidden');
            header.classList.remove('visible');
        } 
        // Si hace scroll hacia arriba, mostrar
        else if (currentScrollY < lastScrollY) {
            header.classList.remove('hidden');
            header.classList.add('visible');
        }
        
        lastScrollY = currentScrollY;
    });
}

// Año dinámico en el footer
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();


// (Opcional) IntersectionObserver para animar entrada de secciones
// Observa elementos con .reveal y agrega .is-visible cuando entran al viewport
const els = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && els.length){
const io = new IntersectionObserver((entries)=>{
entries.forEach(e => {
if (e.isIntersecting){ e.target.classList.add('is-visible'); }
});
}, { threshold: .15 });
els.forEach(el => io.observe(el));
}