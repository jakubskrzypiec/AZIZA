# AZIZA — publikacja

## Produkcja na SEOHOST — 31 października 2026

Strona produkcyjna działa bezpośrednio na SEOHOST pod **https://www.aziza-suwiczak.pl/**. Nie zmieniano DNS, delegacji domeny ani konfiguracji poczty. GitHub Pages pozostaje podglądem, bez pliku CNAME.

- Katalog publiczny: `/domains/aziza-suwiczak.pl/public_html`.
- Poprzedni WordPress zachowany w `/domains/aziza-suwiczak.pl/wordpress-before-20261031`, poza katalogiem publicznym. Baza danych nie została zmieniona ani usunięta.
- Wykonana i potwierdzona w DirectAdmin kopia plików domen i baz: `/backups/backup-Oct-31-2026-1.tar.zst`.
- Archiwum wdrożenia zachowane poza katalogiem publicznym: `/domains/aziza-suwiczak.pl/AZIZA-upload-20261031.zip`.
- `scripts/package-seohost.mjs` tworzy osobny katalog wdrożeniowy z gotowych stron, zasobów i `.htaccess`, bez `.git`, źródeł oraz dokumentacji. Domyślnie wymaga nowego katalogu wyjściowego; opcjonalna ścieżka jest pierwszym argumentem.
- `.htaccess` zawiera 126 rzeczywistych przekierowań HTTP 301, wymuszenie HTTPS i www, obsługę 404, kompresję oraz cache. Adresy podstron są bez `.html`.
- Aktualizacje repo nie aktualizują automatycznie SEOHOST. Należy zbudować i sprawdzić stronę, utworzyć nową paczkę, wgrać poza `public_html`, rozpakować i dopiero przełączyć katalogi. Archiwum ZIP nie powinno pozostać w publicznym katalogu.
- Powrót do poprzedniej wersji: zachować obecny `public_html` pod inną nazwą poza katalogiem publicznym, następnie przywrócić nazwę `public_html` katalogowi `wordpress-before-20261031`. Nie przywracać bazy ani poczty bez potrzeby.
- TLS zweryfikowany, aktualny certyfikat ważny do 25 stycznia 2027. Panel zawiera historyczne nieudane automatyczne odnowienie z 27 października; warto obserwować kolejne odnowienie, nie wyłączano HTTPS.
- FormSubmit 31 października odpowiada poprawnie na sprawdzenie dostępności i CORS. Rzeczywista dostawa oraz ewentualna aktywacja skrzynki wymagają oddzielnego potwierdzenia.
- Uzgodniony test formularza 31 października nie potwierdził przyjęcia wiadomości. Nie uznawać formularza za przetestowany pod kątem dostawy; sprawdzić mail aktywacyjny u klientki i po aktywacji potwierdzić odbiór testu. Rozpoznawanie odpowiedzi aktywacyjnej działa również przy `success: false`.
- Poprawka strzałek mobilnych: generator tworzy monochromatyczne SVG, a wspólny `premium-motion.js` normalizuje również znaki w starszych plikach HTML. Skrypt oraz poprawka formularza zostały zapisane bezpośrednio w panelu i ich treść porównano z repo. Paczka początkowego wdrożenia jest historyczną wersją sprzed tych poprawek; kolejne paczki budować z aktualnego repo. Cache skryptów wynosi godzinę, więc wcześniejszy podgląd może wymagać pełnego odświeżenia.

## Podgląd GitHub Pages i alternatywna konfiguracja

Docelowy adres: **https://www.aziza-suwiczak.pl/**. Aktualny podgląd: https://jakubskrzypiec.github.io/AZIZA/.

## Edycja i sprawdzanie

- Treść: `_source/pages/*.html`. Pliki HTML w katalogu głównym są przekierowaniami; nie edytować ich ręcznie.
- Adresy: `_source/routes.json`. SEO: `_source/seo.json`. Warianty zdjęć: `_source/responsive.json`.
- Po zmianie uruchom `npm run build`, następnie `npm test`. Zacommituj również wygenerowane katalogi z `index.html`.
- GitHub Pages publikuje `main` z katalogu głównego. `_config.yml` wyklucza źródła, narzędzia i dokumentację z publikacji. Nie dodawać `.nojekyll` bez zmiany procesu publikacji.
- Wszystkie strony mają bazę względną, więc podgląd w `/AZIZA/` i domena główna korzystają z tych samych plików.

