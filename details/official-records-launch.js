/* YMKF_OFFICIAL_RECORDS_V1. Launch URLs verified from official web clients, 2026-09-28.
 * https://camp.qq.com/h5/webdist/sdk/camp-launch-app/camp-launch-app.latest.min.js
 * https://xianhua.sanguosha.cn/_nuxt/navigateUtil.83448a91.js
 */
(() => {
  'use strict';
  if (window.__ymkfOfficialRecordsV1) return;
  window.__ymkfOfficialRecordsV1 = true;
  const apps = {
    hok: { name: '王者营地', game: '王者荣耀', ios: 'smobagamehelper://infonews', android: 'smobagamehelper://welcome', web: 'https://pvp.qq.com/cp/a20221214jsmh/', store: 'https://apps.apple.com/cn/app/id1102305688' },
    sgs: { name: '三国咸话', game: '三国杀', ios: 'xh1550872727://', android: 'xh://app:8080/xh', web: 'https://hi.sanguosha.cn/pc/index.html', store: 'https://apps.apple.com/cn/app/id1550872727' }
  };
  const ios = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const mobile = ios || /Android/i.test(navigator.userAgent);
  const embedded = /MicroMessenger/i.test(navigator.userAgent);
  const page = document.getElementById('official-records-page');
  let timer = null;
  function clearAttempt() { if (timer !== null) { clearTimeout(timer); timer = null; } }
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearAttempt(); });
  window.addEventListener('pagehide', clearAttempt);
  function showHint(text) { const hint = document.getElementById('launch-status'); if (hint) hint.textContent = text; }
  function launch(key, fallback) {
    const app = apps[key];
    if (!app || !mobile) return;
    clearAttempt();
    // Use the official entry confirmed working on the owner's phone.
    if (key === 'sgs') { window.location.href = app.web; return; }
    if (embedded) {
      if (!page) { window.location.href = fallback; return; }
      showHint('请使用右上角菜单，在系统浏览器中打开本页，再点击打开 App。'); return;
    }
    showHint('正在尝试打开' + app.name + '…');
    timer = setTimeout(() => {
      timer = null;
      if (document.hidden) return;
      if (page) showHint('如果 App 没有打开，请确认已安装，或在系统浏览器中重试。');
      else window.location.href = fallback;
    }, 2200);
    // Keep the navigation inside the user's click to preserve browser user activation.
    window.location.href = ios ? app.ios : app.android;
  }
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !mobile) return;
    const a = event.target.closest && event.target.closest('a[href]');
    if (!a) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !url.pathname.endsWith('/details/official-records.html')) return;
    const key = url.searchParams.get('app');
    if (!apps[key]) return;
    event.preventDefault(); url.searchParams.set('retry', '1');
    launch(key, url.href);
  });
  if (page) {
    const requested = new URLSearchParams(location.search).get('app');
    if (requested === 'delta') document.querySelector('[data-app="delta"]').classList.add('selected');
    for (const [key, app] of Object.entries(apps)) {
      const card = document.querySelector('[data-app="' + key + '"]');
      if (key === requested) card.classList.add('selected');
      const link = card.querySelector('.official-link');
      link.href = app.web;
      if (mobile) link.addEventListener('click', event => {
        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault(); launch(key, location.href);
      });
    }
    if (embedded) showHint('请在系统浏览器中打开本页，再点击打开 App。');
  }
})();
