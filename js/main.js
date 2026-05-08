// Menú responsive (hamburguesa)
const toggle = document.querySelector('.nav__toggle');
const nav = document.getElementById('nav');
if (toggle && nav) {
    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.contains('nav--open');
        nav.classList.toggle('nav--open');
        toggle.setAttribute('aria-expanded', String(!isOpen));
    });

    // Cerrar menú al hacer click en un link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('nav--open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}


// Año dinámico en el footer
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Reveal — animaciones de entrada al hacer scroll
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                io.unobserve(e.target);
            }
        });
    }, { threshold: .1 });
    revealEls.forEach(el => io.observe(el));
}

// Link activo en la navegación al hacer scroll
const navLinks = document.querySelectorAll('.nav__list a[href^="#"]');
const sections = document.querySelectorAll('main section[id], footer[id]');

if ('IntersectionObserver' in window && navLinks.length && sections.length) {
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                navLinks.forEach(a => a.classList.remove('active'));
                const active = document.querySelector(`.nav__list a[href="#${e.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => navObserver.observe(s));
}

// Botón volver arriba
const toTop = document.getElementById('to-top');
if (toTop) {
    window.addEventListener('scroll', () => {
        toTop.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
    toTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// FAQ — acordeón
document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('faq-open');
        // Cierra todos los otros
        document.querySelectorAll('.faq-item.faq-open').forEach(i => i.classList.remove('faq-open'));
        // Abre o cierra el actual
        if (!isOpen) item.classList.add('faq-open');
    });
});
