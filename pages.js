// Progressive enhancement: routes and content are plain static HTML.
const filters = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('.portfolio-card');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  let count = 0;
  cards.forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
    if (!card.hidden) count++;
  });
  const interlude = document.querySelector('.portfolio-interlude');
  const visible = [...cards].filter(card => !card.hidden);
  if (interlude && visible.length) visible[Math.min(visible.length > 6 ? 3 : 1, visible.length - 1)].after(interlude);
  const counter = document.getElementById('portfolio-count');
  if (counter) counter.textContent = `${count} ${count === 1 ? 'praca' : count >= 2 && count <= 4 ? 'prace' : 'prac'}`;
}));

const portfolioType = new URLSearchParams(location.search).get('typ');
if (portfolioType === 'obrazy' || portfolioType === 'realizacje') {
  const initialFilter = portfolioType === 'obrazy' ? 'Sztuka' : 'Wnętrza';
  [...filters].find(button => button.dataset.filter === initialFilter)?.click();
}

const galleryButtons = document.querySelectorAll('.gallery-trigger');
if (galleryButtons.length) {
  const dialog = document.createElement('dialog');
  dialog.className = 'image-dialog';
  dialog.setAttribute('aria-label', 'Powiększone zdjęcie realizacji');
  dialog.innerHTML = '<div class="dialog-bar"><p></p><button class="dialog-close" type="button" autofocus>Zamknij ×</button></div>';
  document.body.append(dialog);
  galleryButtons.forEach(button => button.addEventListener('click', () => {
    let image = dialog.querySelector('img');
    if (!image) {
      image = document.createElement('img');
      dialog.append(image);
    }
    image.src = button.dataset.image;
    image.alt = button.dataset.caption;
    dialog.querySelector('p').textContent = button.dataset.caption;
    dialog.showModal();
    document.body.classList.add('modal-open');
  }));
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && header?.classList.contains('menu-open')) {
    header.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('modal-open');
    menuToggle?.focus();
  }
});

const chosenVariant = new URLSearchParams(location.search).get('wariant');
if (['Dorycki','Joński','Koryncki'].includes(chosenVariant)) {
  const message = document.querySelector('[name="message"]');
  if (message) message.value = `Dzień dobry, interesuje mnie wariant ${chosenVariant}. Chciałbym/chciałabym porozmawiać o projekcie: `;
}
