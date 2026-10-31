// FormSubmit delivers messages without a server on GitHub Pages.
(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const button = form.querySelector('[type="submit"]');
  const status = form.querySelector('[role="status"]');
  const label = button.innerHTML;
  let sending = false;

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    const fields = new FormData(form);
    if (String(fields.get('_honey') || '').trim()) return;
    sending = true;
    button.disabled = true;
    button.textContent = 'Wysyłanie…';
    form.setAttribute('aria-busy', 'true');
    status.textContent = 'Wysyłam wiadomość…';
    status.dataset.state = 'pending';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const payload = Object.fromEntries(fields.entries());
    payload._subject = `Zapytanie ze strony AZIZA — ${fields.get('scope') || 'Kontakt'}`;
    payload._url = location.href.split(/[?#]/)[0];
    try {
      const response = await fetch(form.dataset.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      const data = await response.json();
      if (/activat|confirm.*form|verify.*email/i.test(String(data.message || ''))) {
        status.textContent = 'Formularz oczekuje na aktywację. Napisz bezpośrednio na izabela.suwiczak@aziza-suwiczak.pl — treść pozostaje w formularzu.';
        status.dataset.state = 'error';
        return;
      }
      if (!response.ok || ![true, 'true'].includes(data.success)) {
        // Provider diagnostics deliberately exclude the submitted personal data.
        console.warn('AZIZA: formularz odrzucony przez usługę', response.status, String(data.message || 'Brak szczegółów'));
        throw new Error('Submission rejected');
      }
      form.reset();
      status.textContent = 'Dziękuję! Wiadomość została przekazana do pracowni. Odpowiem na podany adres e-mail.';
      status.dataset.state = 'success';
    } catch {
      status.textContent = 'Nie udało się potwierdzić wysyłki. Twoja wiadomość pozostała w formularzu. Spróbuj ponownie lub napisz na izabela.suwiczak@aziza-suwiczak.pl.';
      status.dataset.state = 'error';
    } finally {
      clearTimeout(timeout);
      sending = false;
      button.disabled = false;
      button.innerHTML = label;
      form.removeAttribute('aria-busy');
    }
  });
})();
