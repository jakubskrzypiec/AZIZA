# AZIZA — pierwsza wersja podstron

Rozwinięcie istniejącej strony głównej z repozytorium `jakubskrzypiec/AZIZA`. Strona pozostaje statyczna: HTML, CSS i JavaScript, bez instalowania zależności i bez procesu budowania.

## Podgląd

Otwórz `index.html` w przeglądarce lub udostępnij katalog przez dowolny serwer statyczny. Wszystkie ścieżki są względne, więc projekt działa również w podkatalogu, np. GitHub Pages.

## Zawartość

- O mnie i biografia Izabeli Suwiczak-Lewandowskiej.
- Oferta i trzy podstrony usług: wnętrza, domy, budynki usługowe.
- Cennik: Dorycki, Joński, Koryncki — zakresy z oryginalnej strony, wycena indywidualna.
- Portfolio: 24 prace, w tym 5 projektów wnętrz i 19 obrazów. Każda praca ma własną podstronę i galerię.
- Blog: 4 pełne artykuły z oryginalnymi datami i autorstwem.
- Kontakt z telefonem, adresem, linkiem do mapy i formularzem przygotowującym e-mail.

Teksty i fotografie pochodzą z publicznej strony https://www.aziza-suwiczak.pl/ (pobrane 6 października 2026). Spis źródeł jest w `content-sources.json`. Zdjęcia znajdują się lokalnie w `assets/`.

## Dalsze poprawki

Treść edytuje się bezpośrednio w odpowiednim pliku HTML. `style.css` to istniejący styl strony głównej; `pages.css` zawiera styl podstron, a `home.css` poprawki hero, sekcji „O mnie”, oferty i wybranych realizacji na stronie głównej. `script.js` odpowiada za dotychczasowe interakcje i przygotowanie wiadomości e-mail, a `pages.js` za filtry portfolio, galerie i wybór wariantu oferty.

Formularz nie ma serwera wysyłającego wiadomości. Otwiera program pocztowy użytkownika z uzupełnionym zapytaniem. Przed publikacją można podłączyć docelową usługę wysyłki.

## Sprawdzenie

Sprawdzono 38 stron, kompletność lokalnych linków i zdjęć, błędy JavaScript, układ przy szerokościach 390/800/1440 px, nawigację mobilną, filtry portfolio, otwieranie i zamykanie galerii oraz przeniesienie wariantu cennika do formularza kontaktowego. Wszystkie sprawdzenia zakończyły się powodzeniem.
