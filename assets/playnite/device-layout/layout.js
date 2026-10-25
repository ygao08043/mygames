/* YMKF_REAL_DEVICE_LAYOUT_FIX_1_4_0 · source-of-truth layout */
document.addEventListener('DOMContentLoaded', () => {
'use strict';
const tabs=document.querySelector('.topbar .tabs'), shell=document.querySelector('.shell');
if(!tabs||!shell)return;
if(window.__YMKF_REAL_DEVICE_LAYOUT_FIX_1_4_0)return;
window.__YMKF_REAL_DEVICE_LAYOUT_FIX_1_4_0=true;

const activate=id=>{tabs.querySelectorAll('.tab').forEach(b=>{b.classList.toggle('active',b.dataset.page===id);b.setAttribute('aria-pressed',String(b.dataset.page===id));});document.querySelectorAll('main.page').forEach(p=>p.classList.toggle('active',p.id===id));};
const specs=[['animation','动画'],['anime','动漫'],['tv','电视剧'],['movies','电影'],['manga','漫画'],['books','读物']];
const workPages=new Map(specs.map(([id])=>[id,document.getElementById(id)]));
let works=document.getElementById('works'); if(!works) works=document.createElement('main');
works.id='works'; works.className='page';
works.innerHTML='<section class="intro"><h1>已阅作品</h1></section><nav class="works-nav" aria-label="作品分类"></nav><div class="works-panels"></div>';
for(const [id,label] of specs){const page=workPages.get(id);if(!page)continue;page.classList.remove('page','active');page.classList.add('work-panel');page.hidden=id!=='animation';page.querySelector('.intro')?.remove();works.querySelector('.works-panels').append(page);const b=document.createElement('button');b.textContent=label;b.className='work-tab';b.setAttribute('aria-pressed',String(id==='animation'));b.onclick=()=>{works.querySelectorAll('.work-panel').forEach(p=>p.hidden=p.id!==id);works.querySelectorAll('.work-tab').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));};works.querySelector('nav').append(b);}const note=document.createElement('p');note.className='reading-note';note.textContent='各种刊物/普及教育类丛书不计。';works.querySelector('#books')?.append(note);shell.insertBefore(works,shell.querySelector('.footer'));

let personal=document.getElementById('personalDevices'); if(!personal) personal=document.createElement('main');
personal.id='personalDevices'; personal.className='page'; personal.setAttribute('data-ymkf-device-layout','real-v1.4.0');
personal.innerHTML='<section class="intro"><h1>个人设备</h1></section><section class="device-section"><h2>娱乐设备</h2><div id="entertainmentDevices" class="personal-grid"></div></section><section class="device-section"><h2>音乐设备</h2><div id="musicDevices" class="personal-grid"></div></section><section class="device-section"><h2>其他设备</h2><div id="otherDevices" class="personal-grid"></div></section>';
shell.insertBefore(personal,shell.querySelector('.footer'));

tabs.innerHTML='';
for(const [id,label] of [['games','游戏战绩'],['works','已阅作品'],['personalDevices','个人设备']]){const b=document.createElement('button');b.className='tab';b.dataset.page=id;b.textContent=label;b.onclick=()=>activate(id);tabs.append(b);}
const oldValues=currentValues;currentValues=()=>oldValues().filter(v=>v!=='DEVICE');if(selected==='DEVICE')selected='ALL';
const asset='assets/playnite/device-layout/';

