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
