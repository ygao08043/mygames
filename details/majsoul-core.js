/* YMKF Mahjong Soul 1.0.0 - own-account match summaries only. */
(function(root){
  'use strict';
  const rooms={1:'铜之间',2:'铜之间',3:'铜之间',17:'铜之间',18:'铜之间',4:'银之间',5:'银之间',6:'银之间',19:'银之间',20:'银之间',7:'金之间',8:'金之间',9:'金之间',21:'金之间',22:'金之间',10:'玉之间',11:'玉之间',12:'玉之间',23:'玉之间',24:'玉之间',15:'王座之间',16:'王座之间',25:'王座之间',26:'王座之间'};
  const events={13:'活动模式 13',14:'活动模式 14',33:'宝牌狂热',40:'修罗之战',41:'赤羽之战'};
  function rankLabel(level){
    const id=Number(level?.id); if(!Number.isInteger(id)||id<10000)return null;
    const tier=Math.floor(id/100)%100, star=id%100;
    const name={1:'初心',2:'雀士',3:'雀杰',4:'雀豪',5:'雀圣',6:'魂天'}[tier];
    return name?name+(star?' '+star+' 星':''):null;
  }
  function normalize(h,accountId,overrides={}){
    if(!h||typeof h.uuid!=='string'||!/^[a-zA-Z0-9_-]{8,100}$/.test(h.uuid))throw Error('Invalid replay UUID');
    const me=(h.accounts||[]).find(a=>Number(a.account_id)===Number(accountId));
    if(!me)throw Error('Account is not a participant');
    const players=h.result?.players; if(!Array.isArray(players)||![3,4].includes(players.length))throw Error('Unsupported player count');
    const n=players.length, seats=players.map(p=>Number(p.seat??0));
    if(new Set(seats).size!==n||seats.some(s=>!Number.isInteger(s)||s<0||s>=n))throw Error('Invalid seats');
    const seat=Number(me.seat??0), own=players.find(p=>Number(p.seat??0)===seat);
    if(!own)throw Error('Missing own result');
    const start=Number(h.start_time),end=Number(h.end_time);
    if(!Number.isFinite(start)||!Number.isFinite(end)||start<1483228800||end<start||end-start>86400||end>Date.now()/1000+86400)throw Error('Invalid match time');
    // Proto3 omits zero values. Result order is retained for exact score ties.
    const finalPoints=Number(own.part_point_1??0), resultPoints=Number(own.total_point??0);
    if(!Number.isFinite(finalPoints)||!Number.isFinite(resultPoints))throw Error('Invalid points');
    const sorted=players.map((p,i)=>({p,i})).sort((a,b)=>Number(b.p.total_point??0)-Number(a.p.total_point??0)||a.i-b.i);
    const place=sorted.findIndex(x=>Number(x.p.seat??0)===seat)+1;
    const cfg=h.config||{}, modeId=Number(cfg.meta?.mode_id||0), category=Number(cfg.category||0), mode=Number(cfg.mode?.mode||0);
    let kind='other', room='未分类模式 '+modeId;
    if(category===1){kind='friendly';room='友人场';}
    else if(category===4){kind='tournament';room='比赛场';}
    else if(category===2&&rooms[modeId]){kind='ranked';room=rooms[modeId];}
    else if(category===2&&events[modeId]){kind='event';room=events[modeId];}
    const ov=overrides[String(modeId)];
    if(category===2&&ov&&['ranked','event','other'].includes(ov.kind)){kind=ov.kind;room=String(ov.label||room).slice(0,80);}
    const length=mode%10===1?'东风':mode%10===2?'半庄':'特殊规则';
    return {uuid:h.uuid,startTime:start,endTime:end,players:n,kind,room,modeId,category,mode,length,place,finalPoints,resultPoints,rankDelta:kind==='ranked'?Number(own.grading_score??0):null,hasAI:!!cfg.mode?.ai,level:rankLabel(n===3?me.level3:me.level)};
  }
  function summarize(rows,n){
    const counts=Array(n).fill(0);for(const r of rows)if(r.place>=1&&r.place<=n)counts[r.place-1]++;
    const count=rows.length;
    return {count,counts,averagePlace:count?rows.reduce((s,r)=>s+r.place,0)/count:null,firstRate:count?counts[0]/count:null,lastRate:count?counts[n-1]/count:null,duration:rows.reduce((s,r)=>s+r.endTime-r.startTime,0),averagePoints:count?rows.reduce((s,r)=>s+r.finalPoints,0)/count:null};
  }
  const api={normalize,summarize,rankLabel};root.YMKFMajsoul=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
