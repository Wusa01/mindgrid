const startReact=()=>mini('react','React',(g,st,done)=>{st.innerHTML=`<button id="pad" style="width:100%;height:min(80vw,420px);border-radius:18px;font-size:44px;font-weight:800;background:var(--card);color:var(--fg)">WAIT...</button>`;
 const pad=$('pad'),r=g.rounds;let go=false,t0=0;
 timers.push(setTimeout(()=>{if(g.rounds!==r||g.lock)return;go=true;t0=performance.now();pad.textContent='TAP!';pad.style.background='var(--ok)';pad.style.color='#fff'},1200+Math.random()*2500));
 pad.onpointerdown=()=>{if(g.lock)return;if(!go){pad.textContent='FALSE START';return done(false,0,900)}
  const rt=performance.now()-t0;pad.textContent=(rt/1000).toFixed(3)+'s';if(!S.bestRt||rt/1000<S.bestRt)S.bestRt=rt/1000;S.rtSum+=rt;S.rtN++;save();done(true,rt<250?3:rt<400?2:1,900)}});
