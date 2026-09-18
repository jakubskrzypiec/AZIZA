const header = document.getElementById('header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.main-nav a');

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
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .1, rootMargin: '0px 0px -30px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

const details = [...document.querySelectorAll('.faq details')];

details.forEach(item => item.addEventListener('toggle', () => {
  if (!item.open) return;
  details.forEach(other => {
    if (other !== item) other.open = false;
  });
}));

document.getElementById('year').textContent = new Date().getFullYear();


const contactForm = document.getElementById('contact-form');

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(contactForm);
  const name = data.get('name') || '';
  const email = data.get('email') || '';
  const phone = data.get('phone') || '';
  const scope = data.get('scope') || '';
  const message = data.get('message') || '';

  const subject = encodeURIComponent(`Zapytanie ze strony AZIZA — ${scope}`);
  const body = encodeURIComponent(
    `Imię i nazwisko: ${name}\nE-mail: ${email}\nTelefon: ${phone}\nZakres: ${scope}\n\nWiadomość:\n${message}`
  );

  window.location.href = `mailto:izabela.suwiczak@aziza-suwiczak.pl?subject=${subject}&body=${body}`;
});


const offerItems = [...document.querySelectorAll('.offer-item')];

offerItems.forEach(item => item.addEventListener('toggle', () => {
  if (!item.open) return;
  offerItems.forEach(other => {
    if (other !== item) other.open = false;
  });
}));


// ===== Final delivery motion layer =====
requestAnimationFrame(() => {
  requestAnimationFrame(() => document.body.classList.add('is-ready'));
});

const progressBar = document.querySelector('.scroll-progress span');
const heroBg = document.querySelector('.hero-bg');
const statement = document.querySelector('.statement');
const aboutWord = document.querySelector('.about-word');
const projectsWord = document.querySelector('.projects-word');

let ticking = false;

function updateMotion() {
  const y = window.scrollY;
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, y / max));

  if (progressBar) {
    progressBar.style.transform = `scaleX(${progress})`;
  }

  if (!reducedMotion) {
    const heroOffset = Math.min(22, y * 0.035);
    document.documentElement.style.setProperty('--hero-parallax', `${heroOffset}px`);

    if (aboutWord) {
      const rect = aboutWord.parentElement.getBoundingClientRect();
      const local = (window.innerHeight - rect.top) * 0.018;
      aboutWord.style.setProperty('--about-y', `${Math.max(-8, Math.min(18, local))}px`);
    }

    if (projectsWord) {
      const rect = projectsWord.parentElement.getBoundingClientRect();
      const local = (window.innerHeight - rect.top) * 0.012;
      projectsWord.style.setProperty('--projects-x', `${Math.max(-12, Math.min(22, local))}px`);
    }

    if (statement) {
      const rect = statement.getBoundingClientRect();
      const centerOffset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * 0.025;
      document.documentElement.style.setProperty('--statement-y', `${Math.max(-12, Math.min(12, centerOffset))}px`);
    }
  }

  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateMotion);
    ticking = true;
  }
}, { passive: true });

window.addEventListener('resize', updateMotion, { passive: true });
updateMotion();

// Active navigation section state.
const sectionMap = [
  ['o-mnie', document.querySelector('.main-nav a[href="#o-mnie"]')],
  ['oferta', document.querySelector('.main-nav a[href="#oferta"]')],
  ['realizacje', document.querySelector('.main-nav a[href="#realizacje"]')],
  ['sociale', document.querySelector('.main-nav a[href="#sociale"]')],
  ['kontakt', document.querySelector('.main-nav a[href="#kontakt"]')]
];

if ('IntersectionObserver' in window) {
  const activeObserver = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    sectionMap.forEach(([id, link]) => {
      if (!link) return;
      const active = id === visible.target.id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }, {
    threshold: [0.28, 0.5, 0.72],
    rootMargin: '-18% 0px -48% 0px'
  });

  sectionMap.forEach(([id]) => {
    const section = document.getElementById(id);
    if (section) activeObserver.observe(section);
  });
}
