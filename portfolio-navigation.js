const portfolioMenu = document.querySelector('.nav-portfolio');
if (portfolioMenu) {
  const button = portfolioMenu.querySelector('.portfolio-nav-toggle');
  const panel = portfolioMenu.querySelector('.portfolio-submenu');
  const setPortfolioMenu = open => {
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', `${open ? 'Zwiń' : 'Rozwiń'} działy portfolio`);
    panel.hidden = !open;
  };
  button.addEventListener('click', () => setPortfolioMenu(panel.hidden));
  document.addEventListener('click', event => { if (!portfolioMenu.contains(event.target)) setPortfolioMenu(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) {
      event.stopImmediatePropagation();
      setPortfolioMenu(false);
      button.focus();
    }
  }, true);
  portfolioMenu.addEventListener('focusout', event => { if (!portfolioMenu.contains(event.relatedTarget)) setPortfolioMenu(false); });
}
