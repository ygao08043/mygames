document.addEventListener('DOMContentLoaded', () => {
'use strict';
const tabs=document.querySelector('.topbar .tabs'), shell=document.querySelector('.shell');
if(!tabs||!shell||document.getElementById('personalDevices'))return;
const activate=id=>{tabs.querySelectorAll('.tab').forEach(b=>{b.classList.toggle('active',b.dataset.page===id);b.setAttribute('aria-pressed',String(b.dataset.page===id));});document.querySelectorAll('main.page').forEach(p=>p.classList.toggle('active',p.id===id));};
const works=document.createElement('main');works.id='works';works.className='page';works.innerHTML='<section class="intro"><h1>已阅作品</h1></section><nav class="works-nav" aria-label="作品分类"></nav><div class="works-panels"></div>';
const specs=[['animation','动画'],['anime','动漫'],['tv','电视剧'],['movies','电影'],['manga','漫画'],['books','读物']];
for(const [id,label] of specs){const page=document.getElementById(id);if(!page)continue;page.classList.remove('page','active');page.classList.add('work-panel');page.hidden=id!=='animation';page.querySelector('.intro')?.remove();works.querySelector('.works-panels').append(page);const b=document.createElement('button');b.textContent=label;b.className='work-tab';b.setAttribute('aria-pressed',String(id==='animation'));b.onclick=()=>{works.querySelectorAll('.work-panel').forEach(p=>p.hidden=p.id!==id);works.querySelectorAll('.work-tab').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));};works.querySelector('nav').append(b);}
const note=document.createElement('p');note.className='reading-note';note.textContent='各种刊物/普及教育类丛书不计。';works.querySelector('#books')?.append(note);
shell.insertBefore(works,shell.querySelector('.footer'));
const personal=document.createElement('main');personal.id='personalDevices';personal.className='page';personal.innerHTML='<section class="intro"><h1>个人设备</h1></section><section class="device-section"><h2>游戏设备</h2><div id="personalGameDevices" class="personal-grid"></div></section><section class="device-section"><h2>音乐设备</h2><div id="professionalDevices" class="personal-grid"></div></section><section class="device-section"><h2>其他设备</h2><div id="otherDevices" class="personal-grid"></div></section>';
shell.insertBefore(personal,shell.querySelector('.footer'));tabs.innerHTML='';
for(const [id,label] of [['games','游戏战绩'],['works','已阅作品'],['personalDevices','个人设备']]){const b=document.createElement('button');b.className='tab';b.dataset.page=id;b.textContent=label;b.onclick=()=>activate(id);tabs.append(b);}
const oldValues=currentValues;currentValues=()=>oldValues().filter(v=>v!=='DEVICE');if(selected==='DEVICE')selected='ALL';
const asset='assets/playnite/device-layout/';
const ipadProImage='https://www.apple.com.cn/newsroom/images/2024/05/apple-unveils-stunning-new-ipad-pro-with-m4-chip-and-apple-pencil-pro/article/Apple-iPad-Pro-silver-2-up-240507_big.jpg.large.jpg';
const g102Image='https://brainy.co.ke/cdn/shop/files/logitech-g102-lightsync-rgb-6-button-usb-gaming-mouse-black-792075.jpg?v=1735293334';
const tasollerPhoto='https://www.gamo2.com/jp/upload/save_image/10221938_671780b49b34d.png';
const wi1000Photo='https://soundmagcdn.fra1.cdn.digitaloceanspaces.com/product/82442/c/sliderZb27gt-desktop.webp';
const nx50Photo='https://uk.yamaha.com/en/files/9CB12EB0BEAB4A1693BBBA85B48A7D1C_12073_tcm117-1726888.jpg';
for(const d of devices){
 if(/^OMEN/i.test(d.name))d.image='https://kaas.hpcloud.hp.com/PROD/v2/renderbinary/7968199/7970480/con-win-nb-p-brunobear-23c1-omen-16-wd0000-16-wf0000-specification/con-nb-brunobear-omen-16-wd0000-16-wf0000-product-image';
 else if(/^iPad/i.test(d.name))d.image=ipadProImage;
 else if(/^iPhone/i.test(d.name))d.image=asset+'iphone.jpg';
 else if(/^(?:TASOLLER\s*PLUS|抬手乐\s*PLUS)$/i.test(String(d.name||'').trim()))d.image=tasollerPhoto;
}
const css=document.createElement('style');css.textContent=`
.work-panel[hidden]{display:none!important}.works-nav{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 24px}.work-tab{padding:9px 17px;border:1px solid var(--line);border-radius:999px;background:transparent;color:var(--muted);cursor:pointer;font:inherit;font-size:14px}.work-tab[aria-pressed=true]{background:var(--text);color:var(--bg);border-color:var(--text)}.reading-note{margin:30px 0 10px;font-size:13px;color:var(--muted)}
.device-section{margin:10px 0 36px}.device-section h2{font-size:18px;margin:0 0 16px}.personal-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}#personalDevices .ym-device-card{display:flex!important;flex-direction:column!important;height:auto!important;min-height:0!important;max-height:none!important;overflow:hidden;border:1px solid var(--line);border-radius:14px;background:var(--surface)}#personalDevices .ym-device-card .art{position:relative!important;width:100%!important;flex:auto!important;height:190px!important;background:#fff!important;margin:0!important;border-radius:0!important;overflow:hidden}#personalDevices .ym-device-card .art:after{display:none!important}#personalDevices .ym-device-card .art img{position:static!important;width:100%!important;height:100%!important;object-fit:contain!important;padding:16px;box-sizing:border-box;display:block!important;opacity:1!important}#personalDevices .ym-device-card .card-body{padding:16px!important;display:flex!important;min-height:72px!important;align-items:center!important}#personalDevices .ym-device-card .name{font-size:16px!important}#personalDevices .device-kind{font-size:12px;color:var(--muted);margin-bottom:5px}#gameModalImage[data-device-photo]{object-fit:contain!important;background:#fff!important} @media(max-width:700px){.personal-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#personalDevices .ym-device-card .art{height:155px!important}}@media(max-width:420px){.personal-grid{grid-template-columns:1fr}}
/* TASOLLER PLUS product photo: source image contains large white margins. Zoom the product itself, centered, without distorting it. */
#personalGameDevices .ym-device-card img[alt="TASOLLER PLUS"][src*="gamo2.com"]{transform:scale(1.58)!important;transform-origin:50% 50%!important;padding:0!important;object-fit:contain!important;object-position:center center!important}
#personalGameDevices .ym-device-card img[alt="TASOLLER PLUS"][src$="tasoller.svg"]{padding:5px!important;object-fit:contain!important;object-position:center center!important}

`;document.head.append(css);
(() => {
  'use strict';
  const safe = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const isPC = d => /^OMEN\s*9$/i.test(String(d.name || '').trim());
  const deviceName = d => isPC(d) ? 'OMEN9' : String(d.name || '').replace(/（13英寸）|\(13英寸\)|13\s*英寸|13-inch|13″/g, ' 13inch ').replace(/\s+/g, ' ').trim();
  const units = value => String(value || '').replace(/(\d+)\s*GB\b/g, '$1 GB').replace(/(\d+)\s*TB\b/g, '$1 TB').replace(/(\d+)\s*MHz\b/g, '$1 MHz');
  // The source homepage's legacy inline block removes TASOLLER PLUS from `devices`.
  // Restore it locally for the Personal Devices page so it always appears as its own card.
  const controller = {name:'TASOLLER PLUS', detail:'CHUNITHM Style Controller', spec:'音游专用控制器 · PC', platform:'Rhythm Controller', badge:'TASOLLER', image:tasollerPhoto, c1:'#773c87', c2:'#171527'};
  const gameDevices = [...devices];
  if (!gameDevices.some(d => /^(?:TASOLLER\s*PLUS|抬手乐\s*PLUS)$/i.test(String(d.name || '').trim()))) gameDevices.push(controller);
  const styleId = 'ymkf-device-minimal-style';
  {
    const style = document.getElementById(styleId) || document.createElement('style'); style.id = styleId;
    style.textContent = `
#personalGameDevices .ym-device-card .card-body{display:flex!important;flex-direction:row!important;align-items:flex-start!important;gap:12px!important;text-align:left!important}
#personalGameDevices .ym-device-card .device-title{min-width:0;flex:1;align-self:flex-start;text-align:left}
#personalGameDevices .ym-device-card .name{position:static!important;margin:0!important;white-space:normal!important;display:block!important;line-height:1.15!important;text-align:left!important}
#personalGameDevices .ym-device-card .device-storage{margin-top:5px;color:var(--muted);font-size:12px}
#personalGameDevices .ym-device-card .device-action{flex:none;align-self:center;margin-left:auto;padding:8px 11px;border:1px solid var(--line);border-radius:9px;background:var(--surface2);color:var(--text);font-size:12px;font-weight:650;white-space:nowrap;transition:background .18s,border-color .18s}
#personalGameDevices .ym-device-card[role=button]:hover .device-action,#personalGameDevices .ym-device-card[role=button]:focus-visible .device-action{background:var(--active);color:var(--active-text);border-color:var(--active)}
#personalGameDevices .ym-device-card:focus-visible{outline:2px solid var(--text);outline-offset:2px}
#personalGameDevices .ym-device-card .device-visual{font-size:clamp(20px,3vw,30px);font-weight:800}
#personalGameDevices .ym-device-card:not([role=button]){cursor:default}
@media(max-width:600px){#personalGameDevices .ym-device-card .card-body{gap:6px!important}#personalGameDevices .ym-device-card .device-action{padding:7px;font-size:11px}}
`;
    document.head.appendChild(style);
  }
  let opener = null;
  function openDevice(d, card) {
    const modal = document.querySelector('#gameModal');
    const content = document.querySelector('#gameModalContent');
    const img = document.querySelector('#gameModalImage');
    if (!modal || !content || !img) return;
    opener = card;
    document.querySelector('#gameModalTitle').textContent = 'OMEN9';
    document.querySelector('#gameModalTitle').style.left = '22px';
    img.onerror = null;
    img.src = d.image;
    img.alt = 'OMEN9';
    img.setAttribute('data-device-photo','');
    img.style.display = 'block';
    for (const id of ['gameModalCover', 'gameModalIcon']) {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    }
    // Verified from the owner's Windows hardware report (2026-09-16).
    const hardwareRows = [
      ['型号', 'HP OMEN 16-wf0xxx'],
      ['主板', 'HP 8BAB'],
      ['处理器', 'Intel Core i7-13700HX (16 cores / 24 threads)'],
      ['独立显卡', 'NVIDIA GeForce RTX 4050 Laptop GPU'],
      ['集成显卡', 'Intel UHD Graphics'],
      ['内存', 'Kingston 32GB (2 × 16GB) · 5600 MT/s（标称）'],
      ['容量', '约 1.5TB（KIOXIA KXG80ZNV512G 512GB + Fanxiang S500Pro 1TB）'],
      ['操作系统', 'Windows 11 Pro (64-bit)']
    ];
    const renderSpecRows = rows => rows.filter(([,value]) => value).map(([label,value]) => `<dt>${safe(label)}</dt><dd style="overflow-wrap:anywhere">${safe(units(value))}</dd>`).join('');
    // Peripherals are represented as separate device cards, so don't repeat them in the OMEN9 popup.
    content.innerHTML = `<div class="modal-stats"><div class="modal-stat"><small>设备</small><b>OMEN9</b></div><div class="modal-stat"><small>平台</small><b>PC(windows)</b></div></div><div class="modal-section" data-ymkf-omen-layout="1.1"><h3>硬件配置</h3><dl class="meta-grid">${renderSpecRows(hardwareRows)}</dl></div>`;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.querySelector('#gameModalClose')?.focus();
  }
  // Use the site's existing modal close/Escape/backdrop handling; restore focus.
  const modal = document.querySelector('#gameModal');
  if (modal) new MutationObserver(() => {
    if (opener && !modal.classList.contains('open')) {
      const target = opener; opener = null;
      document.querySelector('#gameModalTitle').style.removeProperty('left');
      document.querySelector('#gameModalImage').alt = '';
      document.querySelector('#gameModalImage').removeAttribute('data-device-photo');
      if (target.isConnected) target.focus({preventScroll:true});
    }
  }).observe(modal, {attributes:true, attributeFilter:['class']});
  window.renderDevices = function () {
    const host = document.querySelector('#personalGameDevices');
    host.innerHTML = '';
    gameDevices.forEach(d => {
      const pc = isPC(d);
      const el = document.createElement('article');
      el.className = 'media-card device-card ym-device-card ymkf-horizontal-card';
      el.style.setProperty('--dc1', d.c1);
      el.style.setProperty('--dc2', d.c2);
      const mobile = /^(?:iPhone|iPad)\b/i.test(deviceName(d));
      const storage = mobile ? (String(d.detail || '').match(/\d+(?:\.\d+)?\s*(?:TB|GB)\b/i) || [''])[0] : '';
      const kind = pc ? '电脑' : /^iPad/i.test(deviceName(d)) ? '平板' : /^iPhone/i.test(deviceName(d)) ? '手机' : /TASOLLER/i.test(String(d.name||'')) ? '音游控制器' : '';
      const visual = `<img src="${safe(d.image)}" alt="${safe(deviceName(d))}" loading="lazy">`;
      el.innerHTML = `<div class="art">${visual}</div><div class="card-body"><div class="device-title">${kind ? `<div class="device-kind">${safe(kind)}</div>` : ''}<div class="name">${safe(deviceName(d))}</div>${storage ? `<div class="device-storage">${safe(units(storage))}</div>` : ''}</div>${pc ? '<span class="device-action" aria-hidden="true">查看配置 →</span>' : ''}</div>`;
      const deviceImg = el.querySelector('img');
      if (deviceImg && /TASOLLER/i.test(String(d.name || ''))) {
        deviceImg.onerror = () => { deviceImg.onerror = null; deviceImg.src = asset + 'tasoller.svg'; };
      } else if (deviceImg && /^iPad/i.test(String(d.name || ''))) {
        deviceImg.onerror = () => { deviceImg.onerror = null; deviceImg.src = asset + 'ipad.jpg'; };
      }
      if (pc) {
        el.tabIndex = 0;
        el.setAttribute('role', 'button');
        el.setAttribute('aria-label', '查看 OMEN9 配置');
        el.setAttribute('aria-haspopup', 'dialog');
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => openDevice(d, el));
        el.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDevice(d, el); }
        });
      }
      host.appendChild(el);
    });
    const mouse = document.createElement('article');
    mouse.className = 'media-card device-card ym-device-card ymkf-horizontal-card';
    mouse.innerHTML = `<div class="art"><img src="${safe(g102Image)}" alt="Logitech G102" loading="lazy"></div><div class="card-body"><div class="device-title"><div class="device-kind">鼠标</div><div class="name">Logitech G102</div></div></div>`;
    const mouseImg = mouse.querySelector('img');
    mouseImg.onerror = () => { mouseImg.onerror = null; mouseImg.src = asset + 'g102.svg'; };
    host.appendChild(mouse);
  };
  // Refresh both the selector count and the currently visible library.
  if (typeof renderAll === 'function') renderAll();
  window.renderDevices();
})();



const escapeDeviceHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const personalDeviceCards=[
 ['professionalDevices',[
  ['钢琴','Kayserburg UH-130U','piano.jpg'],
  ['录音笔','SONY ICD-UX570F','sony.jpg'],
  ['耳机','SONY WI-1000XM2',wi1000Photo],
  ['音响','YAMAHA NX-50',nx50Photo]
 ]],
 ['otherDevices',[
  ['手表','DW CLASSIC黑','watch.png'],
  ['自行车','Tropix Mariano','bike.jpg']
 ]]
];
for(const [host,items] of personalDeviceCards){for(const [kind,name,img] of items){const card=document.createElement('article');card.className='ym-device-card';const src=/^https?:\/\//i.test(img)?img:asset+img;card.innerHTML=`<div class="art"><img src="${escapeDeviceHtml(src)}" alt="${escapeDeviceHtml(name)}" loading="lazy"></div><div class="card-body"><div><div class="device-kind">${escapeDeviceHtml(kind)}</div><div class="name">${escapeDeviceHtml(name)}</div></div></div>`;const photo=card.querySelector('img');const fallback=/WI-1000XM2/i.test(name)?asset+'wi1000xm2.svg':/NX-50/i.test(name)?asset+'nx50.svg':null;if(fallback){photo.onerror=()=>{photo.onerror=null;photo.src=fallback;};}document.getElementById(host).append(card);}}
activate('games');
});
