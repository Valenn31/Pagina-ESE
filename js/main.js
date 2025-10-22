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