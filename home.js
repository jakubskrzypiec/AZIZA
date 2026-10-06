// Keep atmospheric motion quiet, and stop it when the scene is off screen.
const ambientScenes = [...document.querySelectorAll('[data-ambient]')];
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
function updateAmbientButton(scene) {
  const paused = motionPreference.matches || scene.classList.contains('is-paused');
  const button = scene.querySelector('.ambient-toggle');
  if (!button) return;
  const subject = 'cienia';
  button.setAttribute('aria-pressed', String(paused));
  button.setAttribute('aria-label', `${paused ? 'Wznów' : 'Wstrzymaj'} animację ${subject}`);
  button.querySelector('span').textContent = paused ? 'Wznów ruch' : 'Zatrzymaj ruch';
  button.disabled = motionPreference.matches;
}
ambientScenes.forEach(scene => {
  updateAmbientButton(scene);
  scene.querySelector('.ambient-toggle')?.addEventListener('click', () => {
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
  const track = projectsCarousel.querySelector('.projects-carousel-track');
  const originals = [...track.children];
  const clone = card => {
    const copy = card.cloneNode(true);
    copy.dataset.clone = 'true';
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll('a').forEach(link => link.tabIndex = -1);
    return copy;
  };
  track.prepend(...originals.map(clone));
  track.append(...originals.map(clone));
  const previous = document.querySelector('.carousel-prev');
  const next = document.querySelector('.carousel-next');
  const pause = document.querySelector('.carousel-pause');
  const step = () => originals[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap);
  const loopWidth = () => step() * originals.length;
  let cycleWidth = loopWidth();
  let position = cycleWidth;
  projectsCarousel.scrollLeft = position;
  let hovered = false;
  let focused = false;
  let inView = false;
  let userPaused = false;
  let holdUntil = 0;
  let lastFrame = 0;
  const updatePause = () => {
    const paused = userPaused || motionPreference.matches;
    pause.setAttribute('aria-pressed', String(paused));
    pause.setAttribute('aria-label', paused ? 'Wznów ruch karuzeli' : 'Wstrzymaj ruch karuzeli');
    pause.textContent = paused ? '▶' : '■';
    pause.disabled = motionPreference.matches;
  };
  pause.addEventListener('click', () => { userPaused = !userPaused; updatePause(); });
  motionPreference.addEventListener('change', updatePause);
  updatePause();
  const move = direction => {
    holdUntil = performance.now() + 2500;
    projectsCarousel.scrollBy({ left: step() * direction, behavior: motionPreference.matches ? 'instant' : 'smooth' });
  };
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  projectsCarousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  projectsCarousel.addEventListener('mouseenter', () => hovered = true);
  projectsCarousel.addEventListener('mouseleave', () => hovered = false);
  projectsCarousel.addEventListener('focusin', () => focused = true);
  projectsCarousel.addEventListener('focusout', event => { if (!projectsCarousel.contains(event.relatedTarget)) focused = false; });
  projectsCarousel.addEventListener('touchstart', () => holdUntil = Infinity, { passive: true });
  projectsCarousel.addEventListener('touchend', () => holdUntil = performance.now() + 2500, { passive: true });
  projectsCarousel.addEventListener('touchcancel', () => holdUntil = performance.now() + 2500, { passive: true });
  window.addEventListener('resize', () => {
    cycleWidth = loopWidth();
    position = cycleWidth;
    projectsCarousel.scrollLeft = position;
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { inView = entries[0].isIntersecting; }).observe(projectsCarousel);
  } else inView = true;
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
  function advance(now) {
    const elapsed = lastFrame ? Math.min(50, now - lastFrame) : 0;
    lastFrame = now;
    const width = cycleWidth;
    if (inView && !document.hidden && !hovered && !focused && !drag && !userPaused && !motionPreference.matches && now > holdUntil) {
      position += elapsed * .028;
      while (position >= width * 2) position -= width;
      while (position < width) position += width;
      projectsCarousel.scrollLeft = position;
    } else position = projectsCarousel.scrollLeft;
    requestAnimationFrame(advance);
  }
  requestAnimationFrame(advance);
}
