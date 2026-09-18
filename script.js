const header = document.getElementById('header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.main-nav a');

function setHeaderState() {
  header.classList.toggle('scrolled', window.scrollY > 30);
}

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

menuToggle?.addEventListener('click', () => {
  const open = header.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('modal-open', open);
});

navLinks.forEach(link => link.addEventListener('click', () => {
  header.classList.remove('menu-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('modal-open');
}));

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

const parallaxEls = document.querySelectorAll('.image-break .parallax-bg');

if (!reducedMotion && window.innerWidth > 760) {
  const parallax = () => {
    parallaxEls.forEach(el => {
      const section = el.parentElement;
      const rect = section.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -0.045;
      el.style.transform = `translate3d(0, ${offset}px, 0) scale(1.03)`;
    });
  };

  parallax();
  window.addEventListener('scroll', parallax, { passive: true });
}

const details = [...document.querySelectorAll('.faq details')];

details.forEach(item => item.addEventListener('toggle', () => {
  if (!item.open) return;
  details.forEach(other => {
    if (other !== item) other.open = false;
  });
}));

document.getElementById('year').textContent = new Date().getFullYear();
