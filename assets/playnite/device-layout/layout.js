/* YMKF_REAL_DEVICE_LAYOUT_FIX_1_2 · source-of-truth layout */
document.addEventListener('DOMContentLoaded', () => {
'use strict';
const tabs=document.querySelector('.topbar .tabs'), shell=document.querySelector('.shell');
if(!tabs||!shell)return;
if(window.__YMKF_REAL_DEVICE_LAYOUT_FIX_1_2)return;
window.__YMKF_REAL_DEVICE_LAYOUT_FIX_1_2=true;
const activate=id=>{tabs.querySelectorAll('.tab').forEach(b=>{b.classList.toggle('active',b.dataset.page===id);b.setAttribute('aria-pressed',String(b.dataset.page===id));});document.querySelectorAll('main.page').forEach(p=>p.classList.toggle('active',p.id===id));};
const specs=[['animation','动画'],['anime','动漫'],['tv','电视剧'],['movies','电影'],['manga','漫画'],['books','读物']];
// Keep references to the work pages before rebuilding an existing wrapper.
const workPages=new Map(specs.map(([id])=>[id,document.getElementById(id)]));
let works=document.getElementById('works');
if(!works)works=document.createElement('main');
works.id='works';works.className='page';
works.innerHTML='<section class="intro"><h1>已阅作品</h1></section><nav class="works-nav" aria-label="作品分类"></nav><div class="works-panels"></div>';
for(const [id,label] of specs){const page=workPages.get(id);if(!page)continue;page.classList.remove('page','active');page.classList.add('work-panel');page.hidden=id!=='animation';page.querySelector('.intro')?.remove();works.querySelector('.works-panels').append(page);const b=document.createElement('button');b.textContent=label;b.className='work-tab';b.setAttribute('aria-pressed',String(id==='animation'));b.onclick=()=>{works.querySelectorAll('.work-panel').forEach(p=>p.hidden=p.id!==id);works.querySelectorAll('.work-tab').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));};works.querySelector('nav').append(b);}
const note=document.createElement('p');note.className='reading-note';note.textContent='各种刊物/普及教育类丛书不计。';works.querySelector('#books')?.append(note);
shell.insertBefore(works,shell.querySelector('.footer'));

// Reuse and rebuild an existing device page instead of silently exiting when one exists.
let personal=document.getElementById('personalDevices');
if(!personal)personal=document.createElement('main');
personal.id='personalDevices';personal.className='page';personal.setAttribute('data-ymkf-device-layout','real-v1.2');
personal.innerHTML='<section class="intro"><h1>个人设备</h1></section><section class="device-section"><h2>游戏设备</h2><div id="personalGameDevices" class="personal-grid"></div></section><section class="device-section"><h2>娱乐设备</h2><div id="entertainmentDevices" class="personal-grid"></div></section><section class="device-section"><h2>音乐设备</h2><div id="musicDevices" class="personal-grid"></div></section><section class="device-section"><h2>其他设备</h2><div id="otherDevices" class="personal-grid"></div></section>';
shell.insertBefore(personal,shell.querySelector('.footer'));

tabs.innerHTML='';
for(const [id,label] of [['games','游戏战绩'],['works','已阅作品'],['personalDevices','个人设备']]){const b=document.createElement('button');b.className='tab';b.dataset.page=id;b.textContent=label;b.onclick=()=>activate(id);tabs.append(b);}
const oldValues=currentValues;currentValues=()=>oldValues().filter(v=>v!=='DEVICE');if(selected==='DEVICE')selected='ALL';
const asset='assets/playnite/device-layout/';
for(const d of devices){if(/^OMEN/i.test(d.name))d.image=asset+'omen.jpg';}

