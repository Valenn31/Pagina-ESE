// Leer configuración del admin (link de inscripción dinámico)
(async () => {
  try {
    const res = await fetch('/.netlify/functions/site-config');
    if (!res.ok) return;
    const config = await res.json();
    if (config.inscriptionUrl) {
      const btn = document.getElementById('btn-inscripcion');
      if (btn) {
        btn.href = config.inscriptionUrl;
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
      }
    }
  } catch {
    // En dev local la función no está disponible, se ignora silenciosamente
  }
})();

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

// Carrusel infinito
(function () {
    const track = document.getElementById('carouselTrack');
    const dotsWrap = document.getElementById('carouselDots');
    if (!track || !dotsWrap) return;

    const origSlides = Array.from(track.children);
    const total = origSlides.length;

    // Clonar slides al final para loop infinito hacia adelante
    origSlides.forEach(s => track.appendChild(s.cloneNode(true)));

    let current = 0;
    let transitioning = false;
    let timer;

    origSlides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel__dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Ir a imagen ${i + 1}`);
        dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
        dotsWrap.appendChild(dot);
    });

    function stepPx() {
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        return track.children[0].offsetWidth + gap;
    }

    function updateDots() {
        const real = current % total;
        dotsWrap.querySelectorAll('.carousel__dot').forEach((d, i) => d.classList.toggle('active', i === real));
    }

    function setPos(idx, animate) {
        if (!animate) {
            track.style.transition = 'none';
            track.getBoundingClientRect(); // fuerza reflow para que el cambio sea inmediato
        } else {
            track.style.transition = '';
        }
        track.style.transform = `translateX(-${idx * stepPx()}px)`;
    }

    function goTo(n) {
        if (transitioning) return;
        // Ir hacia atrás desde el inicio: salto instantáneo al final real
        if (n < 0) {
            setPos(total - 1, false);
            current = total - 1;
            updateDots();
            return;
        }
        transitioning = true;
        current = n;
        setPos(current, true);
        updateDots();
    }

    // Cuando termina la animación: si entramos en zona de clones, reset invisible
    track.addEventListener('transitionend', () => {
        transitioning = false;
        if (current >= total) {
            current = current - total;
            setPos(current, false);
        }
    });

    function startAuto() { timer = setInterval(() => goTo(current + 1), 4500); }
    function stopAuto()  { clearInterval(timer); }

    const carousel = track.closest('.carousel');
    carousel.querySelector('.carousel__btn--prev').addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
    carousel.querySelector('.carousel__btn--next').addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) { stopAuto(); goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
    });

    window.addEventListener('resize', () => setPos(current, false), { passive: true });
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);

    setPos(0, false);
    startAuto();
})();

// Pestañas (sección Carrera / Historia)
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => {
            b.classList.remove('tab-active');
            b.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
        btn.classList.add('tab-active');
        btn.setAttribute('aria-selected', 'true');
        document.getElementById('tab-' + tab).classList.remove('hidden');
    });
});

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
