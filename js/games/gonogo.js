const startGNG=()=>mini('gng','Go / No-Go',(g,st,done)=>{const go=g.rand()<.65,lim=Math.max(550,1100-40*g.level),r=g.rounds;
 st.innerHTML=`<div id="pd" style="height:min(70vw,360px);display:flex;align-items:center;justify-content:center;background:var(--card);border-radius:18px"><div style="width:110px;height:110px;background:var(--tile);border-radius:${go?'50%':'6px'}"></div></div><p class="sub" style="text-align:center">Tap circles. Ignore squares.</p>`;
 const t0=performance.now();$('pd').onpointerdown=()=>{if(!g.lock)done(go,go?(performance.now()-t0<500?2:1):0,400)};
 timers.push(setTimeout(()=>{if(g.rounds===r&&!g.lock)done(!go,1,250)},lim))});
