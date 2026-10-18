// Shared motion language. Native scrolling; one entrance per element.
(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 760px)');
  const ease = 'cubic-bezier(.22,1,.36,1)';
  const running = new Set();
  const seen = new WeakSet();
  let observer;
  const selectors = [
    '.page-meta', '.section-head', '.gallery-heading', '.home-art-head',
    '.about-copy', '.about-visual', '.art-interlude-copy', '.light-interlude-copy',
    '.offer-section-intro', '.comparison-copy', '.comparison-scroll', '.comparison-note',
    '.home-offer', '.offer-card', '.portfolio-card', '.portfolio-category', '.blog-card',
    '.home-art-card', '.gallery-trigger', '.project-description',
    '.contact-heading', '.contact-copy', '.contact-form', '.contact-info-card',
    '.social-intro', '.social-links > a', '.reviews-brand', '.reviews-content',
    '.article-body > p', '.article-body > section', '.article-toc', '.article-next', '.article-related',
    '.story-grid > div', '.principle-grid > article', '.intro-visual', '.wide-image',
    '.client-project-grid > a', '.page-cta > .eyebrow', '.page-cta > h2', '.page-cta > a',
    '.offer-invite-copy', '.art-scene', '.footer-brand-block', '.footer-nav', '.footer-contact', '.footer-bottom'
  ].join(',');
  const items = [...document.querySelectorAll(selectors)].filter(el => {
    // Do not apply two entrance translations to nested content or carousel clones.
    return !el.parentElement?.closest(selectors) && !el.closest('.projects-carousel,[data-clone],dialog');
  });
  const heroes = [...document.querySelectorAll('.hero-content h1,.hero-actions,.subpage-hero h1,.article-hero h1')];
  const images = '.portfolio-image,.portfolio-category-image,.home-art-image,.client-portrait,.intro-visual,.wide-image,.art-scene';

  function animate(el, frames, options = {}) {
    const animation = el.animate(frames, { duration: compact.matches ? 700 : 1000, easing: ease, ...options });
    running.add(animation);
    animation.finished.then(() => running.delete(animation), () => running.delete(animation));
    return animation;
  }
  function show(el, delay = 0) {
    el.dataset.motion = 'entrance';
    if (seen.has(el)) return;
    seen.add(el);
    el.classList.remove('motion-await');
    el.dataset.motionState = 'revealed';
    if (preference.matches) return;
    animate(el, [
      { opacity: 0, translate: `0 ${compact.matches ? 20 : 34}px` },
      { opacity: 1, translate: '0 0' }
    ], { delay, fill: 'backwards' });
    const visual = el.matches(images) ? el : el.querySelector(images);
    if (visual && !compact.matches) {
      animate(visual, [{ clipPath: 'inset(6% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)' }], { delay, duration: 1200, fill: 'backwards' });
      const photo = visual.querySelector('img');
      if (photo) animate(photo, [{ scale: 1.045 }, { scale: 1 }], { delay, duration: 1400, fill: 'backwards' });
    }
  }
  function stagger(el) {
    const parent = el.parentElement;
    const columns = getComputedStyle(parent).gridTemplateColumns.split(' ').length;
    const siblings = [...parent.children].filter(child => items.includes(child));
    const index = Math.max(0, siblings.indexOf(el));
    return Math.min(columns > 1 ? index % columns : index, 3) * 75;
  }
  function revealFocus(event) {
    const target = event.target.closest('[data-motion]');
    if (!target) return;
    observer?.unobserve(target);
    show(target);
    // Keyboard focus must never wait for an entrance transition.
    for (const animation of target.getAnimations({ subtree: true })) {
      if (running.has(animation)) animation.finish();
    }
  }
  function disable() {
    observer?.disconnect();
    running.forEach(animation => animation.cancel());
    running.clear();
    [...items, ...heroes].forEach(el => {
      el.classList.remove('motion-await');
      el.dataset.motionState = 'revealed';
      seen.add(el);
    });
    document.body.classList.remove('motion-enabled');
  }
  if (!('IntersectionObserver' in window) || !Element.prototype.animate || preference.matches) {
    disable();
    return;
  }
  try {
    observer = new IntersectionObserver(entries => {
      entries.filter(entry => entry.isIntersecting).forEach(entry => {
        observer.unobserve(entry.target);
        show(entry.target, stagger(entry.target));
      });
    }, { threshold: .06, rootMargin: '0px 0px -24px 0px' });
    items.forEach(el => {
      el.dataset.motion = 'entrance';
      const box = el.getBoundingClientRect();
      if (box.bottom < 0) { seen.add(el); el.dataset.motionState = 'revealed'; return; }
      el.classList.add('motion-await');
      el.dataset.motionState = 'pending';
      observer.observe(el);
    });
    heroes.forEach((el, index) => show(el, index * 160 + 80));
    const heroPhoto = document.querySelector('.hero-bg,.subpage-hero-photo');
    if (heroPhoto) animate(heroPhoto, [{ scale: 1.035 }, { scale: 1 }], { duration: 1700 });
    document.body.classList.add('motion-enabled');
    document.addEventListener('focusin', revealFocus);
    preference.addEventListener('change', event => { if (event.matches) disable(); });
    // Back/forward cache may restore scroll past an unobserved block.
    window.addEventListener('pageshow', event => { if (event.persisted) disable(); });
    const submenu = document.querySelector('.portfolio-submenu');
    if (submenu) new MutationObserver(() => {
      if (!submenu.hidden && !preference.matches) animate(submenu, [
        { opacity: 0, translate: '0 8px' }, { opacity: 1, translate: '0 0' }
      ], { duration: 300 });
    }).observe(submenu, { attributes: true, attributeFilter: ['hidden'] });
  } catch {
    // If motion cannot initialize, all content remains readable.
    disable();
  }
})();