const css=document.createElement('style');css.textContent=`
.work-panel[hidden]{display:none!important}.works-nav{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 24px}.work-tab{padding:9px 17px;border:1px solid var(--line);border-radius:999px;background:transparent;color:var(--muted);cursor:pointer;font:inherit;font-size:14px}.work-tab[aria-pressed=true]{background:var(--text);color:var(--bg);border-color:var(--text)}.reading-note{margin:30px 0 10px;font-size:13px;color:var(--muted)}
.device-photo-error{height:100%;display:grid;place-items:center;padding:12px;text-align:center;color:var(--muted);font-size:13px}.device-section{margin:10px 0 36px}.device-section h2{font-size:18px;margin:0 0 16px}.personal-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}#personalDevices .ym-device-card{display:flex!important;flex-direction:column!important;height:auto!important;min-height:0!important;max-height:none!important;overflow:hidden;border:1px solid var(--line);border-radius:14px;background:var(--surface)}#personalDevices .ym-device-card .art{position:relative!important;width:100%!important;flex:auto!important;height:190px!important;background:#fff!important;margin:0!important;border-radius:0!important;overflow:hidden;display:flex!important;align-items:center!important;justify-content:center!important}#personalDevices .ym-device-card .art:after{display:none!important}#personalDevices .ym-device-card .art img{position:static!important;width:100%!important;height:100%!important;object-fit:contain!important;padding:16px;box-sizing:border-box;display:block!important;opacity:1!important;object-position:center center!important}#personalDevices .ym-device-card .art.device-zoom-soft img{padding:10px!important;transform:scale(1.06)}#personalDevices .ym-device-card .art.device-zoom-strong img{padding:4px!important;transform:scale(1.15)}#personalDevices .ym-device-card .art.device-center-tight img{padding:10px 42px!important}#personalDevices .ym-device-card .card-body{padding:16px!important;display:flex!important;min-height:92px!important;align-items:flex-start!important}#personalDevices .ym-device-card .name{font-size:16px!important;line-height:1.2}#personalDevices .device-kind{font-size:12px;color:var(--muted);margin-bottom:5px}#personalDevices .device-accent{display:inline-block;margin-left:6px;padding:2px 8px;border-radius:999px;background:var(--surface2);border:1px solid var(--line);font-size:11px;vertical-align:1px}#personalDevices .ym-click-card{cursor:pointer}#personalDevices .ym-click-card .card-body{display:flex!important;flex-direction:column!important;justify-content:space-between!important;gap:10px}#personalDevices .device-action{display:inline-flex;align-items:center;justify-content:center;align-self:flex-start;padding:8px 11px;border:1px solid var(--line);border-radius:9px;background:var(--surface2);color:var(--text);font-size:12px;font-weight:650;white-space:nowrap;transition:background .18s,border-color .18s}#personalDevices .ym-click-card:hover .device-action,#personalDevices .ym-click-card:focus-visible .device-action{background:var(--active);color:var(--active-text);border-color:var(--active)}#personalDevices .ym-click-card:focus-visible{outline:2px solid var(--text);outline-offset:2px}#gameModalImage[data-device-photo]{object-fit:contain!important;background:#fff!important}@media(max-width:700px){.personal-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#personalDevices .ym-device-card .art{height:155px!important}}@media(max-width:420px){.personal-grid{grid-template-columns:1fr}}
`;
document.head.append(css);

