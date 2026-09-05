/* YMKF rhythm recent-history enhancer v1.19.23
 * CHUNITHM / maimai / Arcaea
 * - recent-record song + difficulty filtering
 * - strict push: only a play whose metric is higher than the immediately previous play on the same chart
 * - one row per difficulty/chart, with play counts
 * - CHUNITHM counts split country/RIN and current-record detail stays record-first
 */
(function(){
'use strict';
const page=(location.pathname.split('/').pop()||'').toLowerCase();
if(!['chunithm.html','maimai.html','arcaea.html'].includes(page))return;
const kind=page.replace('.html','');
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const N=(x,d=0)=>Number.isFinite(Number(x))?Number(x):d;
const q=s=>document.querySelector(s);
function pageData(){try{return typeof DATA!=='undefined'?DATA:null}catch(_){return null}}
function isRecordArray(v){
  if(!Array.isArray(v)||!v.length)return false;
  const sample=v.slice(0,Math.min(12,v.length));
  return sample.some(x=>x&&typeof x==='object'&&(x.title||x.songTitle||x.songName||x.song_name||x.name)&&(x.playTime||x.dateTime||x.timePlayed||x.playedAt||x.userPlayDate||x.timestamp||x.time||x.date));
}
function sourceRows(d){
  if(!d)return {rows:[],full:false,label:'暂无历史'};
  if(kind==='chunithm'){
    const full=Array.isArray(d.monthlyDetails)?d.monthlyDetails.flatMap(x=>Array.isArray(x.records)?x.records:[]):[];
    if(full.length)return {rows:full,full:true,label:'完整月度历史'};
    return {rows:Array.isArray(d.recent)?d.recent:[],full:false,label:'recent'};
  }
  // Never treat best-score tables as play history. Use explicit history arrays first,
  // otherwise use the Recent Records feed that the user is filtering on this page.
  const preferred=['history','allHistory','allScoresHistory','playHistory','records','details'];
  for(const k of preferred){const v=d[k];if(isRecordArray(v))return {rows:v,full:true,label:k}}
  return {rows:Array.isArray(d.recent)?d.recent:[],full:false,label:'recent'};
}
function titleOf(x){return String(x&&x.title||x&&x.songTitle||x&&x.songName||x&&x.song_name||x&&x.name||'').trim()}
function timeOf(x){return String(x&&x.playTime||x&&x.dateTime||x&&x.timePlayed||x&&x.playedAt||x&&x.userPlayDate||x&&x.time||x&&x.date||'').trim()}
function stampOf(x){
  if(x&&Number.isFinite(Number(x.timestamp))){const n=Number(x.timestamp);return n>1e12?n:n*1000}
  const s=timeOf(x);if(!s)return 0;const t=Date.parse(s.replace(' ','T'));return Number.isFinite(t)?t:0;
}
function diffOf(x){
  try{if(kind==='chunithm'&&typeof chuniDiffName==='function')return chuniDiffName(x)}catch(_){}
  return String(x&&x.difficultyName||x&&x.difficultyLabel||x&&x.difficulty||x&&x.level||'—');
}
function typeOf(x){return kind==='maimai'?String(x&&x.songTypeName||x&&x.songType||'').trim():''}
function chartKey(x){
  if(kind==='chunithm')return String(x&&x.id)+'|'+String(x&&x.levelIndex);
  if(kind==='maimai')return String(x&&x.id)+'|'+String(x&&x.levelIndex)+'|'+typeOf(x);
  const dv=(x&&x.difficulty!=null)?x.difficulty:((x&&x.levelIndex!=null)?x.levelIndex:diffOf(x));
  return String(x&&x.songId||x&&x.id||titleOf(x))+'|'+String(dv);
}
function groupLabel(x){const d=diffOf(x);return kind==='maimai'&&typeOf(x)?`${d} · ${typeOf(x)}`:d}
function metric(x){return kind==='maimai'?N(x&&x.achievements,NaN):N(x&&x.score,NaN)}
function metricText(x){
  if(kind==='maimai')return N(x&&x.achievements).toFixed(4)+'%';
  try{if(kind==='chunithm'&&typeof scoreFmt==='function')return scoreFmt(x&&x.score);if(kind==='arcaea'&&typeof fmtScore==='function')return fmtScore(x&&x.score)}catch(_){}
  return Math.round(N(x&&x.score)).toLocaleString('en-US');
}
function shortDate(x){const s=timeOf(x);if(!s)return '—';const m=s.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);return m?`${m[1]}.${Number(m[2])}.${Number(m[3])}`:s.slice(0,10)}
function dedupe(rows){const seen=new Set(),out=[];for(const x of rows){const k=[timeOf(x),titleOf(x),chartKey(x),metric(x),String(x&&x.source||'')].join('|');if(seen.has(k))continue;seen.add(k);out.push(x)}return out}
function rowsForTitle(rows,raw){const s=String(raw||'').trim().toLowerCase();if(!s)return rows;return rows.filter(x=>titleOf(x).toLowerCase().includes(s))}
function rowsForDifficulty(rows,diff){if(!diff||diff==='ALL')return rows;return rows.filter(x=>groupLabel(x)===diff)}
function distinctTitles(rows){return [...new Set(rows.map(titleOf).filter(Boolean))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true,sensitivity:'base'}))}
function distinctDiffs(rows){return [...new Set(rows.map(groupLabel).filter(x=>x&&x!=='—'))]}
function exactTitleMatches(rows,raw){const s=String(raw||'').trim().toLowerCase();return [...new Set(rows.filter(x=>titleOf(x).toLowerCase()===s).map(titleOf))]}
function strictPushEvents(rows){
  const byChart=new Map(),events=[];
  [...rows].sort((a,b)=>stampOf(a)-stampOf(b)).forEach(x=>{
    const v=metric(x);if(!Number.isFinite(v))return;
    const k=chartKey(x),prev=byChart.get(k);
    // A first play establishes the baseline; it is not a push. Every later play is a
    // push only when it is strictly higher than the immediately previous play.
    if(prev!==undefined&&v>prev+1e-9)events.push(x);
    byChart.set(k,v);
  });
  return events;
}
function jacket(x){try{if(typeof jacketHtml==='function')return jacketHtml(x)}catch(_){}return ''}
function meaningful(v){return !(v===null||v===undefined||String(v).trim()===''||String(v).trim()==='-'||String(v).trim()==='--')}
const metaKeys=['notesTotal','noteTap','noteHold','noteSlide','noteAir','noteFlick','chartDesigner'];
function chuniBestFor(t){const d=pageData(),k=chartKey(t);return d&&Array.isArray(d.tracks)?d.tracks.find(x=>chartKey(x)===k)||t:t}
function hasChuniMeta(t){const b=chuniBestFor(t);return metaKeys.some(k=>meaningful(t&&t[k])||meaningful(b&&b[k]))}
function cDetailAvailable(t){
  if(kind!=='chunithm')return true;
  let src='';try{src=typeof sourceKey==='function'?sourceKey(t&&t.source):String(t&&t.source||'').toLowerCase()}catch(_){src=String(t&&t.source||'').toLowerCase()}
  if(src==='rin'||src==='both')return true;
  try{if(typeof chuniJudgments==='function'&&chuniJudgments(t))return true}catch(_){}
  if(hasChuniMeta(t))return true;
  const all=sourceRows(pageData()).rows,k=chartKey(t);if(all.filter(x=>chartKey(x)===k).length>1)return true;
  return false;
}
function cSource(x){try{return typeof sourceBadge==='function'?sourceBadge(x&&x.source):E(x&&x.source||'—')}catch(_){return E(x&&x.source||'—')}}
function cConstant(x){try{if(typeof exactConstant==='function')return exactConstant(x)}catch(_){}const v=x&&x.ds!=null?x.ds:(x&&x.difficulty!=null?x.difficulty:'—');return E(v)}
function cStatus(x){try{return typeof recentStatus==='function'?recentStatus(x):E(x&&x.status||'—')}catch(_){return E(x&&x.status||'—')}}
function cRating(x){try{if(typeof trackRatingFmt==='function')return trackRatingFmt(x&&x.rating)}catch(_){}return E(x&&x.rating!=null?x.rating:'—')}
function aStatus(x){try{return typeof arcaeaStatus==='function'?arcaeaStatus(x):String(x&&x.clearLabel||'—')}catch(_){return String(x&&x.clearLabel||'—')}}
function aConst(x){try{if(typeof constText==='function')return constText(x)}catch(_){}return String(x&&x.constant!=null?x.constant:'—')}
function mConst(x){try{if(typeof constText==='function')return constText(x)}catch(_){}return String(x&&x.constant!=null?x.constant:'—')}
function mAch(x){try{return typeof fmtAch==='function'?fmtAch(x&&x.achievements):N(x&&x.achievements).toFixed(4)+'%'}catch(_){return N(x&&x.achievements).toFixed(4)+'%'}}
function renderFiltered(rows){
  const body=q(kind==='chunithm'?'#recentBody':'#recentRows');if(!body)return;
  const sorted=[...rows].sort((a,b)=>stampOf(b)-stampOf(a));
  if(kind==='chunithm'){
    window.__YMKF_CHUNI_FILTERED__=sorted;
    body.innerHTML=sorted.map((t,i)=>{const detail=cDetailAvailable(t);return `<tr${detail?` class="detail-row" role="button" tabindex="0" onclick="openChuniSongDetail(window.__YMKF_CHUNI_FILTERED__[${i}],'record',null)"`:''}><td class="cover-cell">${jacket(t)}</td><td class="mono">${E(timeOf(t)||'—')}</td><td>${cSource(t)}</td><td><b>${E(titleOf(t)||('ID '+t.id))}</b></td><td><span class="badge">${E(diffOf(t))}</span> <span class="badge">${cConstant(t)}</span></td><td class="mono"><b>${metricText(t)}</b></td><td>${cStatus(t)}</td><td class="mono rating-value">${cRating(t)}</td><td>${detail?`<button class="detail-btn" type="button" onclick="event.stopPropagation();openChuniSongDetail(window.__YMKF_CHUNI_FILTERED__[${i}],'record',null)">查看单曲详情</button>`:'<span class="note">无额外详情</span>'}</td></tr>`}).join('')||'<tr><td colspan="9" class="empty">没有匹配记录</td></tr>';
  }else if(kind==='maimai'){
    body.innerHTML=sorted.map(x=>`<tr><td class="cover-cell">${jacket(x)}</td><td>${E(timeOf(x))}</td><td><b>${E(titleOf(x))}</b></td><td>${E(diffOf(x))} · ${E(mConst(x))}</td><td>${E(x.songTypeName||x.songType||'')}</td><td class="mono">${mAch(x)}</td><td><b>${Math.round(N(x.dxRating))}</b></td><td class="mono">${Math.round(N(x.dxScore))}</td><td>${E(x.rateLabel||'')}</td><td>${E(x.fcLabel||'-')} / ${E(x.fsLabel||'-')}</td></tr>`).join('')||'<tr><td colspan="10" class="empty">没有匹配记录</td></tr>';
  }else{
    body.innerHTML=sorted.map(x=>`<tr><td class="cover-cell">${jacket(x)}</td><td>${E(timeOf(x))}</td><td><b>${E(titleOf(x))}</b></td><td>${E(diffOf(x))} · ${E(aConst(x))}</td><td class="mono">${metricText(x)}</td><td>${N(x.potential).toFixed(4)}</td><td>${E(aStatus(x))}</td><td class="mono">${N(x.pure)} / ${N(x.far)} / ${N(x.lost)}</td></tr>`).join('')||'<tr><td colspan="8" class="empty">没有匹配记录</td></tr>';
  }
}
function patchChuniRows(){
  if(kind!=='chunithm')return;
  const patchBody=(sel,arr)=>{const body=q(sel);if(!body||!Array.isArray(arr))return;[...body.querySelectorAll('tr')].forEach((tr,i)=>{const t=arr[i];if(!t)return;const btn=tr.querySelector('.detail-btn');const ok=cDetailAvailable(t);if(btn)btn.textContent=ok?'查看单曲详情':'无额外详情';if(!ok){if(btn){btn.disabled=true;btn.removeAttribute('onclick')}tr.removeAttribute('onclick');tr.removeAttribute('onkeydown');tr.removeAttribute('role');tr.removeAttribute('tabindex');tr.classList.remove('detail-row')}})};
  try{patchBody('#trackBody',typeof CHUNI_DETAIL_TRACKS!=='undefined'?CHUNI_DETAIL_TRACKS:[]);if(!window.__YMKF_RHYTHM_FILTER_ACTIVE__)patchBody('#recentBody',typeof CHUNI_DETAIL_RECENT!=='undefined'?CHUNI_DETAIL_RECENT:[])}catch(_){}
}
function appendChuniChartMeta(t){
  if(kind!=='chunithm'||!hasChuniMeta(t))return;
  const body=q('#chuniDialogBody');if(!body||q('#ymkfChuniChartMeta'))return;
  const b=chuniBestFor(t),v=k=>meaningful(t&&t[k])?t[k]:b&&b[k];
  const items=[['总 Notes',v('notesTotal')],['TAP',v('noteTap')],['HOLD',v('noteHold')],['SLIDE',v('noteSlide')],['AIR',v('noteAir')],['FLICK',v('noteFlick')],['谱师',v('chartDesigner')]].filter(x=>meaningful(x[1]));
  if(!items.length)return;
  const box=document.createElement('div');box.id='ymkfChuniChartMeta';box.innerHTML=`<h4 class="chuni-subtitle">谱面构成 · MATE</h4><div class="chuni-metrics">${items.map(x=>`<div class="chuni-metric"><small>${E(x[0])}</small><b>${E(x[1])}</b></div>`).join('')}</div><div class="note">这里是谱面静态构成；上方“本次 RIN”才是这一局真实返回的 Note 类型表现与总判定。</div>`;
  body.appendChild(box);
}
function patchChuniOpenDetail(){
  if(kind!=='chunithm'||window.__YMKF_CHUNI_DETAIL_V11923||typeof window.openChuniSongDetail!=='function')return;
  const original=window.openChuniSongDetail;
  window.openChuniSongDetail=function(t){const r=original.apply(this,arguments);setTimeout(()=>appendChuniChartMeta(t),0);return r};
  window.__YMKF_CHUNI_DETAIL_V11923=true;
}
function chartGroups(songRows){
  const m=new Map();
  for(const x of songRows){const k=chartKey(x);if(!m.has(k))m.set(k,[]);m.get(k).push(x)}
  return [...m.values()].sort((a,b)=>groupLabel(a[0]).localeCompare(groupLabel(b[0]),undefined,{numeric:true,sensitivity:'base'}));
}
function chuniCounts(group){
  const first=group[0],best=chuniBestFor(first),fallbackCountry=group.filter(x=>String(x&&x.source||'').toLowerCase().includes('country')).length,fallbackRin=group.filter(x=>String(x&&x.source||'').toLowerCase().includes('rin')).length;
  const country=Number.isFinite(Number(best&&best.countryPlayCount))?Number(best.countryPlayCount):fallbackCountry;
  const rin=Number.isFinite(Number(best&&best.rinPlayCount))?Number(best.rinPlayCount):(Number.isFinite(Number(best&&best.playCount))?Number(best.playCount):fallbackRin);
  return {country,rin};
}
function groupCountText(group){if(kind==='chunithm'){const c=chuniCounts(group);return `国服 ${c.country} 次 · RIN ${c.rin} 次 · 合计 ${c.country+c.rin} 次`}return `游玩 ${group.length} 次`}
function renderPushGroups(songRows,onlyDiff,src,push,pushNote){
  let groups=chartGroups(songRows);if(onlyDiff&&onlyDiff!=='ALL')groups=groups.filter(g=>groupLabel(g[0])===onlyDiff);
  const totalPlays=kind==='chunithm'?groups.reduce((a,g)=>{const c=chuniCounts(g);return a+c.country+c.rin},0):groups.reduce((a,g)=>a+g.length,0);
  pushNote.textContent=(src.full?'完整历史':'当前可用最近记录')+` · ${groups.length} 个难度/谱面 · ${totalPlays} 次`;
  push.innerHTML=groups.map(g=>{const pushes=strictPushEvents(g);const cards=pushes.map(x=>`<div class="ymkf-push-item"><small>${E(shortDate(x))}</small><b>${E(metricText(x))}</b>${kind==='maimai'?`<span>DX分 ${Math.round(N(x.dxScore))}</span>`:''}</div>`).join('');return `<div class="ymkf-diff-row"><div class="ymkf-diff-head"><div><b>${E(groupLabel(g[0]))}</b><span>${E(groupCountText(g))}</span></div><small>严格推分 ${pushes.length} 次</small></div><div class="ymkf-push-track">${cards||'<div class="ymkf-push-empty">该难度暂无“高于前一次”的推分记录</div>'}</div></div>`}).join('')||'<div class="ymkf-push-empty">没有匹配难度</div>';
}
function install(){
  const d=pageData(),body=q(kind==='chunithm'?'#recentBody':'#recentRows');if(!d||!body)return false;
  const section=body.closest('.section');if(!section)return false;if(q('#ymkfHistoryTools'))return true;
  const src=sourceRows(d),rows=dedupe(src.rows),titles=distinctTitles(rows);
  const style=document.createElement('style');style.textContent=`
#ymkfHistoryTools{margin:0 0 14px}.ymkf-hist-controls{display:grid;grid-template-columns:minmax(220px,1fr) minmax(140px,190px) auto;gap:8px;align-items:center}.ymkf-hist-input,.ymkf-hist-select,.ymkf-hist-reset{background:#0e121d;color:var(--text);border:1px solid var(--line);border-radius:11px;padding:10px 12px}.ymkf-hist-reset{cursor:pointer;font-weight:800}.ymkf-hist-count{grid-column:1/-1;color:var(--muted);font-size:12px}.ymkf-push{margin-top:10px;border:1px solid var(--line);background:var(--panel2);border-radius:14px;padding:12px}.ymkf-push-head{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:9px}.ymkf-push-title{font-weight:900}.ymkf-push-note{font-size:11px;color:var(--muted)}.ymkf-diff-row{border-top:1px solid var(--line);padding:11px 0 4px}.ymkf-diff-row:first-child{border-top:0;padding-top:2px}.ymkf-diff-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:8px}.ymkf-diff-head>div{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.ymkf-diff-head b{font-size:13px}.ymkf-diff-head span,.ymkf-diff-head small{color:var(--muted);font-size:11px}.ymkf-push-track{display:flex;gap:8px;overflow:auto;padding-bottom:3px}.ymkf-push-item{flex:0 0 auto;min-width:145px;border:1px solid var(--line);background:rgba(255,255,255,.035);border-radius:11px;padding:9px 10px}.ymkf-push-item small{display:block;color:var(--muted);margin-bottom:4px}.ymkf-push-item b{display:block;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.ymkf-push-item span{font-size:10px;color:var(--muted)}.ymkf-push-empty{color:var(--muted);padding:5px 0;font-size:12px}@media(max-width:650px){.ymkf-hist-controls{grid-template-columns:1fr 1fr}.ymkf-hist-reset{grid-column:1/-1}.ymkf-push-head,.ymkf-diff-head{align-items:flex-start;flex-direction:column}}`;
  document.head.appendChild(style);
  const host=document.createElement('div');host.id='ymkfHistoryTools';host.innerHTML=`<div class="ymkf-hist-controls"><input id="ymkfSongFilter" class="ymkf-hist-input" list="ymkfSongList" placeholder="筛选单曲：输入或选择曲名"><datalist id="ymkfSongList">${titles.map(t=>`<option value="${E(t)}"></option>`).join('')}</datalist><select id="ymkfDiffFilter" class="ymkf-hist-select"><option value="ALL">全部难度</option></select><button id="ymkfSongReset" class="ymkf-hist-reset" type="button">全部记录</button><div id="ymkfHistCount" class="ymkf-hist-count"></div></div><div class="ymkf-push"><div class="ymkf-push-head"><div class="ymkf-push-title">推分记录 · 只记录比前一次更高</div><div id="ymkfPushNote" class="ymkf-push-note"></div></div><div id="ymkfPushTrack"><div class="ymkf-push-empty">请选择一首单曲查看各难度游玩次数与推分记录</div></div></div>`;
  const anchor=section.querySelector('.table-wrap')||body.closest('.table-wrap');anchor.parentNode.insertBefore(host,anchor);
  const input=q('#ymkfSongFilter'),diff=q('#ymkfDiffFilter'),reset=q('#ymkfSongReset'),count=q('#ymkfHistCount'),push=q('#ymkfPushTrack'),pushNote=q('#ymkfPushNote');
  function rebuildDiffOptions(base){const current=diff.value,ds=distinctDiffs(base);diff.innerHTML='<option value="ALL">全部难度</option>'+ds.map(x=>`<option value="${E(x)}">${E(x)}</option>`).join('');if(ds.includes(current))diff.value=current;else diff.value='ALL'}
  function update(){
    const raw=input.value.trim(),titleMatches=rowsForTitle(rows,raw);rebuildDiffOptions(titleMatches);const matches=rowsForDifficulty(titleMatches,diff.value);window.__YMKF_RHYTHM_FILTER_ACTIVE__=!!raw||diff.value!=='ALL';
    count.textContent=raw?`当前表格 ${matches.length} 条 · ${new Set(matches.map(titleOf)).size} 首`:`全部 ${matches.length} / ${rows.length} 条 · ${src.full?'完整历史':'当前可用最近记录'}`;
    if(raw||diff.value!=='ALL')renderFiltered(matches);else{try{if(typeof renderRecent==='function')renderRecent()}catch(_){}patchChuniRows()}
    const exact=exactTitleMatches(rows,raw),unique=[...new Set(titleMatches.map(titleOf))];
    if(!raw){push.innerHTML='<div class="ymkf-push-empty">请选择一首单曲查看各难度游玩次数与推分记录</div>';pushNote.textContent=src.full?'基于完整历史':'基于当前可用最近记录';return}
    if(exact.length!==1&&unique.length!==1){push.innerHTML=`<div class="ymkf-push-empty">${unique.length?`匹配 ${unique.length} 首，请继续输入到具体单曲`:'没有匹配单曲'}</div>`;pushNote.textContent='';return}
    const picked=exact.length===1?exact[0]:unique[0],songRows=rows.filter(x=>titleOf(x)===picked);renderPushGroups(songRows,diff.value,src,push,pushNote);
  }
  input.addEventListener('input',update);input.addEventListener('change',update);diff.addEventListener('change',update);reset.onclick=()=>{input.value='';diff.value='ALL';update()};
  if(kind==='chunithm'){patchChuniOpenDetail();const mo=new MutationObserver(()=>patchChuniRows());const tb=q('#trackBody'),rb=q('#recentBody');if(tb)mo.observe(tb,{childList:true});if(rb)mo.observe(rb,{childList:true});patchChuniRows()}
  update();return true;
}
let tries=0;const timer=setInterval(()=>{tries++;if(install()||tries>160)clearInterval(timer)},100);
})();
