/* YMKF CHUNITHM native recent filters + single-song push timeline v1.21.0
 * Reuses the existing recent-search, difficulty and source controls.
 * Removes the duplicate controls injected by rhythm-history-enhancer v1.19.34.
 * Shows the push timeline only after the native search resolves to exactly one song.
 */
(function () {
  'use strict';

  const MARKER = 'YMKF_CHUNI_RECENT_PUSH_V12100';
  if (window[MARKER]) return;
  window[MARKER] = true;

  const page = (location.pathname.split('/').pop() || '').toLowerCase();
  if (page !== 'chunithm.html') return;

  const q = (selector) => document.querySelector(selector);
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);

  function pageData() {
    try { return typeof DATA !== 'undefined' ? DATA : null; }
    catch (_) { return null; }
  }

  function sourceRows(data) {
    if (!data) return { rows: [], full: false };
    const full = Array.isArray(data.monthlyDetails)
      ? data.monthlyDetails.flatMap((month) => Array.isArray(month.records) ? month.records : [])
      : [];
    if (full.length) return { rows: full, full: true };
    return { rows: Array.isArray(data.recent) ? data.recent : [], full: false };
  }

  function titleOf(row) {
    return String(row && (row.title || row.songTitle || row.songName || row.name) || '').trim();
  }

  function sourceOf(row) {
    const source = String(row && row.source || '').toLowerCase();
    return source === 'rin' || source.includes('rin') ? 'rin' : 'country';
  }

  function difficultyOf(row) {
    try {
      if (typeof chuniDiffName === 'function') return chuniDiffName(row);
    } catch (_) { /* use fallback */ }
    return String(row && (row.difficultyName || row.difficultyLabel || row.difficulty || row.level) || '—');
  }

  function chartKey(row) {
    return String(row && row.id) + '|' + String(row && row.levelIndex);
  }

  function stampOf(row) {
    const raw = String(row && (row.playTime || row.dateTime || row.playedAt || row.time) || '').trim();
    const parsed = Date.parse(raw.replace(' ', 'T'));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function dedupe(rows) {
    const seen = new Set();
    const out = [];
    for (const row of rows) {
      const key = [
        String(row && row.playTime || ''), titleOf(row), chartKey(row),
        String(row && row.score), sourceOf(row)
      ].join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(row);
    }
    return out;
  }

  function scoreText(row) {
    try {
      if (typeof scoreFmt === 'function') return scoreFmt(row && row.score);
    } catch (_) { /* use fallback */ }
    return Math.round(Number(row && row.score) || 0).toLocaleString('en-US');
  }

  function shortDate(row) {
    const raw = String(row && row.playTime || '').trim();
    const match = raw.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
    return match ? `${match[1]}.${Number(match[2])}.${Number(match[3])}` : (raw ? raw.slice(0, 10) : '—');
  }

  function pushEvents(rows) {
    const sorted = [...rows].sort((a, b) => stampOf(a) - stampOf(b));
    const events = [];
    let lastKept;
    for (const row of sorted) {
      const score = Number(row && row.score);
      if (!Number.isFinite(score)) continue;
      if (lastKept === undefined) {
        events.push({ row, initial: true });
        lastKept = score;
      } else if (score > lastKept + 1e-9) {
        events.push({ row, initial: false });
        lastKept = score;
      }
    }
    return events;
  }

  function countsFor(group, data, sourceFilter) {
    const first = group[0];
    const tracks = data && Array.isArray(data.tracks) ? data.tracks : [];
    const track = tracks.find((row) => chartKey(row) === chartKey(first));
    const country = sourceFilter === 'rin' ? 0 : (track && sourceFilter === 'ALL' && Number.isFinite(Number(track.countryPlayCount))
      ? Number(track.countryPlayCount)
      : group.filter((row) => sourceOf(row) === 'country').length);
    const rin = sourceFilter === 'country' ? 0 : (track && sourceFilter === 'ALL' && Number.isFinite(Number(track.rinPlayCount))
      ? Number(track.rinPlayCount)
      : (track && sourceFilter === 'ALL' && Number.isFinite(Number(track.playCount))
        ? Number(track.playCount)
        : group.filter((row) => sourceOf(row) === 'rin').length));
    return { country, rin };
  }

  function renderTimeline(rows, data, full, sourceFilter, panel) {
    const groups = new Map();
    for (const row of rows) {
      const key = chartKey(row);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(row);
    }

    const orderedGroups = [...groups.values()].sort((a, b) =>
      difficultyOf(a[0]).localeCompare(difficultyOf(b[0]), 'zh-CN', { numeric: true })
    );

    const note = q('#ymkfChuniPushNoteV12100');
    const body = q('#ymkfChuniPushTrackV12100');
    if (!note || !body) return;

    const sourceLabel = sourceFilter === 'rin' ? 'RIN 服' : sourceFilter === 'country' ? '国服' : '国服 + RIN';
    note.textContent = `${full ? '完整历史' : '当前最近记录'} · ${sourceLabel} · ${orderedGroups.length} 个难度/谱面`;

    body.innerHTML = orderedGroups.map((group) => {
      const events = pushEvents(group);
      const cards = events.map((event) => `
        <div class="ymkf-push-item ${event.initial ? 'initial' : ''}">
          <small>${esc(shortDate(event.row))}${event.initial ? ' · 初见' : ''}</small>
          <b>${esc(scoreText(event.row))}</b>
        </div>`).join('');
      const pushes = events.filter((event) => !event.initial).length;
      const counts = countsFor(group, data, sourceFilter);
      return `
        <div class="ymkf-diff-row">
          <div class="ymkf-diff-head">
            <div><b>${esc(difficultyOf(group[0]))}</b>
              <span>国服 ${counts.country} 次 · RIN ${counts.rin} 次 · 合计 ${counts.country + counts.rin} 次</span>
            </div>
            <small>初见 1 · 推分 ${pushes}</small>
          </div>
          <div class="ymkf-push-track">${cards || '<div class="ymkf-push-empty">暂无可用分数记录</div>'}</div>
        </div>`;
    }).join('') || '<div class="ymkf-push-empty">没有匹配难度记录</div>';
  }

  function addStyles() {
    if (q('#ymkfChuniPushStyleV12100')) return;
    const style = document.createElement('style');
    style.id = 'ymkfChuniPushStyleV12100';
    style.textContent = `
      #ymkfChuniPushV12100[hidden]{display:none!important}
      #ymkfChuniPushV12100{margin:10px 0 14px;border:1px solid var(--line);background:var(--panel2,var(--surface2));border-radius:14px;padding:12px}
      #ymkfChuniPushV12100 .ymkf-push-head{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:9px}
      #ymkfChuniPushV12100 .ymkf-push-title{font-weight:900}
      #ymkfChuniPushV12100 .ymkf-push-note{font-size:11px;color:var(--muted)}
      #ymkfChuniPushV12100 .ymkf-diff-row{border-top:1px solid var(--line);padding:11px 0 4px}
      #ymkfChuniPushV12100 .ymkf-diff-row:first-child{border-top:0}
      #ymkfChuniPushV12100 .ymkf-diff-head{display:flex;justify-content:space-between;gap:12px;margin-bottom:8px}
      #ymkfChuniPushV12100 .ymkf-diff-head>div{display:flex;gap:10px;flex-wrap:wrap}
      #ymkfChuniPushV12100 .ymkf-diff-head span,#ymkfChuniPushV12100 .ymkf-diff-head small{color:var(--muted);font-size:11px}
      #ymkfChuniPushV12100 .ymkf-push-track{display:flex;gap:8px;overflow:auto}
      #ymkfChuniPushV12100 .ymkf-push-item{flex:0 0 auto;min-width:150px;border:1px solid var(--line);border-radius:11px;padding:9px 10px;background:rgba(255,255,255,.035)}
      #ymkfChuniPushV12100 .ymkf-push-item.initial{border-color:rgba(95,225,255,.35)}
      #ymkfChuniPushV12100 .ymkf-push-item small{display:block;color:var(--muted);font-size:10px}
      #ymkfChuniPushV12100 .ymkf-push-item b{display:block;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:14px}
      #ymkfChuniPushV12100 .ymkf-push-empty{color:var(--muted);padding:5px 0;font-size:12px}
      @media(max-width:650px){#ymkfChuniPushV12100 .ymkf-push-head,#ymkfChuniPushV12100 .ymkf-diff-head{flex-direction:column;align-items:flex-start}}
    `;
    document.head.appendChild(style);
  }

  function install() {
    const data = pageData();
    const search = q('#recentSearch');
    const difficulty = q('#recentDifficultyFilter');
    const source = q('#recentSourceFilter');
    const body = q('#recentBody');
    const table = body && body.closest('.table-wrap');
    if (!data || !search || !difficulty || !source || !table) return false;

    const oldHost = q('#ymkfHistoryTools');
    if (!oldHost && !q('#ymkfChuniPushV12100') && tries < 250) return false;
    if (oldHost) oldHost.remove();

    addStyles();
    let panel = q('#ymkfChuniPushV12100');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'ymkfChuniPushV12100';
      panel.hidden = true;
      panel.innerHTML = `
        <div class="ymkf-push-head">
          <div class="ymkf-push-title">推分记录 · 保留初见，之后只记录比上一条推分更高</div>
          <div id="ymkfChuniPushNoteV12100" class="ymkf-push-note"></div>
        </div>
        <div id="ymkfChuniPushTrackV12100"></div>`;
      table.parentNode.insertBefore(panel, table);
    }

    if (!panel.dataset.bound) {
      const update = () => window.setTimeout(updatePanel, 0);
      search.addEventListener('input', update);
      search.addEventListener('change', update);
      difficulty.addEventListener('change', update);
      source.addEventListener('change', update);
      panel.dataset.bound = '1';
    }

    updatePanel();
    return true;
  }

  function updatePanel() {
    const panel = q('#ymkfChuniPushV12100');
    const search = q('#recentSearch');
    const difficulty = q('#recentDifficultyFilter');
    const source = q('#recentSourceFilter');
    const data = pageData();
    if (!panel || !search || !difficulty || !source || !data) return;

    const query = String(search.value || '').trim().toLocaleLowerCase();
    if (!query) { panel.hidden = true; return; }

    const src = sourceRows(data);
    let rows = dedupe(src.rows).filter((row) => titleOf(row).toLocaleLowerCase().includes(query));
    const sourceFilter = source.value || 'ALL';
    if (sourceFilter !== 'ALL') rows = rows.filter((row) => sourceOf(row) === sourceFilter);
    const difficultyFilter = difficulty.value || 'ALL';
    if (difficultyFilter !== 'ALL') rows = rows.filter((row) => difficultyOf(row) === difficultyFilter);

    const songTitles = [...new Set(rows.map(titleOf).filter(Boolean))];
    if (songTitles.length !== 1) { panel.hidden = true; return; }

    const selectedTitle = songTitles[0];
    const songRows = rows.filter((row) => titleOf(row) === selectedTitle);
    if (!songRows.length) { panel.hidden = true; return; }

    panel.hidden = false;
    const titleNode = panel.querySelector('.ymkf-push-title');
    if (titleNode) titleNode.textContent = `推分记录 · ${selectedTitle} · 保留初见，之后只记录更高分`;
    renderTimeline(songRows, data, src.full, sourceFilter, panel);
  }

  let tries = 0;
  const timer = window.setInterval(() => {
    tries += 1;
    if (install() || tries > 300) window.clearInterval(timer);
  }, 100);
})();
