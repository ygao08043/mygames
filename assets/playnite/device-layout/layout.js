/* YMKF_WORKS_LAYOUT_ONLY_V1 — works navigation only; contains no personal-device data. */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var tabs = document.querySelector('.topbar .tabs');
  var shell = document.querySelector('.shell');
  if (!tabs || !shell || window.__YMKF_WORKS_LAYOUT_ONLY_V1) return;
  window.__YMKF_WORKS_LAYOUT_ONLY_V1 = true;

  function activate(id) {
    tabs.querySelectorAll('.tab').forEach(function (button) {
      var active = button.dataset.page === id;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('main.page').forEach(function (page) {
      page.classList.toggle('active', page.id === id);
    });
  }

  var specs = [
    ['animation', '动画'],
    ['anime', '动漫'],
    ['tv', '电视剧'],
    ['movies', '电影'],
    ['manga', '漫画'],
    ['books', '读物']
  ];

  var works = document.getElementById('works');
  if (!works) works = document.createElement('main');
  works.id = 'works';
  works.className = 'page';
  works.innerHTML =
    '<section class="intro"><h1>已阅作品</h1></section>' +
    '<nav class="works-nav" aria-label="作品分类"></nav>' +
    '<div class="works-panels"></div>';

  var nav = works.querySelector('.works-nav');
  var panels = works.querySelector('.works-panels');

  specs.forEach(function (spec, index) {
    var id = spec[0];
    var label = spec[1];
    var page = document.getElementById(id);
    if (!page) return;

    page.classList.remove('page', 'active');
    page.classList.add('work-panel');
    page.hidden = index !== 0;
    var intro = page.querySelector('.intro');
    if (intro) intro.remove();
    panels.appendChild(page);

    var button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.className = 'work-tab';
    button.setAttribute('aria-pressed', String(index === 0));
    button.addEventListener('click', function () {
      panels.querySelectorAll('.work-panel').forEach(function (panel) {
        panel.hidden = panel.id !== id;
      });
      nav.querySelectorAll('.work-tab').forEach(function (tab) {
        tab.setAttribute('aria-pressed', String(tab === button));
      });
    });
    nav.appendChild(button);
  });

  var books = works.querySelector('#books');
  if (books && !books.querySelector('.reading-note')) {
    var note = document.createElement('p');
    note.className = 'reading-note';
    note.textContent = '各种刊物/普及教育类丛书不计。';
    books.appendChild(note);
  }

  var footer = shell.querySelector('.footer');
  shell.insertBefore(works, footer || null);

  /* Hide the legacy DEVICE selector while retaining the existing game data and renderers. */
  if (typeof currentValues === 'function') {
    var originalCurrentValues = currentValues;
    currentValues = function () {
      return originalCurrentValues().filter(function (value) {
        return value !== 'DEVICE';
      });
    };
  }
  if (typeof selected !== 'undefined' && selected === 'DEVICE') selected = 'ALL';

  tabs.innerHTML = '';
  [['games', '游戏战绩'], ['works', '已阅作品']].forEach(function (item) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'tab';
    button.dataset.page = item[0];
    button.textContent = item[1];
    button.addEventListener('click', function () { activate(item[0]); });
    tabs.appendChild(button);
  });

  if (!document.getElementById('ymkf-works-layout-style')) {
    var style = document.createElement('style');
    style.id = 'ymkf-works-layout-style';
    style.textContent =
      '.work-panel[hidden]{display:none!important}' +
      '.works-nav{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 24px}' +
      '.work-tab{padding:9px 17px;border:1px solid var(--line);border-radius:999px;background:transparent;color:var(--muted);cursor:pointer;font:inherit;font-size:14px}' +
      '.work-tab[aria-pressed=true]{background:var(--text);color:var(--bg);border-color:var(--text)}' +
      '.reading-note{margin:30px 0 10px;font-size:13px;color:var(--muted)}';
    document.head.appendChild(style);
  }

  if (typeof renderAll === 'function') renderAll();
  activate('games');
});
