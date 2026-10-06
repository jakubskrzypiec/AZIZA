// Keep atmospheric motion quiet, and stop it when the scene is off screen.
const ambientScenes = [...document.querySelectorAll('[data-ambient]')];
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
function updateAmbientButton(scene) {
  const paused = motionPreference.matches || scene.classList.contains('is-paused');
  const button = scene.querySelector('.ambient-toggle');
  const subject = 'cienia';
  button.setAttribute('aria-pressed', String(paused));
  button.setAttribute('aria-label', `${paused ? 'Wznów' : 'Wstrzymaj'} animację ${subject}`);
  button.querySelector('span').textContent = paused ? 'Wznów ruch' : 'Zatrzymaj ruch';
  button.disabled = motionPreference.matches;
}
ambientScenes.forEach(scene => {
  updateAmbientButton(scene);
  scene.querySelector('.ambient-toggle').addEventListener('click', () => {
    scene.classList.toggle('is-paused');
    updateAmbientButton(scene);
  });
});
motionPreference.addEventListener('change', () => ambientScenes.forEach(updateAmbientButton));
if ('IntersectionObserver' in window) {
  const ambientObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('is-in-view', entry.isIntersecting));
  }, { threshold: 0 });
  ambientScenes.forEach(scene => ambientObserver.observe(scene));
} else {
  ambientScenes.forEach(scene => scene.classList.add('is-in-view'));
}

const projectsCarousel = document.querySelector('.projects-carousel');
if (projectsCarousel) {
  const previous = document.querySelector('.carousel-prev');
  const next = document.querySelector('.carousel-next');
  const step = () => projectsCarousel.querySelector('.project-slot').getBoundingClientRect().width +
    parseFloat(getComputedStyle(projectsCarousel.querySelector('.projects-carousel-track')).gap);
  const move = direction => projectsCarousel.scrollBy({
    left: step() * direction,
    behavior: motionPreference.matches ? 'instant' : 'smooth'
  });
  const updateControls = () => {
    previous.disabled = projectsCarousel.scrollLeft <= 1;
    next.disabled = projectsCarousel.scrollLeft >= projectsCarousel.scrollWidth - projectsCarousel.clientWidth - 2;
  };
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  projectsCarousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  projectsCarousel.addEventListener('scroll', updateControls, { passive: true });
  window.addEventListener('resize', updateControls);
  let drag = null;
  let suppressClick = false;
  projectsCarousel.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    drag = { x: event.clientX, scroll: projectsCarousel.scrollLeft, id: event.pointerId, moved: false };
    suppressClick = false;
  });
  projectsCarousel.addEventListener('pointermove', event => {
    if (!drag) return;
    const distance = event.clientX - drag.x;
    if (Math.abs(distance) > 6 && !drag.moved) {
      drag.moved = true;
      projectsCarousel.setPointerCapture(drag.id);
      projectsCarousel.classList.add('is-dragging');
    }
    if (drag.moved) {
      event.preventDefault();
      projectsCarousel.scrollLeft = drag.scroll - distance;
    }
  });
  const finishDrag = () => {
    if (!drag) return;
    suppressClick = drag.moved;
    if (projectsCarousel.hasPointerCapture(drag.id)) projectsCarousel.releasePointerCapture(drag.id);
    drag = null;
    projectsCarousel.classList.remove('is-dragging');
  };
  projectsCarousel.addEventListener('pointerup', finishDrag);
  projectsCarousel.addEventListener('pointercancel', finishDrag);
  projectsCarousel.addEventListener('pointerleave', () => { if (drag && !drag.moved) finishDrag(); });
  projectsCarousel.addEventListener('click', event => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClick = false;
  }, true);
  updateControls();
}
