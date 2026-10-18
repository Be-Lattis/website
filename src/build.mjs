// Génère une page statique par langue à partir de template.html et des fichiers i18n/*.json.
// Usage : node src/build.mjs (depuis la racine du dépôt). Le français est servi à la racine.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const src = dirname(fileURLToPath(import.meta.url));
const root = join(src, '..');
const langs = ['fr', 'en', 'zh', 'es', 'de'];
const def = 'fr';
const tpl = readFileSync(join(src, 'template.html'), 'utf8');
const dict = Object.fromEntries(langs.map(l => [l, JSON.parse(readFileSync(join(src, 'i18n', l + '.json'), 'utf8'))]));
const path = l => (l === def ? '' : l + '/');

// Toutes les langues doivent avoir les mêmes clés que le français.
for (const l of langs) {
  const miss = Object.keys(dict[def]).filter(k => !(k in dict[l]));
  if (miss.length) throw new Error(`${l}: clés manquantes ${miss.join(', ')}`);
}

const alternates = langs.map(l => `<link rel="alternate" hreflang="${l}" href="https://lattis.be/${path(l)}">`)
  .concat(`<link rel="alternate" hreflang="x-default" href="https://lattis.be/">`).join('\n');

// Sur la page par défaut, renvoie vers la langue du navigateur au premier passage seulement.
const redirect = `<script>(function(){try{var s=localStorage.getItem('lattis-lang');if(s)return;var n=(navigator.language||'').slice(0,2).toLowerCase();if(['en','zh','es','de'].indexOf(n)>=0)location.replace(n+'/'+location.hash)}catch(e){}})();</script>`;

for (const l of langs) {
  const d = dict[l];
  const base = l === def ? '' : '../';
  const link = (o, cls) => `<a${cls ? ` class="${cls}"` : ''} href="${base}${path(o)}" hreflang="${o}" lang="${o}" data-lang="${o}"${o === l ? ' aria-current="true"' : ''}>${dict[o]['lang.name']}</a>`;
  const vars = {
    ...d,
    lang: l === 'zh' ? 'zh-Hans' : l,
    langCode: l.toUpperCase(),
    locale: d['lang.locale'],
    base,
    path: path(l),
    alternates,
    redirect: l === def ? redirect : '',
    langMenu: langs.map(o => link(o)).join(''),
    langList: langs.map(o => link(o)).join(''),
  };
  const html = tpl.replace(/\{\{([\w.]+)\}\}/g, (m, k) => {
    if (!(k in vars)) throw new Error(`${l}: clé inconnue ${k}`);
    return vars[k];
  });
  const out = join(root, path(l), 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log('écrit', out);
}
