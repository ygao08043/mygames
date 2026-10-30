(()=>{'use strict';const cats=[['ranked3','段位三人场'],['ranked4','段位四人场'],['friendly3','友人三人场'],['friendly4','友人四人场'],['event3','活动三人场'],['event4','活动四人场']],periodNames={total:'总',east:'东',south:'南'};let category='ranked3',period='total',data;
const $=id=>document.getElementById(id);function el(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;}const pct=(a,b)=>b?`${(a/b*100).toFixed(1)}%`:'—';
function tabs(){for(const[id,name]of cats){const b=el('button',name);b.type='button';b.dataset.key=id;b.onclick=()=>{category=id;render();};$('categories').append(b);}for(const[id,name]of Object.entries(periodNames)){const b=el('button',name);b.type='button';b.dataset.key=id;b.onclick=()=>{period=id;render();};$('periods').append(b);}}
function achievementIcon(index){
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');
 const paths=[
  'M12 3l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L4.8 8.2l5-.7z',
  'M7 4h10v4l3 3-3 3v6H7v-6l-3-3 3-3z',
  'M12 2l3 5 5 1-3.5 4 1 6-5.5-2.7L6.5 18l1-6L4 8l5-1z',
  'M12 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm-3 11-2 7 5-2 5 2-2-7',
  'M12 2l2.4 6.1L21 8.5l-5 4.1 1.5 6.3-5.5-3.3-5.5 3.3L8 12.6 3 8.5l6.6-.4z',
  'M5 4h14l-1 6-6 4-6-4zM8 15l-2 6 6-3 6 3-2-6',
  'M12 2l8 4v6c0 5-4 8-8 10-4-2-8-5-8-10V6zm-1 5v6l5-3z'
 ];
 const p=document.createElementNS(ns,'path');p.setAttribute('d',paths[index%paths.length]);svg.append(p);return svg;
}
function render(){for(const b of $('categories').children)b.setAttribute('aria-pressed',String(b.dataset.key===category));for(const b of $('periods').children)b.setAttribute('aria-pressed',String(b.dataset.key===period));$('heading').textContent=cats.find(x=>x[0]===category)[1]+' · '+periodNames[period];high();fans();$('metrics').replaceChildren();$('ranks').replaceChildren();const g=data.groups.find(x=>x.key===category),r=g?.periods?.[period];$('empty').hidden=!!r;$('placement').hidden=!r;
$('scope').textContent=period==='total'?'统计口径：东风＋半庄，按累计次数合并。':'统计口径：'+(period==='east'?'东风':'半庄')+'累计数据。';if(g?.otherModes?.length)$('scope').textContent+=' 此分类还含特殊规则，未纳入东／南合计。';
if(!r){$('empty').textContent=g?.available?'服务器未返回此模式的统计，暂不推断为零场。':'此分类尚无服务器统计返回。';return;}
const average=r.games?r.positions.reduce((s,v,i)=>s+v*(i+1),0)/r.games:null;
const wins=r.outcomesKnown?r.selfDraws+r.ron:null;const rate=v=>r.outcomesKnown?pct(v,r.rounds):'—';
for(const[name,value]of [['总场次',r.games],['总局数',r.rounds],['平均顺位',average===null?'—':average.toFixed(3)],['一位率',pct(r.positions[0],r.games)],['和牌率',rate(wins)],['放铳率',rate(r.dealIns)],['自摸率（和牌中）',wins?pct(r.selfDraws,wins):'—'],['平均打点',wins?(r.winPoints/wins).toFixed(0):'—'],['平均和牌巡目',wins?(r.winTurns/wins).toFixed(2):'—'],['副露率',pct(r.calls,r.rounds)],['立直率',pct(r.riichi,r.rounds)],['末位率',pct(r.positions.at(-1),r.games)],['被飞率',pct(r.fly,r.games)],['最高连庄',r.highestDealer],['流局率',rate(r.draws)],['被自摸率',rate(r.opponentSelfDraws)],['横移率',rate(r.sideways)],['和牌次数',wins??'—'],['放铳次数',r.outcomesKnown?r.dealIns:'—'],['立直局数',r.riichi]]){const c=el('div',undefined,'card');c.append(el('div',name,'muted'),el('div',String(value),'value'));$('metrics').append(c);}
r.positions.forEach((v,i)=>{const x=el('div',undefined,'rank'),bar=el('div',undefined,'bar'),fill=el('div',undefined,'fill');fill.style.width=(r.games?v/r.games*100:0)+'%';bar.append(fill);x.append(el('span',(i+1)+'位'),bar,el('span',`${v} · ${pct(v,r.games)}`));$('ranks').append(x);});}
function fans(){
 const root=$('fan-list'),status=$('fan-status');root.replaceChildren();const f=data.groups.find(x=>x.key===category)?.fanStats;
 if(!f?.available){status.textContent='番种达成次数尚未采集。请关闭专用雀魂浏览器，运行新版 OPEN_MAJSOUL.cmd 后再同步。';return;}
 status.textContent='按当前场次分类累计，不区分东／南；同一和牌可达成多个番种。'+(f.complete?'':'部分统计未返回，以下为已返回部分，次数可能不完整。');
 const entries=[...(f.entries||[]),{id:-1,name:'流局满贯',count:f.liujumanguan}];
 for(const x of entries){const c=el('div',undefined,'fan-item');c.append(el('span',x.name+(x.ancient?' · 古役':'')),el('strong',x.count===null?'—':Number(x.count).toLocaleString('zh-CN')+' 次'));root.append(c);}
}
const TILE_FRAMES= {"0m.png":{"h":129,"idx":0,"w":80,"x":486,"y":130},"0p.png":{"h":129,"idx":0,"w":80,"x":324,"y":0},"0s.png":{"h":129,"idx":0,"w":80,"x":405,"y":0},"1m.png":{"h":129,"idx":0,"w":80,"x":486,"y":0},"1p.png":{"h":129,"idx":0,"w":80,"x":567,"y":0},"1s.png":{"h":129,"idx":0,"w":80,"x":324,"y":130},"1z.png":{"h":129,"idx":0,"w":80,"x":324,"y":260},"2m.png":{"h":129,"idx":0,"w":80,"x":324,"y":390},"2p.png":{"h":129,"idx":0,"w":80,"x":324,"y":520},"2s.png":{"h":129,"idx":0,"w":80,"x":405,"y":130},"2z.png":{"h":129,"idx":0,"w":80,"x":243,"y":520},"3m.png":{"h":129,"idx":0,"w":80,"x":567,"y":130},"3p.png":{"h":129,"idx":0,"w":80,"x":405,"y":260},"3s.png":{"h":129,"idx":0,"w":80,"x":405,"y":390},"3z.png":{"h":129,"idx":0,"w":80,"x":405,"y":520},"4m.png":{"h":129,"idx":0,"w":80,"x":486,"y":260},"4p.png":{"h":129,"idx":0,"w":80,"x":567,"y":260},"4s.png":{"h":129,"idx":0,"w":80,"x":486,"y":390},"4z.png":{"h":129,"idx":0,"w":80,"x":486,"y":520},"5m.png":{"h":129,"idx":0,"w":80,"x":162,"y":0},"5p.png":{"h":129,"idx":0,"w":80,"x":0,"y":130},"5s.png":{"h":129,"idx":0,"w":80,"x":0,"y":260},"5z.png":{"h":129,"idx":0,"w":80,"x":0,"y":390},"6m.png":{"h":129,"idx":0,"w":80,"x":0,"y":520},"6p.png":{"h":129,"idx":0,"w":80,"x":81,"y":0},"6s.png":{"h":129,"idx":0,"w":80,"x":81,"y":130},"6z.png":{"h":129,"idx":0,"w":80,"x":81,"y":260},"7m.png":{"h":129,"idx":0,"w":80,"x":81,"y":390},"7p.png":{"h":129,"idx":0,"w":80,"x":81,"y":520},"7s.png":{"h":129,"idx":0,"w":80,"x":0,"y":0},"7z.png":{"h":129,"idx":0,"w":80,"x":162,"y":130},"8m.png":{"h":129,"idx":0,"w":80,"x":162,"y":260},"8p.png":{"h":129,"idx":0,"w":80,"x":162,"y":390},"8s.png":{"h":129,"idx":0,"w":80,"x":162,"y":520},"9m.png":{"h":129,"idx":0,"w":80,"x":243,"y":0},"9p.png":{"h":129,"idx":0,"w":80,"x":243,"y":130},"9s.png":{"h":129,"idx":0,"w":80,"x":243,"y":260},"back.png":{"h":129,"idx":0,"w":80,"x":243,"y":390}};
function tileCode(t){return String(t).trim().replace(/t$/,'');}
function tile(t){const code=tileCode(t),frame=TILE_FRAMES[code+'.png'];const node=el('span',undefined,'mj-tile');node.setAttribute('role','img');node.setAttribute('aria-label',code==='bd'?'万能牌':code==='back'?'牌背':code);node.title=code==='bd'?'万能牌 · 番数采用游戏返回结果':code;
if(frame){node.style.backgroundPosition=`-${frame.x/2}px -${frame.y/2}px`;}else if(code==='bd'){node.classList.add('mj-wild');}else{node.classList.add('mj-unknown');node.textContent='?';node.title='未识别的牌：'+String(t);}return node;}
function parseMeld(raw){const value=String(raw).trim();const typed=/^([a-z_]+)\((.*)\)$/i.exec(value);let type=typed?typed[1].toLowerCase():'';let cards=typed?typed[2].split(',').map(tileCode):value.split('|').map(tileCode);if(!typed&&cards.length===1&&/^[0-9][mpsz]$/.test(cards[0])){type='angang';const t=cards[0],normal=t.replace(/^0/,'5');cards=[normal,normal[0]==='5'&&normal[1]!=='z'?'0'+normal[1]:normal,normal,normal];}if(type==='angang'&&cards.length===4){const middle=cards.filter(x=>x[0]==='0').concat(cards.filter(x=>x[0]!=='0')).slice(0,2);cards=['back',...middle,'back'];}return {type,cards};}
function achievements(){
 const root=$('achievement-list'),status=$('achievement-status');
 if(!root||!status)return;
 root.replaceChildren();
 const a=data&&data.achievements;
 if(!a||!a.available||!Array.isArray(a.items)){
  status.textContent='对局成就尚未采集。请运行新版 OPEN_MAJSOUL.cmd 完成采集，再运行 RUN_SYNC.cmd。';
  return;
 }
 const items=a.items.filter(x=>{
  if(!x||typeof x.name!=='string'||!x.name.trim())return false;
  const n=Number(x.count);
  return Number.isSafeInteger(n)&&n>0;
 }).sort((x,y)=>Number(y.count)-Number(x.count)||String(x.name).localeCompare(String(y.name),'zh-CN'));
 if(!items.length){
  status.textContent='已读取成就数据，但当前没有累计次数大于 0 的已获得徽章。';
  return;
 }
 const collected=a.collectedAt?new Date(a.collectedAt):null;
 const timeLabel=collected&&!Number.isNaN(collected.getTime())?' · 更新于 '+collected.toLocaleString('zh-CN',{timeZone:'Asia/Shanghai'}):'';
 status.textContent=`已采集 ${items.length} 项已获得的对局成就；数字表示累计次数${timeLabel}。`;
 for(const x of items){
  const card=el('div',undefined,'achievement-item');
  const icon=typeof x.icon==='string'&&x.icon.length>0&&x.icon.length<=8?x.icon:'🏅';
  const medal=el('div',icon,'achievement-medal');
  medal.setAttribute('aria-hidden','true');
  const copy=el('div',undefined,'achievement-copy');
  copy.append(el('div',x.name,'achievement-name'));
  if(x.category)copy.append(el('div',x.category,'achievement-category'));
  if(x.description)copy.append(el('div',x.description,'achievement-description'));
  const n=Number(x.count);
  const count=el('strong',n.toLocaleString('zh-CN'),'achievement-count');
  count.title='累计获得次数';
  card.append(medal,copy,count);
  root.append(card);
 }
}
function high(){const root=$('highlights');root.replaceChildren();const records=data.highlights.filter(h=>h.key===category);if(!records.length){root.append(el('p','此分类尚未返回个人主页展示的和牌。','muted'));return;}
records.forEach(h=>{const card=el('div',undefined,'card');card.append(el('p','游戏内个人主页展示','muted'),el('h3',h.title||'和牌记录'),el('p',`${h.fan} 番 · 宝牌 ${h.dora}`));const hand=el('div',undefined,'mj-row');(h.hand||[]).forEach(t=>hand.append(tile(t)));card.append(hand);
if((h.melds||[]).length){card.append(el('p','副露 / 杠','note'));const row=el('div',undefined,'mj-melds');h.melds.forEach(raw=>{const meld=parseMeld(raw),group=el('div',undefined,'mj-group');group.title=meld.type==='angang'?'暗杠':'副露';meld.cards.forEach(t=>group.append(tile(t)));row.append(group);});card.append(row);}
if(h.winningTile){const win=el('div',undefined,'mj-win');win.append(el('span','和牌','note'),tile(h.winningTile));card.append(win);}
if([...(h.hand||[]),...(h.melds||[]),h.winningTile||''].some(t=>String(t).includes('bd')))card.append(el('p','含万能牌 · 番数保留游戏结算结果','note'));root.append(card);});}
(async()=>{try{const r=await fetch('../data/majsoul.json',{cache:'no-store'});if(!r.ok)throw Error('数据读取失败');data=await r.json();if(data.schema!==3)throw Error('请运行新版 OPEN_MAJSOUL.cmd，再运行 RUN_SYNC.cmd 更新累计统计。');data.groups??=[];data.highlights??=[];data.achievements??=null;const dt=data.updatedAt?new Date(data.updatedAt).toLocaleString('zh-CN',{timeZone:'Asia/Shanghai'}):'尚未采集';$('profile').textContent=`${data.nickname} · ID ${data.friendId} · 三麻 ${data.levels?.three||'待采集'} / 四麻 ${data.levels?.four||'待采集'}`;$('status').textContent=`${data.status} · 更新时间（北京时间）：${dt}`;tabs();achievements();render();high();}catch(e){$('profile').textContent='累计统计尚未就绪';$('status').textContent=e.message;$('placement').hidden=true;}})();
})();
