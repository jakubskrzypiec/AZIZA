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

Treść edytuje się bezpośrednio w odpowiednim pliku HTML. `style.css` to istniejący styl strony głównej; `pages.css` zawiera styl podstron, a `home.css` poprawki hero, sekcji „O mnie”, oferty, wybranych realizacji i dwóch atmosferycznych przerywników na stronie głównej. `script.js` odpowiada za dotychczasowe interakcje i przygotowanie wiadomości e-mail, `pages.js` za filtry portfolio, galerie i wybór wariantu oferty, a `home.js` za sterowanie animacją cienia.

Strona główna używa kroju Manrope: lekkie nagłówki i regularny tekst, bez kursywy. Hero zajmuje cały ekran i zawiera tylko hasło oraz dwa przyciski. Trzy karty „Oferta 1–3” pozostawiono jako miejsca na tekst zgodnie z bieżącym kierunkiem projektu. Karuzela zawiera pięć miejsc na realizacje, logo po najechaniu lub ustawieniu fokusu, strzałki, obsługę klawiatury, przeciąganie myszą i przewijanie dotykiem. Na podstronach pozostawiono dotychczasową typografię i treści.

Oryginalne logo dostarczone przez klienta jest w `assets/aziza-logo.png`, a sygnet w `assets/aziza-mark.png`. Obrazy `assets/interlude-light.png` oraz `assets/interlude-art-room.png` wygenerowano jako sceny atmosferyczne, nie jako realizacje pracowni; szczegóły i prompty znajdują się w `IMAGE-PROMPTS.md`. Obraz „Cisza we mnie” jest oryginalną fotografią pracy artystki, nałożoną na wygenerowaną scenę wnętrza. Cień jest osobną warstwą SVG/CSS; zatrzymuje się poza ekranem, można go wstrzymać przyciskiem, a ustawienie systemowe ograniczenia ruchu wyłącza animację automatycznie. Linki „Realizacje” i „Obrazy” otwierają portfolio z odpowiednim filtrem. Sociale znajdują się pod sekcją kontaktową, przed stopką.

Formularz nie ma serwera wysyłającego wiadomości. Otwiera program pocztowy użytkownika z uzupełnionym zapytaniem. Przed publikacją można podłączyć docelową usługę wysyłki.

## Sprawdzenie

Sprawdzono 38 stron, kompletność lokalnych linków i zdjęć, błędy JavaScript, układ przy szerokościach 390/800/1440 px, nawigację mobilną, filtry portfolio, otwieranie i zamykanie galerii oraz przeniesienie wariantu cennika do formularza kontaktowego. Wszystkie sprawdzenia zakończyły się powodzeniem.
