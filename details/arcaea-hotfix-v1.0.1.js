(function(){
'use strict';
if (window.__YMKF_ARCAEA_COVER_SAFE_V101__) return;
window.__YMKF_ARCAEA_COVER_SAFE_V101__ = true;

function isWikiFallbackUrl(u){
  var s = String(u || '').toLowerCase();
  return s.indexOf('static.wikia.nocookie.net') >= 0 ||
         s.indexOf('fandom.com') >= 0 ||
         s.indexOf('wikia.nocookie.net') >= 0;
}

function safeText(v){
  return String(v == null ? '' : v);
}

function htmlEscape(s){
  if (typeof esc === 'function') return esc(s);
  return safeText(s).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

function allRows(d){
  var out = [];
  var lists = [d && d.scores, d && d.best50, d && d.best30, d && d.recent];
  for (var i=0; i<lists.length; i++) {
    if (!Array.isArray(lists[i])) continue;
    for (var j=0; j<lists[i].length; j++) if (lists[i][j]) out.push(lists[i][j]);
  }
  return out;
}

function sanitizeAndPropagateCovers(d){
  if (!d) return false;
  var rows = allRows(d);
  var changed = false;
  var bySong = Object.create(null);

  // The old page-level repair used Fandom page thumbnails. Those can be an
  // article image instead of the song jacket, so never trust them here.
  for (var i=0; i<rows.length; i++) {
    var r = rows[i];
    if (r.jacketUrl && isWikiFallbackUrl(r.jacketUrl)) {
      r.jacketUrl = '';
      changed = true;
    }
  }

  // Use only an already-known jacket from the exact same songId. Difficulty
  // does not change the Arcaea song jacket, so this is safe across charts.
  for (var j=0; j<rows.length; j++) {
    var x = rows[j];
    var sid = safeText(x.songId).trim().toLowerCase();
    var u = safeText(x.jacketUrl).trim();
    if (!sid || !u || isWikiFallbackUrl(u)) continue;
    if (!bySong[sid]) bySong[sid] = u;
  }

  for (var k=0; k<rows.length; k++) {
    var y = rows[k];
    var key = safeText(y.songId).trim().toLowerCase();
    if (!key || y.jacketUrl || !bySong[key]) continue;
    y.jacketUrl = bySong[key];
    changed = true;
  }
  return changed;
}

// Replace every previous hydrator, including the old Fandom repair wrapper.
// Missing jackets remain placeholders instead of showing a wrong picture.
window.hydrateArcaeaCovers = async function(d){
  return sanitizeAndPropagateCovers(d);
};
try { hydrateArcaeaCovers = window.hydrateArcaeaCovers; } catch (_) {}

window.ymkfArcJacketError = function(img){
  if (!img) return;
  var extra = img.classList && img.classList.contains('card-jacket') ? ' card-jacket' : '';
  img.outerHTML = '<div class="song-jacket jacket-placeholder' + extra + '">♫</div>';
};

window.jacketHtml = function(x, extra){
  extra = extra || '';
  var u = safeText(x && x.jacketUrl).trim();
  var sid = safeText(x && x.songId);
  var title = safeText(x && (x.title || x.songId));
  if (!u || isWikiFallbackUrl(u)) {
    return '<div class="song-jacket jacket-placeholder ' + htmlEscape(extra) + '" data-arc-songid="' + htmlEscape(sid) + '" data-arc-title="' + htmlEscape(title) + '">♫</div>';
  }
  return '<img class="song-jacket ' + htmlEscape(extra) + '" src="' + htmlEscape(u) + '" data-arc-songid="' + htmlEscape(sid) + '" data-arc-title="' + htmlEscape(title) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="ymkfArcJacketError(this)">';
};
try { jacketHtml = window.jacketHtml; } catch (_) {}

function applyLayout(){
  var grid = document.getElementById('b30grid');
  if (grid) grid.classList.add('ymkf-arcaea-b50-five');
}

function rerenderIfReady(){
  try {
    if (window.DATA) {
      sanitizeAndPropagateCovers(window.DATA);
      if (typeof renderHero === 'function') renderHero();
      if (typeof renderScores === 'function') renderScores();
      if (typeof renderRecent === 'function') renderRecent();
    }
  } catch (_) {}
  applyLayout();
}

if (!document.getElementById('ymkf-arcaea-cover-safe-v101-style')) {
  var st = document.createElement('style');
  st.id = 'ymkf-arcaea-cover-safe-v101-style';
  st.textContent =
    '#b30grid.ymkf-arcaea-b50-five{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:10px!important;}' +
    '#b30grid.ymkf-arcaea-b50-five>.score-card{min-width:0!important;}' +
    '@media(max-width:1050px){#b30grid.ymkf-arcaea-b50-five{grid-template-columns:repeat(4,minmax(0,1fr))!important;}}' +
    '@media(max-width:850px){#b30grid.ymkf-arcaea-b50-five{grid-template-columns:repeat(3,minmax(0,1fr))!important;}}' +
    '@media(max-width:620px){#b30grid.ymkf-arcaea-b50-five{grid-template-columns:repeat(2,minmax(0,1fr))!important;}}' +
    '@media(max-width:420px){#b30grid.ymkf-arcaea-b50-five{grid-template-columns:1fr!important;}}';
  document.head.appendChild(st);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', rerenderIfReady);
} else {
  rerenderIfReady();
}
setTimeout(rerenderIfReady, 250);
setTimeout(rerenderIfReady, 1000);
})();