const css=document.createElement('style');css.textContent=`
.work-panel[hidden]{display:none!important}.works-nav{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 24px}.work-tab{padding:9px 17px;border:1px solid var(--line);border-radius:999px;background:transparent;color:var(--muted);cursor:pointer;font:inherit;font-size:14px}.work-tab[aria-pressed=true]{background:var(--text);color:var(--bg);border-color:var(--text)}.reading-note{margin:30px 0 10px;font-size:13px;color:var(--muted)}
.device-photo-error{height:100%;display:grid;place-items:center;padding:12px;text-align:center;color:var(--muted);font-size:13px}.device-section{margin:10px 0 36px}.device-section h2{font-size:18px;margin:0 0 16px}.personal-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}#personalDevices .ym-device-card{display:flex!important;flex-direction:column!important;height:auto!important;min-height:0!important;max-height:none!important;overflow:hidden;border:1px solid var(--line);border-radius:14px;background:var(--surface)}#personalDevices .ym-device-card .art{position:relative!important;width:100%!important;flex:auto!important;height:190px!important;background:#fff!important;margin:0!important;border-radius:0!important;overflow:hidden}#personalDevices .ym-device-card .art:after{display:none!important}#personalDevices .ym-device-card .art img{position:static!important;width:100%!important;height:100%!important;object-fit:contain!important;padding:16px;box-sizing:border-box;display:block!important;opacity:1!important}#personalDevices .ym-device-card .card-body{padding:16px!important;display:flex!important;min-height:96px!important;align-items:flex-start!important}#personalDevices .ym-device-card .name{font-size:16px!important;line-height:1.2}#personalDevices .device-kind{font-size:12px;color:var(--muted);margin-bottom:5px}#personalDevices .device-variant{margin-top:6px;font-size:12px;line-height:1.35;color:var(--muted)}#personalDevices .device-accent{display:inline-block;margin-left:6px;padding:2px 8px;border-radius:999px;background:var(--surface2);border:1px solid var(--line);font-size:11px;vertical-align:1px}#personalDevices #personalGameDevices .ym-device-card .card-body{display:flex!important;flex-direction:row!important;align-items:flex-start!important;gap:12px!important;text-align:left!important}#personalDevices #personalGameDevices .ym-device-card .device-title{min-width:0;flex:1;align-self:flex-start;text-align:left}#personalDevices #personalGameDevices .ym-device-card .name{position:static!important;margin:0!important;white-space:normal!important;display:block!important;line-height:1.15!important;text-align:left!important}#personalDevices #personalGameDevices .ym-device-card .device-storage{margin-top:5px;color:var(--muted);font-size:12px}#personalDevices #personalGameDevices .ym-device-card .device-action{flex:none;align-self:center;margin-left:auto;padding:8px 11px;border:1px solid var(--line);border-radius:9px;background:var(--surface2);color:var(--text);font-size:12px;font-weight:650;white-space:nowrap;transition:background .18s,border-color .18s}#personalDevices #personalGameDevices .ym-device-card[role=button]:hover .device-action,#personalDevices #personalGameDevices .ym-device-card[role=button]:focus-visible .device-action{background:var(--active);color:var(--active-text);border-color:var(--active)}#personalDevices #personalGameDevices .ym-device-card:focus-visible{outline:2px solid var(--text);outline-offset:2px}#gameModalImage[data-device-photo]{object-fit:contain!important;background:#fff!important}@media(max-width:700px){.personal-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#personalDevices .ym-device-card .art{height:155px!important}}@media(max-width:420px){.personal-grid{grid-template-columns:1fr}}
`;
document.head.append(css);

