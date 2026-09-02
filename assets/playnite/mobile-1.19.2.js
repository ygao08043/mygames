(()=>{
  const mq=matchMedia('(max-width:720px)');
  let queued=false;
  const text=x=>(x?.textContent||'').trim().replace(/\s+/g,' ');
  function cardify(table){
    if(!table||table.dataset.ymkfMobileCard==='1'||table.closest('[data-ymkf-no-mobile-card]'))return;
    const heads=[...table.querySelectorAll('thead th')].map((th,i)=>text(th)||`字段 ${i+1}`);
    if(heads.length<2)return;
    table.dataset.ymkfMobileCard='1';table.classList.add('ymkf-mobile-card-table');
    for(const tr of table.querySelectorAll('tbody tr')){
      [...tr.children].forEach((td,i)=>{if(td.tagName==='TD'&&!td.dataset.label)td.dataset.label=heads[i]||`字段 ${i+1}`});
    }
  }
  function lazyImages(root=document){
    for(const img of root.querySelectorAll('img')){
      if(!img.getAttribute('decoding'))img.setAttribute('decoding','async');
      if(!img.getAttribute('loading')&&!img.closest('.hero,.game-hero,.topbar,.top,.who'))img.setAttribute('loading','lazy');
    }
  }
  function normalizeCopy(){
    if(!mq.matches)return;
    for(const p of document.querySelectorAll('.section-head p,.note')){
      if(p.dataset.ymkfMobileCopy==='1')continue;
      const before=p.textContent||'';
      const after=before.replace(/；?数据较多时拖动下方滑条/g,'；竖屏自动适配').replace(/数据较多时拖动下方滑条/g,'竖屏自动适配');
      if(after!==before)p.textContent=after;
      p.dataset.ymkfMobileCopy='1';
    }
  }
  function buildTimeline(){
    if(!mq.matches)return;
    const host=document.querySelector('#timeline');if(!host)return;
    const src=host.querySelector('.timeline');if(!src)return;
    const rows=[...src.querySelectorAll('.day-row')];
    const sig=rows.map(r=>text(r.querySelector('.day-label'))+'|'+[...r.querySelectorAll('.session')].map(s=>s.title||'').join('~')).join('||');
    let out=host.querySelector('#ymkf-mobile-timeline');
    if(out&&out.dataset.sig===sig)return;
    if(!out){out=document.createElement('div');out.id='ymkf-mobile-timeline';host.appendChild(out)}
    out.dataset.sig=sig;out.replaceChildren();
    for(const row of rows){
      const card=document.createElement('div');card.className='ymkf-mobile-day';
      const head=document.createElement('div');head.className='ymkf-mobile-day-head';head.textContent=text(row.querySelector('.day-label')).replace(/\s+/g,' · ');card.appendChild(head);
      const sessions=[...row.querySelectorAll('.session')];
      if(!sessions.length){const e=document.createElement('div');e.className='ymkf-mobile-empty';e.textContent='无游玩记录';card.appendChild(e)}
      for(const s of sessions){
        const item=document.createElement('div');item.className='ymkf-mobile-session';
        const dot=document.createElement('i');dot.className='ymkf-mobile-session-dot';dot.style.background=s.style.background||getComputedStyle(s).backgroundColor;
        const body=document.createElement('div');const parts=String(s.title||'').split(' · ');
        const b=document.createElement('b');b.textContent=parts.shift()||text(s.querySelector('.session-name'))||'游戏';
        const span=document.createElement('span');span.textContent=parts.join(' · ')||'会话';body.append(b,span);item.append(dot,body);card.appendChild(item);
      }
      out.appendChild(card);
    }
  }
  function enhance(){
    queued=false;document.documentElement.classList.toggle('ymkf-mobile',mq.matches);
    document.querySelectorAll('table').forEach(cardify);lazyImages();normalizeCopy();buildTimeline();
  }
  function queue(){if(queued)return;queued=true;requestAnimationFrame(enhance)}
  addEventListener('DOMContentLoaded',enhance,{once:true});addEventListener('load',enhance,{once:true});
  mq.addEventListener?.('change',enhance);
  new MutationObserver(queue).observe(document.documentElement,{subtree:true,childList:true});
  enhance();
})();
