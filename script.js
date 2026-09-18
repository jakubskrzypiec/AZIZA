const body = document.body;
const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 32);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    body.classList.toggle('menu-open', !isOpen);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      body.classList.remove('menu-open');
    });
  });
}

document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

const items = document.querySelectorAll('.reveal');

if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      instance.unobserve(entry.target);
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px'
  });

  items.forEach((item) => observer.observe(item));
} else {
  items.forEach((item) => item.classList.add('is-visible'));
}