(() => {
  const safe = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const units = value => String(value || '').replace(/(\d+)\s*GB\b/g, '$1 GB').replace(/(\d+)\s*TB\b/g, '$1 TB').replace(/(\d+)\s*MHz\b/g, '$1 MHz').replace(/(\d+)\s*Hz\b/gi,'$1Hz');
  const omenProductImage='https://kaas.hpcloud.hp.com/PROD/v2/renderbinary/7968199/7970480/con-win-nb-p-brunobear-23c1-omen-16-wd0000-16-wf0000-specification/con-nb-brunobear-omen-16-wd0000-16-wf0000-product-image';
  const omenDevice={kind:'电脑', name:'OMEN9', accent:'黑', image:omenProductImage, click:true, action:'查看配置 →', modalTitle:'OMEN9', modalStats:[['设备','OMEN9'],['平台','PC(windows)']], modalRows:[
      ['型号', 'HP OMEN 16-wf0xxx'],
      ['主板', 'HP 8BAB'],
      ['处理器', 'Intel Core i7-13700HX (16 cores / 24 threads)'],
      ['集成显卡', 'Intel UHD Graphics'],
      ['独立显卡', 'NVIDIA GeForce RTX 4050 Laptop GPU'],
      ['内部显示器', 'Inter(R) UHD Graphics RGB 1080P 165Hz'],
      ['内存', 'Kingston 32GB (2 × 16GB) · 5600 MT/s（标称）'],
      ['容量', '1.5TB（KIOXIA KXG80ZNV512G 512GB + Fanxiang S500Pro 1TB）'],
      ['操作系统', 'Windows 11 Pro (64-bit)']
    ]};
  const hkcDevice={kind:'显示器', name:'HKC MG32A1F3', accent:'', image:'https://cdn-img.birbir.uz/i/800x800-fit/files/c8/70/e485e4af8b489fdc78c8ba3141a9.jpg', click:true, action:'查看配置 →', modalTitle:'HKC MG32A1F3', modalStats:[['设备','显示器'],['品牌','HKC']], modalRows:[
      ['型号','HKC MG32A1F3'], ['尺寸','32inch'], ['色彩','RGB'], ['分辨率','1080P'], ['刷新率','200Hz']
    ]};

  const entertainmentDevices = [
    omenDevice,
    hkcDevice,
    {kind:'鼠标', name:'Logitech G102', accent:'黑', image:'https://brainy.co.ke/cdn/shop/files/logitech-g102-lightsync-rgb-6-button-usb-gaming-mouse-black-792075.jpg?v=1735293334'},
    {kind:'鼠标', name:'MCHOSE L7 pro', accent:'白', image:asset+'mchose-l7-pro-white.png'},
    {kind:'音游控制器', name:'TASOLLER PLUS', accent:'', image:'https://www.gamo2.com/jp/upload/save_image/10221938_671780b49b34d.png', artClass:'device-zoom-strong'},
    {kind:'平板', name:'iPad Pro 13inch M4 256GB', accent:'黑', image:asset+'ipad-pro-13-m4-black-v2.png'},
    {kind:'手机', name:'iPhone 16 Pro 1TB', accent:'白', image:asset+'iphone-16-pro-whitebg-lineup.png'}
  ];

  const musicDevices = [
    {kind:'钢琴', name:'Kayserburg UH-130U', accent:'', image:asset+'piano.jpg'},
    {kind:'竹笛', name:'E调两节笛', accent:'', image:asset+'dizi-e-key-clean.png', artClass:'device-center-tight'},
    {kind:'陶笛', name:'风雅AC长嘴降B调六孔陶笛', accent:'墨竹', image:asset+'ocarina-mozhu.png'},
    {kind:'竖笛', name:'DHS精品C调六孔竖笛', accent:'白', image:asset+'recorder-dhs-white.png', artClass:'device-center-tight'},
    {kind:'节拍器', name:'Nikko Standards', accent:'黑', image:'https://nikkoseiki.com/images/standard_images/226_2304_3.jpg'},
    {kind:'翻谱器', name:'JOYO无线踩踏自动翻谱器', accent:'黑', image:asset+'joyo-page-turner-black.png'},
    {kind:'录音笔', name:'SONY ICD-UX570F', accent:'黑', image:'https://item-shopping.c.yimg.jp/i/f/bakuyasuearth_4548736100084'},
    {kind:'耳机', name:'SONY WI-1000XM2', accent:'铂金银', image:asset+'sony-wi-1000xm2-platinum-silver.png'},
    {kind:'音响', name:'YAMAHA NX-50', accent:'黑', image:'https://uk.yamaha.com/en/files/9CB12EB0BEAB4A1693BBBA85B48A7D1C_12073_tcm117-1726888.jpg'}
  ];

  const otherDevices = [
    {kind:'手表', name:'DW CLASSIC', accent:'黑金', image:'https://jp.danielwellington.com/cdn/shop/products/f83e0a252ca2e0a6fa29223860e03665be838c10.png?v=1686815664&width=1500'},
    {kind:'自行车', name:'Tropix Mariano', accent:'红白', image:'https://static.wixstatic.com/media/ff2689_40167fc1bcdc4effa23d9dc603b9ae38~mv2.jpg', artClass:'device-zoom-soft'}
  ];

  let opener = null;
  function openSpecModal(item, card) {
    const modal = document.querySelector('#gameModal');
    const content = document.querySelector('#gameModalContent');
    const img = document.querySelector('#gameModalImage');
    const title = document.querySelector('#gameModalTitle');
    if (!modal || !content || !img || !title) return;
    opener = card;
    title.textContent = item.modalTitle || item.name;
    title.style.left = '22px';
    img.onerror = null; img.src = item.image; img.alt = item.name; img.setAttribute('data-device-photo',''); img.style.display = 'block';
    for (const id of ['gameModalCover', 'gameModalIcon']) { const el = document.getElementById(id); if (el) el.style.display = 'none'; }
    const stats = (item.modalStats||[]).map(([label,value])=>`<div class="modal-stat"><small>${safe(label)}</small><b>${safe(value)}</b></div>`).join('');
    const rows = (item.modalRows||[]).map(([label,value]) => `<dt>${safe(label)}</dt><dd style="overflow-wrap:anywhere">${safe(units(value))}</dd>`).join('');
    content.innerHTML = `<div class="modal-stats">${stats}</div><div class="modal-section" data-ymkf-device-modal="1.4.0"><h3>详细信息</h3><dl class="meta-grid">${rows}</dl></div>`;
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; document.querySelector('#gameModalClose')?.focus();
  }

  const modal = document.querySelector('#gameModal');
  if (modal) new MutationObserver(() => {
    if (opener && !modal.classList.contains('open')) {
      const target = opener; opener = null;
      document.querySelector('#gameModalTitle')?.style.removeProperty('left');
      document.querySelector('#gameModalImage')?.removeAttribute('data-device-photo');
      if (target.isConnected) target.focus({preventScroll:true});
    }
  }).observe(modal, {attributes:true, attributeFilter:['class']});

  function renderSection(hostId, items){
    const host = document.getElementById(hostId); if(!host) return; host.innerHTML='';
    items.forEach(item => {
      const card = document.createElement('article'); card.className='ym-device-card' + (item.click ? ' ym-click-card' : '');
      const badge = item.accent ? `<span class="device-accent">${safe(item.accent)}</span>` : '';
      const action = item.click ? `<span class="device-action" aria-hidden="true">${safe(item.action || '查看详情 →')}</span>` : '';
      card.innerHTML = `<div class="art ${safe(item.artClass || '')}"><img src="${safe(item.image)}" alt="${safe(item.name + (item.accent ? ' ' + item.accent : ''))}" loading="lazy" referrerpolicy="no-referrer"></div><div class="card-body"><div><div class="device-kind">${safe(item.kind)}</div><div class="name">${safe(item.name)}${badge}</div></div>${action}</div>`;
      const photo=card.querySelector('img');
      photo.addEventListener('error',()=>{const art=photo.closest('.art');photo.remove();const fallback=document.createElement('div');fallback.className='device-photo-error';fallback.textContent='商品图片暂时无法加载';art?.appendChild(fallback);},{once:true});
      if(item.click){card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label',`查看 ${item.name} 配置`);card.setAttribute('aria-haspopup','dialog');card.addEventListener('click',()=>openSpecModal(item,card));card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openSpecModal(item,card);}});}
      host.appendChild(card);
    });
  }

  window.renderDevices = function () {
    renderSection('entertainmentDevices', entertainmentDevices);
    renderSection('musicDevices', musicDevices);
    renderSection('otherDevices', otherDevices);
  };
  if (typeof renderAll === 'function') renderAll();
  window.renderDevices();
})();

activate('games');
});
