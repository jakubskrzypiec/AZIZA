# AZIZA — pierwsza wersja podstron

Rozwinięcie istniejącej strony głównej z repozytorium `jakubskrzypiec/AZIZA`. Strona pozostaje statyczna: HTML, CSS i JavaScript, bez instalowania zależności i bez procesu budowania.

## Podgląd

Otwórz `index.html` w przeglądarce lub udostępnij katalog przez dowolny serwer statyczny. Wszystkie ścieżki są względne, więc projekt działa również w podkatalogu, np. GitHub Pages.

## Zawartość

- Sekcja „O mnie” na stronie głównej; osobną podstronę usunięto.
- Oferta: cztery pionowe karty bez zdjęć (wnętrza, domy, budynki usługowe, obrazy), tabela porównująca warianty Dorycki, Joński i Koryncki oraz trzy podstrony usług.
- Podstronę Cennik usunięto; zakresy wariantów z oryginalnej strony są w Ofercie.
- Portfolio: 24 prace, w tym 5 projektów wnętrz i 19 obrazów. Każda praca ma własną podstronę i galerię.
- Blog: 4 nowe poradniki bez zdjęć; starsze artykuły zachowano pod dotychczasowymi adresami.
- Kontakt z telefonem, adresem, linkiem do mapy i formularzem przygotowującym e-mail.

Starsze teksty i fotografie pochodzą z publicznej strony https://www.aziza-suwiczak.pl/ (pobrane 6 października 2026). Spis źródeł jest w `content-sources.json`. Zdjęcia znajdują się lokalnie w `assets/`.

## Dalsze poprawki

Treść edytuje się bezpośrednio w odpowiednim pliku HTML. `style.css` to istniejący styl strony głównej; `pages.css` zawiera styl podstron, a `home.css` poprawki hero, sekcji „O mnie”, oferty, wybranych realizacji i dwóch atmosferycznych przerywników na stronie głównej. `script.js` odpowiada za dotychczasowe interakcje i przygotowanie wiadomości e-mail, `pages.js` za powiększanie zdjęć i wybór wariantu oferty, a `home.js` za sterowanie animacją cienia.

Strona główna używa kroju Manrope: lekkie nagłówki i regularny tekst, bez kursywy. Hero zajmuje cały ekran i zawiera tylko hasło oraz dwa przyciski, z animowanym cieniem ograniczonym do fioletowej ściany. Sekcja „O mnie” ma mniejsze miejsce na zdjęcia. Trzy karty Wnętrza / Architektura / Obrazy zawierają krótkie opisy i odnośniki do właściwych podstron; po najechaniu delikatnie się unoszą. Karuzela pod nagłówkiem „Wybrane realizacje” zawiera pięć rzeczywistych zdjęć projektów, prowadzących do ich podstron i płynnie przewija się w pętli. Obsługuje zatrzymanie, logo po najechaniu lub ustawieniu fokusu, klawiaturę, przeciąganie myszą i przewijanie dotykiem. Dolne strzałki usunięto. Automatyczny ruch zatrzymuje się przy najechaniu, interakcji, poza ekranem i przy ustawieniu ograniczenia ruchu. Stopka jest jednolicie czarna.

Podstrony mają wspólny fotograficzny hero z animowanym cieniem i tytułem danej strony, np. „Oferta”. Typografia i logo odpowiadają stronie głównej. Opisy, daty artykułów, zdjęcia i pozostałe treści znajdują się pod hero. Styl tej części jest w `subpage-hero.css`; animację obsługuje `home.js`. Wygenerowany obraz jest w `assets/subpage-hero.png` (do wyświetlania używana jest lżejsza wersja WebP), a jego prompt w `SUBPAGE-HERO-PROMPT.md`. Nagłówki wszystkich podstron korzystają z tej samej powiększonej skali typografii. Osobny arkusz `offer.css` odpowiada za karty, tabelę i fotograficzne zaproszenie do kontaktu na Ofercie. `portfolio.css` odpowiada za galerię w dwóch kolumnach (na telefonie jednej), podpisy bez ramek, logo po najechaniu lub ustawieniu fokusu na osobnych stronach Wnętrza i Obrazy. Galerie nie mają filtrów ani przerywnika. Układ porównania nawiązuje do strony Elephant, a zakresy wariantów pochodzą z oryginalnego cennika AZIZA.

