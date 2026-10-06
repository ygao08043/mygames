(function(){
'use strict';
var VERSION = '1.0.0';
var HOTFIX_CLASS = 'ymkf-arcaea-b50-five';
var dataCache = null;

function normalizeText(v){
  var s = String(v == null ? '' : v);
  try { s = s.normalize('NFKC'); } catch(e) {}
  s = s.replace(/\s+/g, ' ').trim().toLowerCase();
  return s;
}

function normalizeDiff(v){
  if (v == null) return '';
  var s = normalizeText(v).replace(/[^a-z0-9\u4e00-\u9fff]+/g, '');
  if (s === '') return '';
  if (s === '0' || s === 'pst' || s === 'past') return 'PST';
  if (s === '1' || s === 'prs' || s === 'present') return 'PRS';
  if (s === '2' || s === 'ftr' || s === 'future') return 'FTR';
  if (s === '3' || s === 'byd' || s === 'beyond') return 'BYD';
  if (s === '4' || s === 'etr' || s === 'etrinity' || s === 'eternity') return 'ETR';
  if (s.indexOf('past') >= 0) return 'PST';
  if (s.indexOf('present') >= 0) return 'PRS';
  if (s.indexOf('future') >= 0) return 'FTR';
  if (s.indexOf('beyond') >= 0) return 'BYD';
  if (s.indexOf('etr') >= 0 || s.indexOf('eternity') >= 0) return 'ETR';
  if (s.indexOf('pst') >= 0) return 'PST';
  if (s.indexOf('prs') >= 0) return 'PRS';
  if (s.indexOf('ftr') >= 0) return 'FTR';
  if (s.indexOf('byd') >= 0) return 'BYD';
  return '';
}

function hasImageLike(s){
  if (!s) return false;
  s = String(s);
  return /\.(png|jpg|jpeg|webp|gif|avif)(\?|#|$)/i.test(s) || s.indexOf('data:image/') === 0 || s.indexOf('http://') === 0 || s.indexOf('https://') === 0 || s.indexOf('./') === 0 || s.indexOf('../') === 0 || s.indexOf('/assets/') === 0;
}

function firstImageValue(obj){
  if (!obj || typeof obj !== 'object') return '';
  var fields = ['jacket','jacketUrl','jacket_url','cover','coverUrl','cover_url','image','imageUrl','image_url','art','artUrl','art_url','illustration','illustrationUrl','img','imgUrl','asset','assetUrl','thumb','thumbnail'];
  for (var i=0;i<fields.length;i++){
    var v = obj[fields[i]];
    if (typeof v === 'string' && hasImageLike(v)) return v;
  }
  if (obj.song && typeof obj.song === 'object') {
    var nested = firstImageValue(obj.song);
    if (nested) return nested;
  }
  if (obj.meta && typeof obj.meta === 'object') {
    var nestedMeta = firstImageValue(obj.meta);
    if (nestedMeta) return nestedMeta;
  }
  return '';
}

function objectValues(obj){
  var out = [];
  if (!obj || typeof obj !== 'object') return out;
  for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj,k)) out.push(obj[k]);
  return out;
}

function buildDataMap(){
  if (dataCache) return dataCache;
  var roots = [];
  var candidates = ['DATA','ARCAEA_DATA','__ARCAEA_DATA__','data'];
  for (var i=0;i<candidates.length;i++) {
    try {
      if (window[candidates[i]]) roots.push(window[candidates[i]]);
    } catch(e) {}
  }
  var byTitleDiff = {};
  var byTitle = {};
  var visited = [];

  function seen(o){
    for (var i=0;i<visited.length;i++) if (visited[i] === o) return true;
    visited.push(o);
    return false;
  }

  function addEntry(title, diff, img){
    if (!title || !img) return;
    var t = normalizeText(title);
    if (!t) return;
    var d = normalizeDiff(diff);
    var td = t + '||' + d;
    var candidate = { title: title, diff: d, img: img };
    if (!byTitle[t] || String(img).length > String(byTitle[t].img || '').length) byTitle[t] = candidate;
    if (d && (!byTitleDiff[td] || String(img).length > String(byTitleDiff[td].img || '').length)) byTitleDiff[td] = candidate;
  }

  function walk(node, depth){
    if (!node || depth > 8) return;
    var t = typeof node;
    if (t !== 'object') return;
    if (seen(node)) return;

    if (Object.prototype.toString.call(node) === '[object Array]') {
      for (var i=0;i<node.length;i++) walk(node[i], depth + 1);
      return;
    }

    var title = node.title || node.name || node.songTitle || node.musicName;
    var diff = node.difficulty || node.diff || node.difficultyName || node.chart || node.levelClass || node.className || node.levelType;
    var img = firstImageValue(node);
    if (title && img) addEntry(title, diff, img);

    var values = objectValues(node);
    for (var j=0;j<values.length;j++) walk(values[j], depth + 1);
  }

  for (var r=0;r<roots.length;r++) walk(roots[r], 0);
  dataCache = { byTitleDiff: byTitleDiff, byTitle: byTitle };
  return dataCache;
}

function closestCard(el){
  var cur = el;
  var steps = 0;
  while (cur && cur !== document.body && steps < 6) {
    if (cur.querySelector) {
      var imgs = cur.querySelectorAll('img').length;
      var txt = (cur.innerText || '').trim();
      if (imgs >= 1 && txt.length >= 2) return cur;
    }
    cur = cur.parentElement;
    steps++;
  }
  return el && el.parentElement ? el.parentElement : el;
}

function looksLikeTrackTitle(s){
  if (!s) return false;
  s = String(s).trim();
  if (s.length < 2 || s.length > 120) return false;
  if (/^(rating|ptt|score|play|recent|best|history|b30|b50|r10|new|track)$/i.test(s)) return false;
  if (/^[\d,.]+$/.test(s)) return false;
  return true;
}

function findTitleInCard(card){
  if (!card || !card.querySelectorAll) return '';
  var selectors = ['[data-title]','.song-title','.track-title','.title','.card-title','.music-title','.record-title','b','strong','h1','h2','h3','h4','h5'];
  var best = '';
  for (var s=0;s<selectors.length;s++) {
    var nodes = card.querySelectorAll(selectors[s]);
    for (var i=0;i<nodes.length;i++) {
      var t = nodes[i].getAttribute && nodes[i].getAttribute('data-title') ? nodes[i].getAttribute('data-title') : (nodes[i].textContent || '');
      t = t.replace(/\s+/g,' ').trim();
      if (looksLikeTrackTitle(t) && t.length > best.length) best = t;
    }
  }
  if (!best) {
    var text = (card.innerText || '').split(/\n+/);
    for (var j=0;j<text.length;j++) {
      var line = String(text[j]).replace(/\s+/g,' ').trim();
      if (looksLikeTrackTitle(line) && line.length > best.length) best = line;
    }
  }
  return best;
}

function findDiffInCard(card){
  var text = (card && card.innerText ? card.innerText : '');
  var m = text.match(/\b(PST|PRS|FTR|BYD|ETR|PAST|PRESENT|FUTURE|BEYOND|ETERNITY)\b/i);
  return m ? normalizeDiff(m[1]) : '';
}

function patchTrackImages(scope){
  var maps = buildDataMap();
  if (!maps) return;
  var imgs = (scope || document).querySelectorAll('img');
  for (var i=0;i<imgs.length;i++) {
    var img = imgs[i];
    var card = closestCard(img);
    var title = findTitleInCard(card);
    if (!title) continue;
    var diff = findDiffInCard(card);
    var key = normalizeText(title) + '||' + normalizeDiff(diff);
    var row = maps.byTitleDiff[key] || maps.byTitle[normalizeText(title)];
    if (!row || !row.img) continue;
    if (img.getAttribute('src') !== row.img) {
      img.setAttribute('src', row.img);
      img.setAttribute('data-ymkf-arcaea-fixed', '1');
      if (!img.getAttribute('loading')) img.setAttribute('loading','lazy');
      img.style.objectFit = 'cover';
      img.style.objectPosition = 'center center';
    }
  }
}

function applyFiveGrid(el){
  if (!el) return;
  if (el.classList) el.classList.add(HOTFIX_CLASS);
}

function sectionHeadingNodes(){
  return document.querySelectorAll('h1,h2,h3,h4,h5,.section-title,.panel-title,.title');
}

function forceB50Layout(){
  var all = sectionHeadingNodes();
  for (var i=0;i<all.length;i++) {
    var txt = (all[i].textContent || '').replace(/\s+/g,' ').trim();
    if (!/\b(b50|best ?50)\b/i.test(txt)) continue;
    var parent = all[i].parentElement;
    var candidates = [];
    if (parent) {
      var next = parent.nextElementSibling;
      if (next) candidates.push(next);
      var sibs = parent.parentElement ? parent.parentElement.children : [];
      for (var s=0;s<sibs.length;s++) {
        if (sibs[s] !== parent) candidates.push(sibs[s]);
      }
    }
    for (var c=0;c<candidates.length;c++) {
      var node = candidates[c];
      if (!node || !node.children || node.children.length < 5) continue;
      var imgCount = node.querySelectorAll ? node.querySelectorAll('img').length : 0;
      if (imgCount < 5) continue;
      applyFiveGrid(node);
      return;
    }
  }

  var selectorFallbacks = ['[class*="b50"]','[id*="b50"]','.best50','.best-50','.best-grid','.record-grid','.records-grid','.top50-grid'];
  for (var f=0;f<selectorFallbacks.length;f++) {
    var list = document.querySelectorAll(selectorFallbacks[f]);
    for (var j=0;j<list.length;j++) {
      var el = list[j];
      var imgCount = el.querySelectorAll ? el.querySelectorAll('img').length : 0;
      if (el.children && el.children.length >= 5 && imgCount >= 5) applyFiveGrid(el);
    }
  }
}

function installStyle(){
  if (document.getElementById('ymkf-arcaea-hotfix-style')) return;
  var style = document.createElement('style');
  style.id = 'ymkf-arcaea-hotfix-style';
  style.textContent = '' +
    '.' + HOTFIX_CLASS + '{display:grid !important;grid-template-columns:repeat(5,minmax(0,1fr)) !important;gap:12px !important;align-items:stretch !important;}' +
    '.' + HOTFIX_CLASS + ' > *{min-width:0 !important;}' +
    '@media (max-width:1400px){.' + HOTFIX_CLASS + '{grid-template-columns:repeat(4,minmax(0,1fr)) !important;}}' +
    '@media (max-width:1100px){.' + HOTFIX_CLASS + '{grid-template-columns:repeat(3,minmax(0,1fr)) !important;}}' +
    '@media (max-width:800px){.' + HOTFIX_CLASS + '{grid-template-columns:repeat(2,minmax(0,1fr)) !important;}}' +
    '@media (max-width:520px){.' + HOTFIX_CLASS + '{grid-template-columns:repeat(1,minmax(0,1fr)) !important;}}';
  document.head.appendChild(style);
}

function run(){
  installStyle();
  forceB50Layout();
  patchTrackImages(document);
}

var scheduled = false;
function scheduleRun(){
  if (scheduled) return;
  scheduled = true;
  setTimeout(function(){ scheduled = false; run(); }, 80);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleRun);
} else {
  scheduleRun();
}
window.addEventListener('load', scheduleRun);
setTimeout(scheduleRun, 600);
setTimeout(scheduleRun, 1500);

var observer = new MutationObserver(function(){ scheduleRun(); });
observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
})();
