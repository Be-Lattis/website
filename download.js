// Relie les boutons de téléchargement à la dernière release GitHub de Lattis.
// L'API GitHub autorise les appels depuis le navigateur (CORS) ; les liens browser_download_url
// lancent directement le téléchargement. Sans release, les boutons mènent à la page des releases.
(function () {
  var T = window.LATTIS_DL || {};
  var RELEASES = 'https://github.com/Be-Lattis/lattis-app/releases';
  // Liste des releases plutôt que releases/latest, qui ignore les pré-versions (bêta).
  var API = 'https://api.github.com/repos/Be-Lattis/lattis-app/releases?per_page=10';
  var NAMES = { windows: 'Windows', mac: 'macOS', linux: 'Linux' };

  function detectOS() {
    var p = ((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '') + ' ' + navigator.userAgent;
    if (/android|iphone|ipad|ipod/i.test(p)) return null;
    if (/win/i.test(p)) return 'windows';
    if (/mac/i.test(p)) return 'mac';
    if (/linux|x11|cros/i.test(p)) return 'linux';
    return null;
  }

  function ext(name) {
    var m = /\.([A-Za-z]+)$/.exec(name);
    return m ? m[1].toLowerCase() : '';
  }

  // Ordre de préférence : premier format de data-ext, puis architecture de la machine.
  // La version portable (exécutable seul) n'est jamais le choix par défaut : l'installeur passe avant.
  function portable(a) { return /portable/i.test(a.name); }

  function pick(assets, exts) {
    assets = assets.filter(function (a) { return !portable(a); });
    var arm = /arm|aarch64/i.test(navigator.userAgent);
    for (var i = 0; i < exts.length; i++) {
      var list = assets.filter(function (a) { return ext(a.name) === exts[i].toLowerCase(); });
      if (!list.length) continue;
      var best = list.filter(function (a) { return /universal/i.test(a.name); })[0] ||
        list.filter(function (a) { return arm ? /arm|aarch64/i.test(a.name) : !/arm|aarch64/i.test(a.name); })[0];
      return best || list[0];
    }
    return null;
  }

  function size(b) { return (b / 1048576).toFixed(0) + ' Mo'; }

  var os = detectOS();
  var hero = document.getElementById('dl-hero');
  var note = document.getElementById('dl-note');
  var state = document.getElementById('dl-state');
  var cards = document.querySelectorAll('.os');
  if (os) {
    var card = document.querySelector('.os[data-os="' + os + '"]');
    if (card) card.classList.add('mine');
  }

  function fallback(msg) {
    if (state) state.textContent = msg;
    cards.forEach(function (c) {
      c.querySelector('.files').innerHTML = '<a class="btn ghost" href="' + RELEASES + '">' + (T.none || 'GitHub') + '</a>';
    });
  }

  fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
    .then(function (r) {
      if (!r.ok) throw 'error';
      return r.json();
    })
    .then(function (list) {
      var rel = (list || []).filter(function (x) { return !x.draft; })[0];
      if (!rel) throw 'soon';
      var assets = rel.assets || [];
      var version = rel.tag_name || rel.name || '';
      if (state) state.innerHTML = (T.version || '') + ' <strong>' + version + '</strong>' + (rel.prerelease ? ' <span class="pill">' + (T.beta || 'beta') + '</span>' : '');
      var sums = assets.filter(function (a) { return /sha256/i.test(a.name); })[0];
      var sl = document.getElementById('dl-sums');
      if (sums && sl) { sl.href = sums.browser_download_url; sl.hidden = false; }
      cards.forEach(function (c) {
        var exts = c.querySelector('.files').dataset.ext.split(',');
        var files = assets.filter(function (a) { return exts.some(function (e) { return ext(a.name) === e.toLowerCase(); }); });
        var box = c.querySelector('.files');
        if (!files.length) {
          box.innerHTML = '<a class="btn ghost" href="' + (rel.html_url || RELEASES) + '">' + (T.none || 'GitHub') + '</a>';
          return;
        }
        var main = pick(files, exts);
        files.sort(function (x, y) { return portable(x) - portable(y); });
        box.innerHTML = files.map(function (a) {
          return '<a class="btn' + (a === main ? '' : ' ghost') + '" href="' + a.browser_download_url + '" download>' +
            '<svg class="ico"><use href="#i-down"/></svg>' + (portable(a) ? (T.portable || 'Portable') : a.name.slice(a.name.lastIndexOf('.'))) + '<small>' + size(a.size) + '</small></a>';
        }).join('');
        var ph = c.querySelector('.porthint');
        if (ph && files.some(portable)) ph.hidden = false;
      });
      if (os && hero) {
        var card = document.querySelector('.os[data-os="' + os + '"]');
        var main = card && pick(assets, card.querySelector('.files').dataset.ext.split(','));
        if (main) {
          hero.href = main.browser_download_url;
          hero.setAttribute('download', '');
          hero.querySelector('span').textContent = (T.for || '{os}').replace('{os}', NAMES[os]);
          if (note) note.firstChild.textContent = version + ' · ' + main.name + ' · ';
        }
      }
    })
    .catch(function (e) { fallback(e === 'soon' ? T.soon : T.error); });
})();
