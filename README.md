# AZIZA — strona pracowni architektonicznej

Statyczna witryna publikowana na GitHub Pages. Docelowa domena: https://www.aziza-suwiczak.pl/. Podgląd: https://jakubskrzypiec.github.io/AZIZA/.

## Praca nad stroną

Wymagany Node.js 22 lub nowszy. Bez instalowania zależności:

```sh
npm run build
npm test
node scripts/preview.mjs
```

Treści edytuj w `_source/pages/`, metadane w `_source/seo.json`, adresy w `_source/routes.json`. Builder tworzy katalogi z `index.html`, więc publiczne adresy to np. `/oferta/`, `/projekty/dom-jednorodzinny/` i `/obrazy/baletnica-w-lesie-snow/`. Pliki `.html` w katalogu głównym utrzymują dawne adresy jako przekierowania. Wygenerowane pliki są commitowane wraz ze źródłami. Test CI wykrywa rozbieżność źródeł i wygenerowanych stron.

## Zawartość i materiały

Strona główna, oferta z trzema wariantami wnętrz, 17 projektów wnętrz, 5 grup architektury, 9 autorskich obrazów, osobne Art déco, blog i kontakt. Paczka klientki z 26 października zawiera 191 grafik, film sypialni i PDF oferty. Mapowanie oryginałów: `client-materials.json`, `client-projects.json`, `client-paintings.json`. Oryginalne opisy obrazów są zachowane, poza usuniętymi metryczkami. Dziesięć prac wskazanych przez autorkę wycofano z galerii.

Pliki `assets/responsive/` to lżejsze warianty istniejących fotografii dla telefonów i mniejszych ekranów. Galerie zachowują pełne pliki do powiększenia. Atmosferyczne sceny hero i przerywników są wygenerowane; ich pochodzenie dokumentują pliki z promptami. W portfolio pozostają materiały klientki.

## Publikacja i formularz

Instrukcja DNS, aktywacji formularza i ograniczeń przekierowań GitHub Pages: [docs/PUBLIKACJA.md](docs/PUBLIKACJA.md).

Formularz korzysta z FormSubmit i wymaga aktywacji na skrzynce `izabela.suwiczak@aziza-suwiczak.pl`. Kod nie zawiera haseł. Sam test interfejsu nie potwierdza doręczenia maila; przed uruchomieniem trzeba potwierdzić odbiór wiadomości na tej skrzynce.

Metadane, canonical, sitemap.xml i dane strukturalne są przygotowane dla obecnej domeny z `www`. Plik CNAME należy ustawić przy właściwym przełączeniu DNS, zgodnie z instrukcją publikacji.
