# Site public de Lattis

Site statique publié sur https://www.lattis.be par GitHub Pages (`.github/workflows/pages.yml`).

Le site existe en cinq langues : français (racine), anglais (`en/`), chinois (`zh/`), espagnol (`es/`) et allemand (`de/`). Les pages `index.html` sont générées, ne pas les modifier à la main :

- la structure est dans `src/template.html` ;
- les textes sont dans `src/i18n/<langue>.json` (toutes les langues ont les mêmes clés) ;
- `node src/build.mjs` régénère les cinq pages, à lancer puis committer après chaque modification.

Les vidéos de démonstration sont pour l'instant des emplacements réservés (`.video` dans le gabarit).