## Przełączenie domeny — w uzgodnionym terminie

1. Zachować kopię aktualnej strony i rekordów DNS w SEOHOST.
2. W GitHub → repo AZIZA → Settings → Pages ustawić Custom domain: `www.aziza-suwiczak.pl`. To utworzy plik `CNAME`; zachować go w kolejnych commitach. Zrobić to bezpośrednio przed zmianą DNS, ponieważ podgląd GitHub zacznie przekierowywać na domenę.
3. W SEOHOST zmienić rekord CNAME `www` na `jakubskrzypiec.github.io` (bez `/AZIZA/`). Dla domeny głównej ustawić rekordy A: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`. Ewentualne rekordy AAAA muszą odpowiadać konfiguracji GitHub Pages.
4. Zachować rekordy MX, SPF, DKIM, DMARC i adresy serwera pocztowego. Jeżeli serwer poczty korzysta z adresu domeny głównej, najpierw odseparować jego rekord od rekordu strony — samo pozostawienie MX wskazującego na przenoszoną domenę nie wystarczy.
5. Po potwierdzeniu DNS i wystawieniu certyfikatu włączyć Enforce HTTPS. Sprawdzić www, adres bez www, podstrony, 404 oraz zdjęcia i film.
6. W Search Console dodać `https://www.aziza-suwiczak.pl/sitemap.xml` i skontrolować indeksowanie po migracji. Nie zmieniać obecnej domeny tylko w celu przebudowy strony.

Oficjalna konfiguracja DNS: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## Formularz — warunek przed uznaniem wysyłki za gotową

- Odbiorca: `izabela.suwiczak@aziza-suwiczak.pl`. Usługa: FormSubmit. Bez haseł i serwera PHP w repo.
- Pierwsze przesłanie formularza może wywołać mail aktywacyjny. Właścicielka skrzynki musi zatwierdzić formularz linkiem z maila. Może być potrzebna osobna aktywacja dla adresu podglądu i docelowej domeny.
- Po aktywacji wysłać uzgodnioną wiadomość testową i potwierdzić jej rzeczywisty odbiór oraz możliwość odpowiedzi na adres nadawcy.
- Nie traktować samego komunikatu w przeglądarce jako dowodu doręczenia. Testy automatyczne sprawdzają żądanie, sukces, błąd, brak połączenia, aktywację i zachowanie wpisanej treści; nie wysyłają wiadomości klientce.
- W trakcie przygotowania bezpośrednie żądania do dokumentacji usługi odpowiadały HTTP 521. To zewnętrzna dostępność usługi, a nie błąd HTML. Przed publikacją należy potwierdzić jej aktualną dostępność i prawdziwy odbiór wiadomości.

Dokumentacja aktywacji: https://formsubmit.co/help. AJAX: https://formsubmit.co/ajax-documentation.

## Zmiana adresów a SEO

Nowe linki nie zawierają `.html`. Kanoniczne adresy, sitemap, Open Graph i JSON-LD używają domeny docelowej. Nie dodano sztucznych ocen, cen ani lokalizacji realizacji.

`docs/redirects.json` zawiera mapę starych adresów. GitHub Pages nie udostępnia własnych reguł HTTP 301/308: stare adresy mają natychmiastowe przekierowanie HTML i `location.replace`, kanoniczny adres docelowy oraz `noindex`. Google obsługuje takie przekierowania, ale preferuje przekierowania serwerowe. Jeśli wymagane są prawdziwe HTTP 301 ze starego WordPressa, należy zachować warstwę przekierowań u dostawcy DNS/proxy lub hostingu, który ją obsługuje. Plik `.htaccess` nie zadziała na GitHub Pages.

Źródło: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
