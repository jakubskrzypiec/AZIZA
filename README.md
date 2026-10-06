# AZIZA — pierwsza wersja podstron

Rozwinięcie istniejącej strony głównej z repozytorium `jakubskrzypiec/AZIZA`. Strona pozostaje statyczna: HTML, CSS i JavaScript, bez instalowania zależności i bez procesu budowania.

## Podgląd

Otwórz `index.html` w przeglądarce lub udostępnij katalog przez dowolny serwer statyczny. Wszystkie ścieżki są względne, więc projekt działa również w podkatalogu, np. GitHub Pages.

## Zawartość

- Sekcja „O mnie” na stronie głównej; osobną podstronę usunięto.
- Oferta: cztery pionowe karty bez zdjęć (wnętrza, domy, budynki usługowe, obrazy), tabela porównująca warianty Dorycki, Joński i Koryncki oraz trzy podstrony usług.
- Cennik: Dorycki, Joński, Koryncki — zakresy z oryginalnej strony, wycena indywidualna.
- Portfolio: 24 prace, w tym 5 projektów wnętrz i 19 obrazów. Każda praca ma własną podstronę i galerię.
- Blog: 4 pełne artykuły z oryginalnymi datami i autorstwem.
- Kontakt z telefonem, adresem, linkiem do mapy i formularzem przygotowującym e-mail.

Teksty i fotografie pochodzą z publicznej strony https://www.aziza-suwiczak.pl/ (pobrane 6 października 2026). Spis źródeł jest w `content-sources.json`. Zdjęcia znajdują się lokalnie w `assets/`.

## Dalsze poprawki

Treść edytuje się bezpośrednio w odpowiednim pliku HTML. `style.css` to istniejący styl strony głównej; `pages.css` zawiera styl podstron, a `home.css` poprawki hero, sekcji „O mnie”, oferty, wybranych realizacji i dwóch atmosferycznych przerywników na stronie głównej. `script.js` odpowiada za dotychczasowe interakcje i przygotowanie wiadomości e-mail, `pages.js` za filtry portfolio, galerie i wybór wariantu oferty, a `home.js` za sterowanie animacją cienia.

Strona główna używa kroju Manrope: lekkie nagłówki i regularny tekst, bez kursywy. Hero zajmuje cały ekran i zawiera tylko hasło oraz dwa przyciski, z animowanym cieniem ograniczonym do fioletowej ściany. Sekcja „O mnie” ma mniejsze miejsce na zdjęcia. Trzy karty „Oferta 1–3” pozostawiono jako miejsca na tekst; po najechaniu unoszą się i zmieniają cień. Karuzela pod nagłówkiem „Wybrane realizacje” zawiera pięć powiększonych miejsc na realizacje i płynnie przewija się w pętli. Obsługuje zatrzymanie, logo po najechaniu lub ustawieniu fokusu, klawiaturę, przeciąganie myszą i przewijanie dotykiem. Dolne strzałki usunięto. Automatyczny ruch zatrzymuje się przy najechaniu, interakcji, poza ekranem i przy ustawieniu ograniczenia ruchu. Stopka jest jednolicie czarna.

Podstrony mają wspólny fotograficzny hero z animowanym cieniem i tytułem danej strony, np. „Oferta”. Typografia i logo odpowiadają stronie głównej. Opisy, daty artykułów, zdjęcia i pozostałe treści znajdują się pod hero. Styl tej części jest w `subpage-hero.css`; animację obsługuje `home.js`. Wygenerowany obraz jest w `assets/subpage-hero.png`, a jego prompt w `SUBPAGE-HERO-PROMPT.md`. Nagłówki wszystkich podstron korzystają z tej samej powiększonej skali typografii. Osobny arkusz `offer.css` odpowiada za karty, tabelę i fotograficzne zaproszenie do kontaktu na Ofercie. `portfolio.css` odpowiada za galerię w dwóch kolumnach (na telefonie jednej), ramki z podpisami, logo po najechaniu lub ustawieniu fokusu i przerywnik wnętrza z obrazem „Cisza we mnie”. Filtry obejmują Wszystko, Wnętrza i Obrazy. Przerywnik zmienia położenie wraz z filtrem, a jego cień ma sterowanie pauzą i respektuje ograniczenie ruchu. Układ porównania nawiązuje do strony Elephant, a zakresy wariantów pochodzą z oryginalnego cennika AZIZA.

Oryginalne logo dostarczone przez klienta jest w `assets/aziza-logo.png`, a sygnet w `assets/aziza-mark.png`. Obrazy `assets/interlude-light.png` oraz `assets/interlude-art-room.png` wygenerowano jako sceny atmosferyczne, nie jako realizacje pracowni; szczegóły i prompty znajdują się w `IMAGE-PROMPTS.md`. Obraz „Cisza we mnie” jest oryginalną fotografią pracy artystki, nałożoną na wygenerowaną scenę wnętrza. Cień jest osobną warstwą SVG/CSS; zatrzymuje się poza ekranem, można go wstrzymać przyciskiem, a ustawienie systemowe ograniczenia ruchu wyłącza animację automatycznie. Linki „Realizacje” i „Obrazy” otwierają portfolio z odpowiednim filtrem. Sociale znajdują się pod sekcją kontaktową, przed stopką.

Formularz nie ma serwera wysyłającego wiadomości. Otwiera program pocztowy użytkownika z uzupełnionym zapytaniem. Przed publikacją można podłączyć docelową usługę wysyłki.

## Sprawdzenie

Sprawdzono kompletność lokalnych linków i zdjęć, błędy JavaScript, układ przy szerokościach 320/390/800/1440 px, nawigację mobilną, filtry portfolio, otwieranie i zamykanie galerii oraz przeniesienie wariantu cennika do formularza kontaktowego. Po usunięciu podstrony „O mnie” projekt zawiera 37 stron. Nowe karty i tabelę zweryfikowano również na telefonie. Wszystkie sprawdzenia zakończyły się powodzeniem.
