function startTrack(){clearT();G={mode:'track',rand:rng(Date.now()),score:0,lives:3,rounds:0,level:0,t0:Date.now()};tround()}
function tround(){if(!G)return;cancelAnimationFrame(G.raf);const rnd=G.rand,n=Math.min(14,5+Math.floor(G.level)),spd=.16+.02*G.level,mv=2500+Math.min(3500,G.level*200),R=.034;
 app.innerHTML=`<div class="top"><span>Score <b id="sc">${G.score}</b></span><span>Lives <b id="lv">${G.lives}</b></span><span>Round <b>${G.rounds+1}</b></span></div><div class="flash" id="fl">Follow the highlighted dot</div><canvas id="cv" style="width:100%;aspect-ratio:1;background:var(--card);border-radius:18px;touch-action:none"></canvas><button class="link" onclick="quit()">Quit</button>`;
 const cv=$('cv'),dpr=window.devicePixelRatio||1,W=cv.clientWidth,ctx=cv.getContext('2d');cv.width=cv.height=W*dpr;ctx.scale(dpr,dpr);
 const D=[];for(let k=0;k<800&&D.length<n;k++){const x=R*2+rnd()*(1-4*R),y=R*2+rnd()*(1-4*R);if(D.every(d=>Math.hypot(d.x-x,d.y-y)>3.2*R)){const a=rnd()*6.283;D.push({x,y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd})}}
 const cs=getComputedStyle(document.documentElement),C={t:cs.getPropertyValue('--tile'),a:cs.getPropertyValue('--acc'),o:cs.getPropertyValue('--ok'),b:cs.getPropertyValue('--bad')};
 Object.assign(G,{D,target:Math.floor(rnd()*D.length),phase:'show',pick:-1,cv});let t0=performance.now(),last=t0;
 const ring=(d,c)=>{ctx.strokeStyle=c;ctx.lineWidth=4;ctx.beginPath();ctx.arc(d.x*W,d.y*W,R*W*1.7,0,6.283);ctx.stroke()};
 const dot=(d,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(d.x*W,d.y*W,R*W,0,6.283);ctx.fill()};
 function loop(now){if(!G||G.cv!==cv)return;const dt=Math.min(.05,(now-last)/1000);last=now;
  if(G.phase==='show'&&now-t0>1800){G.phase='move';t0=now}
  else if(G.phase==='move'){for(const d of D){d.x+=d.vx*dt;d.y+=d.vy*dt;if(d.x<R||d.x>1-R){d.vx*=-1;d.x=clamp(d.x,R,1-R)}if(d.y<R||d.y>1-R){d.vy*=-1;d.y=clamp(d.y,R,1-R)}}
   for(let i=0;i<D.length;i++)for(let j=i+1;j<D.length;j++){const a=D[i],b=D[j],dx=b.x-a.x,dy=b.y-a.y,dd=Math.hypot(dx,dy);if(dd<2.4*R&&dd>0){const nx=dx/dd,ny=dy/dd,rv=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(rv<0){a.vx+=rv*nx;a.vy+=rv*ny;b.vx-=rv*nx;b.vy-=rv*ny}const o=(2.4*R-dd)/2;a.x-=nx*o;a.y-=ny*o;b.x+=nx*o;b.y+=ny*o}}
   if(now-t0>mv){G.phase='pick';flash('Tap the target')}}
  ctx.clearRect(0,0,W,W);D.forEach((d,i)=>{const hi=G.phase==='show'&&i===G.target;dot(d,hi?C.a:C.t);if(hi)ring(d,C.a)});
  if(G.phase==='result'){D.forEach((d,i)=>{if(i===G.pick)dot(d,i===G.target?C.o:C.b)});ring(D[G.target],C.o)}
  G.raf=requestAnimationFrame(loop)}
 G.raf=requestAnimationFrame(loop);
 cv.onpointerdown=e=>{if(!G||G.phase!=='pick')return;const r=cv.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;let bi=-1,bd=9;D.forEach((d,i)=>{const q=Math.hypot(d.x-px,d.y-py);if(q<bd){bd=q;bi=i}});if(bd<3*R)tanswer(bi)}}
function tanswer(i){G.phase='result';G.pick=i;const ok=i===G.target;
 if(ok){sfx.ok();G.score+=3+Math.floor(G.level);G.level=clamp(G.level+.8,0,25);flash('Correct')}else{sfx.no();G.lives--;G.level=clamp(G.level-.5,0,25);flash('Missed')}
 G.rounds++;$('sc').textContent=G.score;$('lv').textContent=G.lives;
 const t=setTimeout(()=>G.lives<=0?tfinish():tround(),1100);timers.push(t)}
function tfinish(){const g=G;clearT();G=null;sfx.end();const k=dayKey(),y=dayKey(new Date(Date.now()-864e5));
 if(S.lastDay!==k){S.streak=S.lastDay===y?S.streak+1:1;S.lastDay=k}
 const nb=g.score>(S.bestTrack||0);if(nb)S.bestTrack=g.score;S.played++;S.secs+=Math.round((Date.now()-g.t0)/1000);
 S.today={day:k,score:Math.max(S.today.day===k?S.today.score:0,g.score)};save();
 app.innerHTML=`<div class="res" style="margin-top:6vh"><p class="sub">Track complete</p><div class="big">${g.score}</div><p class="sub">Score</p>${nb?'<p class="pop" style="color:var(--acc);font-weight:700">New best Track score</p>':''}</div>
 <div class="g2"><div class="stat"><b>${g.rounds}</b><span>Rounds</span></div><div class="stat"><b>${Math.round(g.level)}</b><span>Level reached</span></div></div>
 <button class="btn" onclick="startTrack()">Play again</button><button class="btn alt" onclick="home()">Home</button>`}
