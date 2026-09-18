const body = document.body;
const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 24);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    body.classList.toggle('menu-open', !open);
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

const revealItems = document.querySelectorAll('.reveal');

if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      instance.unobserve(entry.target);
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -32px'
  });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

document.querySelectorAll('.accordion details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;

    const parent = detail.closest('.accordion');
    parent?.querySelectorAll('details[open]').forEach((other) => {
      if (other !== detail) other.removeAttribute('open');
    });
  });
});

const parallaxImage = document.querySelector('.parallax-media img');

if (parallaxImage && !reducedMotion) {
  let ticking = false;

  const updateParallax = () => {
    const section = parallaxImage.closest('.divider');
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const viewport = window.innerHeight;
    const progress = (viewport - rect.top) / (viewport + rect.height);
    const y = (progress - 0.5) * 14;

    parallaxImage.style.transform = `scale(1.055) translate3d(0, ${y}px, 0)`;
    ticking = false;
  };

  const requestTick = () => {
    if (ticking) return;
    requestAnimationFrame(updateParallax);
    ticking = true;
  };

  window.addEventListener('scroll', requestTick, { passive: true });
  updateParallax();
}

const contactForm = document.querySelector('[data-contact-form]');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = contactForm.querySelector('.form-status');
    if (status) status.hidden = false;
  });
}