Oryginalne logo dostarczone przez klienta jest w `assets/aziza-logo.png`, a sygnet w `assets/aziza-mark.png`. Obrazy `assets/interlude-light.png` oraz `assets/interlude-art-room.png` wygenerowano jako sceny atmosferyczne, nie jako realizacje pracowni; szczegóły i prompty znajdują się w `IMAGE-PROMPTS.md`. Obraz „Cisza we mnie” jest oryginalną fotografią pracy artystki, nałożoną na wygenerowaną scenę wnętrza. Cień jest osobną warstwą SVG/CSS; zatrzymuje się poza ekranem, można go wstrzymać przyciskiem, a ustawienie systemowe ograniczenia ruchu wyłącza animację automatycznie. Linki „Realizacje” i „Obrazy” otwierają odpowiednio wnetrza.html i obrazy.html. Sociale znajdują się pod sekcją kontaktową, przed stopką.

Formularz nie ma serwera wysyłającego wiadomości. Otwiera program pocztowy użytkownika z uzupełnionym zapytaniem. Przed publikacją można podłączyć docelową usługę wysyłki.

## Sprawdzenie

Sprawdzono kompletność lokalnych linków i zdjęć, błędy JavaScript, układ przy szerokościach 320/390/800/1440 px, nawigację mobilną, obie galerie, otwieranie i zamykanie galerii oraz przeniesienie wariantu cennika do formularza kontaktowego. Projekt zawiera 41 stron oraz przekierowanie ze starego adresu portfolio.html. Nowe karty i tabelę zweryfikowano również na telefonie. Wszystkie sprawdzenia zakończyły się powodzeniem.


## Aktualizacja bloga i kontaktu

Usunięto osobną podstronę Cennik; warianty współpracy pozostają w Ofercie. Nawigacja używa nazwy Kontakt. Blog pokazuje cztery nowe poradniki bez fotografii, z osobnymi adresami, tytułami, opisami meta, spisem treści, linkami wewnętrznymi i danymi BlogPosting. Teksty są nowymi propozycjami redakcyjnymi AZIZA, a nie przedrukami ani przypisanymi Izabeli wypowiedziami. Starsze artykuły zachowano pod ich dotychczasowymi adresami. Nie ustawiono canonical ani sitemap na domenę produkcyjną, ponieważ repo jest nadal podglądem przebudowy. Kontakt ma odświeżony układ, zakres Obraz / malarstwo i sociale pod formularzem. Galerie są bez ramek i przerywnika; podświetlenie klawiaturą używa focus-visible zamiast utrzymującego się focus-within.

## Osobne galerie

Pozycję Portfolio zastąpiono w nagłówku i stopce stronami Wnętrza (`wnetrza.html`, 5 projektów) oraz Obrazy (`obrazy.html`, 19 prac). Każda galeria ma własny hero, opis i siatkę dwóch kolumn bez filtrów i przerywnika. Linki ze strony głównej, oferty, artykułów i podstron realizacji kierują do właściwej galerii. `portfolio.html` jest wyłącznie przekierowaniem zgodnym ze starymi adresami, również z parametrem `typ=obrazy`.

Kontakt: wyśrodkowany nagłówek „Porozmawiajmy o Twoich pomysłach”, większy formularz (do 960 px) i cztery kafelki danych pod nim. Link Kontakt w całej górnej nawigacji jest zwykłym linkiem, bez ramki.

## Wspólne dopracowanie wyglądu

`polish.css` ujednolica odstępy, przyciski, pola formularzy, nagłówki sekcji i stopkę, ogranicza dekoracje i respektuje preferencję ograniczenia ruchu. Strona główna pokazuje rzeczywiste zakresy Wnętrza / Architektura / Obrazy oraz pięć zdjęć w płynnej karuzeli, z odnośnikami do szczegółów. Puste miejsce na portret pozostaje. Duże sceny mają lżejsze kopie WebP; oryginały PNG zachowano.
