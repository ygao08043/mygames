(function(){
'use strict';
if(window.__YMKF_ARCAEA_FINAL_FIX_102__) return;
window.__YMKF_ARCAEA_FINAL_FIX_102__=true;

var API='https://api.github.com/repos/Alser1204/arcaea.py/contents/images?ref=master';
var RAW='https://raw.githubusercontent.com/Alser1204/arcaea.py/master/images/';
var MANUAL={
  undyingmacula:RAW+'Undying%20Macula-fixed.jpg',
  quon:RAW+'Quon_Lanota.jpg',
  quonwacca:RAW+'Quon_WACCA.jpg',
  solitarydream:RAW+'Solitary%20Dream_ja.jpg',
  viyella:RAW+'cry%20of%20viyella%202.jpg',
  genesis:RAW+'Genesis_Arcaea.jpg',
  genesischunithm:RAW+'Genesis_CHUNITHM.jpg',
  mirrorrmx:'https://wikiwiki.jp/arcaea/?plugin=attach&refer=MIRROR+-+kamome+sano+remix&openfile=MIRROR+-+kamome+sano+remix.jpg',
  caramelpop:'https://wikiwiki.jp/arcaea/?plugin=attach&refer=%E3%82%AD%E3%83%A3%E3%83%A9%E3%83%A1%E3%83%AB%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%9F%E3%81%B9%E3%81%9F%E3%81%84%E3%82%88%E3%80%9C&openfile=Gimme+Caramel+Popcorn%21.jpg',
  shinoukyoseki:'https://wikiwiki.jp/arcaea/?plugin=attach&refer=%E6%A3%AE%E5%A5%A5%E8%99%9A%E8%B7%A1&openfile=The+Forgotten+Forest+Haven.jpg',
  riotsystem:'https://wikiwiki.jp/arcaea/?plugin=attach&refer=Riot+in+the+System&openfile=Riot+in+the+System.jpg'
};
var coverMap=null;

function norm(s){
  s=String(s||'');
  try{s=s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').normalize('NFKC')}catch(_){}
  return s.toLowerCase().replace(/[\s_\-:：'"“”‘’()[\]{}·.!?！？,，/\\+~～&＆†√]+/g,'').replace(/[^a-z0-9\u3040-\u30ff\u3400-\u9fff]/g,'');
}
function esc2(s){
  if(typeof esc==='function') return esc(s);
  return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]});
}
function cleanStem(name){return String(name||'').replace(/\.(jpg|jpeg|png|webp)$/i,'')}
function baseStem(name){return cleanStem(name).replace(/_(BYD|ETR|FTR|PRS|PST)$/i,'')}
function diffSuffix(x){
  var d=String(x&&x.difficultyName||'').toUpperCase();
  return /^(PST|PRS|FTR|BYD|ETR)$/.test(d)?d:'';
}
async function loadCoverMap(){
  if(coverMap) return coverMap;
  var out={base:new Map(),diff:new Map()};
  try{
    var r=await fetch(API,{cache:'force-cache'});
    if(!r.ok) throw new Error('GitHub '+r.status);
    var rows=await r.json();
    for(var i=0;i<rows.length;i++){
      var it=rows[i],name=String(it&&it.name||'');
      if(!/\.(jpg|jpeg|png|webp)$/i.test(name)) continue;
      var stem=cleanStem(name),m=stem.match(/_(BYD|ETR|FTR|PRS|PST)$/i),base=baseStem(name),k=norm(base);
      if(!k) continue;
      var url=it.download_url||RAW+encodeURIComponent(name).replace(/%2F/ig,'/');
      if(m) out.diff.set(k+'|'+m[1].toUpperCase(),url);
      else if(!out.base.has(k)) out.base.set(k,url);
    }
  }catch(e){console.warn('Arcaea cover index unavailable',e)}
  coverMap=out;return out;
}
function rowsOf(d){
  var a=[],lists=[d&&d.scores,d&&d.best50,d&&d.best30,d&&d.best10,d&&d.recent];
  for(var i=0;i<lists.length;i++) if(Array.isArray(lists[i])) a=a.concat(lists[i]);
  return a;
}
function sameSongRows(d,sid){return rowsOf(d).filter(function(x){return String(x&&x.songId||'')===sid})}
function setCoverForSong(d,sid,url){
  var list=sameSongRows(d,sid);
  for(var i=0;i<list.length;i++){
    var x=list[i];
    if(!x._ymkfOriginalJacket) x._ymkfOriginalJacket=String(x.jacketUrl||'');
    x.jacketUrl=url;
  }
}
async function applyAuthoritativeCovers(d){
  if(!d) return false;
  var map=await loadCoverMap(),all=rowsOf(d),done=new Set(),changed=false;
  for(var i=0;i<all.length;i++){
    var x=all[i],sid=String(x&&x.songId||'');
    if(!sid||done.has(sid)) continue;
    done.add(sid);
    var title=String(x.title||sid),key=norm(title),suffix=diffSuffix(x),url='';
    if(Object.prototype.hasOwnProperty.call(MANUAL,sid)) url=MANUAL[sid];
    if(!url&&suffix) url=map.diff.get(key+'|'+suffix)||'';
    if(!url) url=map.base.get(key)||'';
    if(url){setCoverForSong(d,sid,url);changed=true}
  }
  return changed;
}

window.ymkfArcFinalImageError=function(img){
  if(!img) return;
  var fallback=img.getAttribute('data-local-fallback')||'';
  if(fallback && img.src!==fallback && img.dataset.localTried!=='1'){
    img.dataset.localTried='1';img.src=fallback;return;
  }
  var extra=img.classList.contains('card-jacket')?' card-jacket':'';
  img.outerHTML='<div class="song-jacket jacket-placeholder'+extra+'">♫</div>';
};

function replaceJacketRenderer(){
  if(typeof jacketHtml!=='function') return;
  jacketHtml=function(x,extra){
    extra=extra||'';
    var u=String(x&&x.jacketUrl||''),local=String(x&&x._ymkfOriginalJacket||'');
    if(!u) return '<div class="song-jacket jacket-placeholder '+esc2(extra)+'">♫</div>';
    return '<img class="song-jacket '+esc2(extra)+'" src="'+esc2(u)+'" data-local-fallback="'+esc2(local)+'" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="ymkfArcFinalImageError(this)">';
  };
}

function forceFive(){
  var g=document.getElementById('b30grid');
  if(g){g.style.setProperty('display','grid','important');g.style.setProperty('grid-template-columns','repeat(5,minmax(0,1fr))','important');g.style.setProperty('gap','10px','important')}
}

async function finalPass(){
  replaceJacketRenderer();
  if(typeof hydrateArcaeaCovers==='function'){
    hydrateArcaeaCovers=async function(d){return await applyAuthoritativeCovers(d)};
  }
  if(typeof DATA!=='undefined'&&DATA){
    try{await applyAuthoritativeCovers(DATA)}catch(_){}
    try{if(typeof renderHero==='function')renderHero()}catch(_){}
    try{if(typeof renderScores==='function')renderScores()}catch(_){}
    try{if(typeof renderRecent==='function')renderRecent()}catch(_){}
  }
  forceFive();
}

finalPass();
setTimeout(finalPass,250);
setTimeout(finalPass,1200);
window.addEventListener('load',function(){setTimeout(finalPass,50)});
})();
