# Site public de Lattis

Site statique publié sur https://www.lattis.be par GitHub Pages (`.github/workflows/pages.yml`).

Le site existe en cinq langues : français (racine), anglais (`en/`), chinois (`zh/`), espagnol (`es/`) et allemand (`de/`). Les pages `index.html` sont générées, ne pas les modifier à la main :

- la structure est dans `src/template.html` ;
- les textes sont dans `src/i18n/<langue>.json` (toutes les langues ont les mêmes clés) ;
- `node src/build.mjs` régénère les cinq pages, à lancer puis committer après chaque modification.

La vidéo « Lattis en 2 minutes » est dans `assets/video/<langue>/` (`lattis-2-minutes.mp4` en 720p, `poster.jpg`, `sous-titres.vtt`) : une page prend la vidéo de sa langue si elle existe, sinon l'anglaise. Pour en ajouter une, déposer ces trois fichiers et ajouter la langue à `videoLangs` dans `src/build.mjs`. Les autres vidéos sont encore des emplacements réservés (`.video` dans le gabarit).

## Licences

- **Code du site** (HTML, CSS, JavaScript, `src/build.mjs`) : licence MIT, voir [LICENSE](LICENSE).
- **Textes, captures d'écran et images** (`src/i18n/`, `assets/*.png`) : [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/deed.fr). Réutilisation libre en citant « Be Lattis » et un lien vers https://www.lattis.be.
- **Marques et logos** : les noms « Lattis » et « Be Lattis », l'icône de l'application et le logo de l'entreprise (`assets/*.svg`, `favicon.svg`) ne sont pas couverts par ces licences. Vous pouvez les utiliser pour parler de Lattis, mais pas pour présenter un autre produit comme Lattis ou comme approuvé par Be Lattis.

Les autres dépôts du projet ont leur propre licence : l'application [lattis-app](https://github.com/Be-Lattis/lattis-app) est sous MPL-2.0, le serveur [lattis-server](https://github.com/Be-Lattis/lattis-server) sous AGPL-3.0.
