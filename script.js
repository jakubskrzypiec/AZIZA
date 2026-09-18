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
