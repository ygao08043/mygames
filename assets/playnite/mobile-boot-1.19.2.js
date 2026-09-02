(()=>{
  const nativeFetch=window.fetch.bind(window);
  window.fetch=(input,init)=>{
    try{
      const raw=typeof input==='string'?input:(input instanceof URL?input.href:'');
      if(raw){
        const u=new URL(raw,location.href);
        if(u.origin===location.origin&&/\.json$/i.test(u.pathname)){
          const v=u.searchParams.get('v');
          if(v&&/^\d{10,}$/.test(v))u.searchParams.delete('v');
          for(const k of ['_','ts','timestamp']){const x=u.searchParams.get(k);if(x&&/^\d{10,}$/.test(x))u.searchParams.delete(k)}
          const next=Object.assign({},init||{}, {cache:'no-cache'});
          return nativeFetch(u.href,next);
        }
      }
    }catch(_){ }
    return nativeFetch(input,init);
  };
})();
