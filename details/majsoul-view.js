'use strict';
(() => {
  const $=id=>document.getElementById(id), kindNames={ranked:'段位场',friendly:'友人场',event:'活动场',tournament:'比赛场',other:'未分类模式'};
  let data=null,filtered=[],page=0;const pageSize=30;
  const day=t=>new Date(t*1000+28800000).toISOString().slice(0,10);
  const time=t=>new Date(t*1000+28800000).toISOString().slice(0,16).replace('T',' ');
  const pct=x=>x===null?'—':(x*100).toFixed(1)+'%';
  const num=x=>x===null?'—':Math.round(x).toLocaleString('zh-CN');
  const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
  function updateRooms(){
    const old=$('room').value;$('room').replaceChildren(new Option('所有房间','all'));
    const rows=data.records.filter(r=>r.players===+$('players').value&&($('kind').value==='all'||r.kind===$('kind').value));
    for(const room of [...new Set(rows.map(r=>r.room))].sort())$('room').add(new Option(room,room));
    if([...$('room').options].some(o=>o.value===old))$('room').value=old;
  }
  function render(){
    if(!data)return;const n=+$('players').value,kind=$('kind').value,room=$('room').value,from=$('from').value,to=$('to').value;
    filtered=data.records.filter(r=>r.players===n&&(kind==='all'||r.kind===kind)&&(room==='all'||r.room===room)&&(!from||day(r.startTime)>=from)&&(!to||day(r.startTime)<=to)).sort((a,b)=>b.startTime-a.startTime);
    const s=YMKFMajsoul.summarize(filtered,n);
    $('rank').textContent=(n===3?'三人场':'四人场')+' · '+(data.levels?.[n===3?'three':'four']||'段位待采集');
    $('metrics').replaceChildren();
    for(const [label,value,note] of [['已收录对局',num(s.count),'当前筛选范围'],['平均顺位',s.averagePlace===null?'—':s.averagePlace.toFixed(2),'数值越低越好'],['一位率',pct(s.firstRate),'一位场数 / 对局数'],['末位率',pct(s.lastRate),n===3?'三位场数 / 对局数':'四位场数 / 对局数']]){
      const card=el('div',undefined,'metric');card.append(el('span',label),el('strong',value),el('span',note));$('metrics').append(card);
    }
    $('distribution').replaceChildren();
    for(let i=0;i<n;i++){
      const row=el('div',undefined,'barrow'),bar=el('div',undefined,'bar'),fill=el('div',undefined,'fill');fill.style.width=(s.count?s.counts[i]/s.count*100:0)+'%';bar.append(fill);
      row.append(el('span',(i+1)+' 位'),bar,el('span',s.counts[i]+' · '+pct(s.count?s.counts[i]/s.count:null),'small'));$('distribution').append(row);
    }
    $('recent').replaceChildren();for(const r of filtered.slice(0,20).reverse()){const p=el('span',String(r.place),'place '+(r.place===1?'p1':r.place===n?'last':''));p.title=time(r.startTime)+' · '+r.room+' · '+num(r.finalPoints)+' 点';$('recent').append(p);}
    if(!filtered.length)$('recent').append(el('span','此筛选范围暂无已导入战绩','muted'));
    $('detailmetrics').textContent='累计对局时长 '+(s.duration/3600).toFixed(1)+' h · 平均终局点数 '+num(s.averagePoints);
    $('count').textContent=from&&to&&from>to?'开始日期不能晚于结束日期':'共 '+filtered.length+' 场';
    page=0;renderTable();
  }
  function renderTable(){
    const pages=Math.max(1,Math.ceil(filtered.length/pageSize));page=Math.min(page,pages-1);$('matches').replaceChildren();
    for(const r of filtered.slice(page*pageSize,(page+1)*pageSize)){
      const tr=el('tr');for(const v of [time(r.startTime),(kindNames[r.kind]||'未分类')+' / '+r.room+(r.hasAI?' · 含 AI':''),r.length,r.place+' / '+r.players,num(r.finalPoints),r.rankDelta===null?'—':(r.rankDelta>0?'+':'')+r.rankDelta,Math.round((r.endTime-r.startTime)/60)+' min'])tr.append(el('td',v));$('matches').append(tr);
    }
    if(!filtered.length){const tr=el('tr'),td=el('td','暂无数据。请调整筛选，或在电脑上登录采集后同步。','empty');td.colSpan=7;tr.append(td);$('matches').append(tr);}
    $('page').textContent=(page+1)+' / '+pages;$('previous').disabled=page===0;$('next').disabled=page>=pages-1;
  }
  for(const id of ['players','kind'])$(id).addEventListener('change',()=>{if(data){updateRooms();render();}});
  for(const id of ['room','from','to'])$(id).addEventListener('change',render);
  $('previous').onclick=()=>{page=Math.max(0,page-1);renderTable();};$('next').onclick=()=>{page++;renderTable();};
  $('reset').onclick=()=>{$('players').value='3';$('kind').value='ranked';$('room').value='all';$('from').value='';$('to').value='';if(data){updateRooms();render();}};
  fetch('../data/majsoul.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json();}).then(d=>{
    if(d.schema!==1||!Array.isArray(d.records))throw Error('数据格式不兼容');data=d;
    $('identity').textContent=(d.nickname||'YMKF')+' · 好友 ID '+d.friendId+' · 三人 / 四人独立统计';
    $('status').textContent=d.records.length?d.status+' · 目前收录 '+d.records.length+' 场。'+(d.warnings||[]).join('；'):'等待首次采集：在电脑上运行 OPEN_MAJSOUL.cmd，登录绑定账号后运行 RUN_SYNC.cmd。';
    const stops={viewed:'已读取打开过的牌谱页面',end:'已到可读取列表末尾',known:'已衔接本地历史',limit:'达到读取上限',error:'本次读取失败','repeated-page':'服务器重复分页'};
    $('coverage').textContent='最近采集：'+(d.coverage||[]).map(c=>({0:'全部',1:'友人',2:'段位',4:'比赛'}[c.type]||c.type)+' '+c.fetched+' 条，'+(stops[c.stop]||c.stop)).join('；');
    $('updated').textContent=d.updatedAt?' · 数据更新 '+new Date(d.updatedAt).toLocaleString('zh-CN',{timeZone:'Asia/Shanghai',hour12:false})+'（北京时间）':'';
    if(!d.records.some(r=>r.players===3&&r.kind==='ranked')&&d.records.some(r=>r.players===3))$('kind').value='all';
    updateRooms();render();
  }).catch(e=>{$('status').textContent='战绩暂时无法加载（'+e.message+'）。请运行同步器后重试。';$('status').classList.add('error');$('previous').disabled=true;$('next').disabled=true;});
})();