(() => {
  const safe = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const units = value => String(value || '').replace(/(\d+)\s*GB\b/g, '$1 GB').replace(/(\d+)\s*TB\b/g, '$1 TB').replace(/(\d+)\s*MHz\b/g, '$1 MHz');
  const isPC = d => /^OMEN\s*9$/i.test(String(d.name || '').trim());
  const omenDevice = devices.find(isPC) || {name:'OMEN9', image:asset+'omen.jpg'};

  // Product photos are real product/listing images. The HKC picture is a straight 32-inch T3252U substitute because an exact MG32A1F3 photo was not found.
  const entertainmentDevices = [
    {kind:'显示器', name:'HKC MG32A1F3', variant:'32inch · 1K · 200hz · 直屏（配图为 HKC T3252U 替代图）', accent:'黑', image:'https://cdn-img.birbir.uz/i/800x800-fit/files/c8/70/e485e4af8b489fdc78c8ba3141a9.jpg'},
    {kind:'鼠标', name:'Logitech G102', variant:'有线游戏鼠标', accent:'黑', image:'https://brainy.co.ke/cdn/shop/files/logitech-g102-lightsync-rgb-6-button-usb-gaming-mouse-black-792075.jpg?v=1735293334'},
    {kind:'音游控制器', name:'TASOLLER PLUS', variant:'街机风格控制器', accent:'', image:'https://www.gamo2.com/jp/upload/save_image/10221938_671780b49b34d.png'},
    {kind:'平板', name:'iPad Pro 13inch M4', variant:'256GB', accent:'白', image:asset+'ipad-pro-13-m4-silver.png'},
    {kind:'手机', name:'iPhone 16 Pro', variant:'1TB', accent:'黑', image:'https://www.pbtech.co.nz/imgprod/M/P/MPHAPP516210__1.jpg?h=226757430'}
  ];

  const musicDevices = [
    {kind:'钢琴', name:'Kayserburg UH-130U', variant:'立式钢琴', accent:'', image:asset+'piano.jpg'},
    {kind:'节拍器', name:'Nikko Standards', variant:'机械节拍器', accent:'黑', image:'https://nikkoseiki.com/images/standard_images/226_2304_3.jpg'},
    {kind:'录音笔', name:'SONY ICD-UX570F', variant:'便携录音笔', accent:'黑', image:'https://www.sony.jp/products/picture/middle/ICD-UX575F_570F.jpg'},
    {kind:'耳机', name:'SONY WI-1000XM2', variant:'颈挂式降噪耳机', accent:'银', image:'https://soundmagcdn.fra1.cdn.digitaloceanspaces.com/product/82442/c/sliderZb27gt-desktop.webp'},
    {kind:'音响', name:'YAMAHA NX-50', variant:'桌面有源音响', accent:'黑', image:'https://uk.yamaha.com/en/files/9CB12EB0BEAB4A1693BBBA85B48A7D1C_12073_tcm117-1726888.jpg'}
  ];

  const otherDevices = [
    {kind:'手表', name:'DW CLASSIC', variant:'Classic · 黑金', accent:'黑金', image:'https://jp.danielwellington.com/cdn/shop/products/f83e0a252ca2e0a6fa29223860e03665be838c10.png?v=1686815664&width=1500'},
    {kind:'自行车', name:'Tropix Mariano', variant:'白色座椅 · 白红车架 · 黑色把手', accent:'红白', image:'https://static.wixstatic.com/media/ff2689_40167fc1bcdc4effa23d9dc603b9ae38~mv2.jpg'}
  ];

  let opener = null;
  function openDevice(d, card) {
    const modal = document.querySelector('#gameModal');
    const content = document.querySelector('#gameModalContent');
    const img = document.querySelector('#gameModalImage');
    if (!modal || !content || !img) return;
    opener = card;
    document.querySelector('#gameModalTitle').textContent = 'OMEN9';
    document.querySelector('#gameModalTitle').style.left = '22px';
    img.onerror = null; img.src = d.image; img.alt = 'OMEN9'; img.setAttribute('data-device-photo',''); img.style.display = 'block';
    for (const id of ['gameModalCover', 'gameModalIcon']) { const el = document.getElementById(id); if (el) el.style.display = 'none'; }
    const hardwareRows = [
      ['型号', 'HP OMEN 16-wf0xxx'],
      ['主板', 'HP 8BAB'],
      ['处理器', 'Intel Core i7-13700HX (16 cores / 24 threads)'],
      ['集成显卡', 'Intel UHD Graphics'],
      ['独立显卡', 'NVIDIA GeForce RTX 4050 Laptop GPU'],
      ['内部显示器', '笔记本内置显示屏（具体型号及参数未核实）'],
      ['内存', 'Kingston 32GB (2 × 16GB) · 5600 MT/s（标称）'],
      ['容量', '约 1.5TB（KIOXIA KXG80ZNV512G 512GB + Fanxiang S500Pro 1TB）'],
      ['操作系统', 'Windows 11 Pro (64-bit)']
    ];
    const peripheralRows = [
      ['显示器', 'HKC MG32A1F3 · 32inch · 1K · 200hz'],
      ['鼠标', 'Logitech G102 黑'],
      ['耳机', 'SONY WI-1000XM2 银'],
      ['音响', 'YAMAHA NX-50 黑'],
      ['音游控制器', 'TASOLLER PLUS']
    ];
    const renderSpecRows = rows => rows.filter(([,value]) => value).map(([label,value]) => `<dt>${safe(label)}</dt><dd style="overflow-wrap:anywhere">${safe(units(value))}</dd>`).join('');
    content.innerHTML = `<div class="modal-stats"><div class="modal-stat"><small>设备</small><b>OMEN9</b></div><div class="modal-stat"><small>平台</small><b>PC(windows)</b></div></div><div class="modal-section" data-ymkf-omen-layout="1.4"><h3>硬件配置</h3><dl class="meta-grid">${renderSpecRows(hardwareRows)}</dl></div><div class="modal-section" style="border-top:1px solid var(--line);margin-top:20px;padding-top:18px"><h3>外设</h3><dl class="meta-grid">${renderSpecRows(peripheralRows)}</dl></div>`;
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; document.querySelector('#gameModalClose')?.focus();
  }

  const modal = document.querySelector('#gameModal');
  if (modal) new MutationObserver(() => {
    if (opener && !modal.classList.contains('open')) {
      const target = opener; opener = null;
      document.querySelector('#gameModalTitle').style.removeProperty('left');
      document.querySelector('#gameModalImage').alt = ''; document.querySelector('#gameModalImage').removeAttribute('data-device-photo');
      if (target.isConnected) target.focus({preventScroll:true});
    }
  }).observe(modal, {attributes:true, attributeFilter:['class']});

  function renderStaticSection(hostId, items){
    const host = document.getElementById(hostId); if(!host) return; host.innerHTML='';
    items.forEach(item => {
      const card = document.createElement('article'); card.className='ym-device-card';
      const badge = item.accent ? `<span class="device-accent">${safe(item.accent)}</span>` : '';
      const desc = item.variant ? `<div class="device-variant">${safe(units(item.variant))}</div>` : '';
      card.innerHTML = `<div class="art"><img src="${safe(item.image)}" alt="${safe(item.name + (item.accent ? ' ' + item.accent : ''))}" loading="lazy" referrerpolicy="no-referrer"></div><div class="card-body"><div><div class="device-kind">${safe(item.kind)}</div><div class="name">${safe(item.name)}${badge}</div>${desc}</div></div>`;
      const photo=card.querySelector('img');
      photo.addEventListener('error',()=>{const art=photo.closest('.art');photo.remove();const fallback=document.createElement('div');fallback.className='device-photo-error';fallback.textContent='商品图片暂时无法加载';art?.appendChild(fallback);},{once:true});
      host.appendChild(card);
    });
  }

  window.renderDevices = function () {
    const host = document.querySelector('#personalGameDevices'); if(!host) return; host.innerHTML='';
    const d = omenDevice;
    const el=document.createElement('article'); el.className='media-card device-card ym-device-card ymkf-horizontal-card';
    el.innerHTML = `<div class="art"><img src="${safe(d.image)}" alt="OMEN9" loading="lazy"></div><div class="card-body"><div class="device-title"><div class="device-kind">笔记本电脑</div><div class="name">OMEN9</div><div class="device-storage">1.5TB · i7-13700HX · RTX 4050</div></div><span class="device-action" aria-hidden="true">查看配置 →</span></div>`;
    el.tabIndex=0; el.setAttribute('role','button'); el.setAttribute('aria-label','查看 OMEN9 配置'); el.setAttribute('aria-haspopup','dialog'); el.style.cursor='pointer';
    el.addEventListener('click',()=>openDevice(d,el)); el.addEventListener('keydown',e=>{ if (e.key==='Enter'||e.key===' ') { e.preventDefault(); openDevice(d,el); } });
    host.appendChild(el);
    renderStaticSection('entertainmentDevices', entertainmentDevices);
    renderStaticSection('musicDevices', musicDevices);
    renderStaticSection('otherDevices', otherDevices);
  };
  if (typeof renderAll === 'function') renderAll();
  window.renderDevices();
})();

activate('games');
});
