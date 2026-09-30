const startCount=()=>mini('count','Count',(g,st,done)=>{const n=4+Math.floor(g.level*1.2),ms=Math.max(500,1400-40*g.level),pos=[];let h='';
 for(let k=0;k<n;k++){let x,y,t=0;do{x=Math.random()*88+2;y=Math.random()*88+2;t++}while(t<60&&pos.some(p=>Math.hypot(p[0]-x,p[1]-y)<11));pos.push([x,y]);h+=`<i style="position:absolute;left:${x}%;top:${y}%;width:8%;aspect-ratio:1;border-radius:50%;background:var(--tile)"></i>`}
 st.innerHTML=`<div id="bx" style="position:relative;width:100%;aspect-ratio:1;background:var(--card);border-radius:18px">${h}</div><div class="g2" id="op" style="margin-top:12px"></div>`;g.lock=true;
 timers.push(setTimeout(()=>{$('bx').innerHTML='<p class="sub" style="text-align:center;padding-top:40%">How many dots?</p>';const o=new Set([n]);while(o.size<4){const v=n+Math.floor(Math.random()*7)-3;if(v>0)o.add(v)}
  $('op').innerHTML=[...o].sort((a,b)=>a-b).map(v=>`<button class="btn alt" data-v="${v}">${v}</button>`).join('');g.lock=false;const t0=performance.now();
  $('op').onpointerdown=e=>{const b=e.target.closest('button');if(!b||g.lock)return;const ok=+b.dataset.v===n;done(ok,ok?(performance.now()-t0<2000?2:1)+Math.floor(n/5):0,700)}},ms))});
