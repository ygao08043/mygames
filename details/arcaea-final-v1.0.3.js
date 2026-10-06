(function(){
'use strict';
if(window.__YMKF_ARCAEA_FINAL_V103__) return;
window.__YMKF_ARCAEA_FINAL_V103__ = true;

var CACHE_URLS = [
  'https://cdn.jsdelivr.net/gh/nananet/nahi_pub@master/10_main/_data/arcaea_jacket_cache.json',
  'https://raw.githubusercontent.com/nananet/nahi_pub/master/10_main/_data/arcaea_jacket_cache.json'
];

var DIRECT = {
  'theraft':'https://cdn.wikiwiki.jp/to/w/arcaea/%EF%BC%BB%E7%AD%8F%EF%BC%BD%E3%81%AF%E4%BA%91%E3%81%86%E3%80%82%E5%B9%BE%E3%82%89%E6%BC%82%E6%B5%81%E3%81%99%E3%82%8C%E3%81%A9%E4%B8%8D%E6%92%93%E3%81%AE%E5%BF%83%E3%81%95%E3%81%88%E6%9C%89%E3%82%8C%E3%81%B0%E8%BB%88%E3%81%A6%E8%A1%8C%E5%88%B0%E3%82%8B%E3%81%A8%E3%80%82/::ref/The%20Raft.jpg.webp?rev=e189b87e33f96f4d14dbc44148d27d6c&t=20260107231845',
  'odysseia':'https://cdn.wikiwiki.jp/to/w/arcaea/%CE%9F%CE%94%CE%A5%CE%A3%CE%A3%CE%95%CE%99%CE%91/::ref/%CE%9F%CE%94%CE%A5%CE%A3%CE%A3%CE%95%CE%99%CE%91.jpg.webp?rev=029c5608bd015466e971f11a6bc25059&t=20240324042725',
  'ichirin':'https://cdn.wikiwiki.jp/to/w/arcaea/%E3%80%87%E3%80%81/::ref/%E3%80%87%E3%80%81.jpg?rev=42dd3f5272cc8b9e68b034c60ccfb983&t=20240325152103',
  'mask':'https://cdn.wikiwiki.jp/to/w/arcaea/~_%2B/::ref/~_%2B.jpg.webp?rev=7078449f21f848a541ba9f682841a211&t=20251224232047',
  'solitarydream':'https://cdn.wikiwiki.jp/to/w/arcaea/%E8%99%9A%E7%A9%BA%E3%81%AE%E5%A4%A2/::ref/Solitary%20Dream_ja.jpg.webp?rev=1c1d66fe45ddf9c869a10f342786adab&t=20240324040859',
  'tsukinimurakumo':'https://cdn.wikiwiki.jp/to/w/arcaea/%E6%9C%88%E3%81%AB%E5%8F%A2%E9%9B%B2%E8%8F%AF%E3%81%AB%E9%A2%A8/::ref/Tsuki%20ni%20Murakumo.jpg.webp?rev=6359fe932f29178d2089d9d0e77fb218&t=20240313223149'
};

function norm(v){
  var s=String(v==null?'':v);
  try{s=s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').normalize('NFKC')}catch(_){}
  return s.toLowerCase()
    .replace(/[\s_\-:：'"“”‘’()[\]{}·.!?！？,，\/\\+~～&＆†√|;]+/g,'')
    .replace(/[^a-z0-9\u3040-\u30ff\u3400-\u9fff]/g,'');
}
function stripImageStem(v){
  var s=String(v||'');
  try{s=decodeURIComponent(s)}catch(_){}
  s=s.replace(/\.jpg\.webp$/i,'').replace(/\.png\.webp$/i,'').replace(/\.(jpg|jpeg|png|webp)$/i,'');
  s=s.replace(/(?:-fixed|_fixed|-2|_2| 2| 3)$/i,'');
  return s;
}
function getRows(){
  if(typeof DATA==='undefined'||!DATA) return [];
  var out=[];
  var names=['scores','best50','best30','best10','recent'];
  for(var i=0;i<names.length;i++){
    var a=DATA[names[i]];
    if(Array.isArray(a)) for(var j=0;j<a.length;j++) if(a[j]) out.push(a[j]);
  }
  return out;
}
function buildMaps(cache){
  var main=new Map(), alt=new Map(), refMap=new Map();
  Object.keys(cache||{}).forEach(function(k){
    var url=cache[k];
    var page=String(k).split('/').pop()||'';
    var isAlt=/::ALT$/i.test(page);
    page=page.replace(/::ALT$/i,'');
    try{page=decodeURIComponent(page)}catch(_){}
    var pk=norm(page);
    if(pk){
      if(isAlt) alt.set(pk,url);
      else if(!main.has(pk)) main.set(pk,url);
    }
    var ref=String(url).split('::ref/')[1]||'';
    ref=ref.split('?')[0];
    var rk=norm(stripImageStem(ref));
    if(rk&&!refMap.has(rk)) refMap.set(rk,url);
  });
  return {main:main,alt:alt,refMap:refMap};
}
function resolveUrl(x,maps){
  var sid=String(x&&x.songId||'').toLowerCase();
  if(DIRECT[sid]) return DIRECT[sid];
  var key=norm(x&&x.title||'');
  if(!key) return '';
  var diff=String(x&&x.difficultyName||'').toUpperCase();
  if(diff==='BYD' && maps.alt.has(key)) return maps.alt.get(key);
  return maps.main.get(key)||maps.refMap.get(key)||'';
}
function escapeHtml(s){
  if(typeof esc==='function') return esc(s);
  return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]});
}
function installSafeJacketHtml(){
  try{
    jacketHtml=function(x,extra){
      extra=extra||'';
      var u=String(x&&x.jacketUrl||'');
      if(!u) return '<div class="song-jacket jacket-placeholder '+extra+'">♫</div>';
      return '<img class="song-jacket '+extra+'" src="'+escapeHtml(u)+'" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.outerHTML=\'<div class=&quot;song-jacket jacket-placeholder '+extra+'&quot;>♫</div>\'">';
    };
  }catch(_){}
}
function rerender(){
  try{ if(typeof renderHero==='function') renderHero(); }catch(_){}
  try{ if(typeof renderScores==='function') renderScores(); }catch(_){}
  try{ if(typeof renderRecent==='function') renderRecent(); }catch(_){}
}
function applyMaps(maps){
  var rows=getRows(), changed=0, mapped=0, fallback=0;
  for(var i=0;i<rows.length;i++){
    var x=rows[i];
    var u=resolveUrl(x,maps);
    if(u){
      mapped++;
      if(x.jacketUrl!==u){x.jacketUrl=u;changed++}
      x.__ymkfJacketSource='wikiwiki-cache';
    }else{
      fallback++;
      x.__ymkfJacketSource='local-fallback';
    }
  }
  installSafeJacketHtml();
  rerender();
  try{
    document.documentElement.setAttribute('data-ymkf-arcaea-jackets','v103');
    console.info('[YMKF Arcaea v1.0.3] jackets mapped='+mapped+' fallback='+fallback+' changed='+changed);
  }catch(_){}
}
async function loadCache(){
  var err=null;
  for(var i=0;i<CACHE_URLS.length;i++){
    try{
      var r=await fetch(CACHE_URLS[i]+'?v=20261006',{cache:'force-cache'});
      if(!r.ok) throw new Error('HTTP '+r.status);
      return await r.json();
    }catch(e){err=e}
  }
  throw err||new Error('jacket cache unavailable');
}
async function start(){
  installSafeJacketHtml();
  var tries=0;
  while((typeof DATA==='undefined'||!DATA)&&tries<60){
    await new Promise(function(ok){setTimeout(ok,100)});
    tries++;
  }
  if(typeof DATA==='undefined'||!DATA) return;
  try{
    var cache=await loadCache();
    var maps=buildMaps(cache);
    applyMaps(maps);
    setTimeout(function(){applyMaps(maps)},800);
    setTimeout(function(){applyMaps(maps)},2500);
    setTimeout(function(){applyMaps(maps)},6000);
  }catch(e){
    console.warn('[YMKF Arcaea v1.0.3] jacket cache failed; keeping local jackets',e);
    rerender();
  }
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start);
else start();
})();