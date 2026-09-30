function start(daily){if(daily&&S.daily.day===dayKey())return;clearT();
 const seed=daily?[...dayKey()].reduce((a,c)=>a*31+c.charCodeAt(0)|0,7):Date.now();
 G={daily,rand:rng(seed),score:0,combo:0,bestCombo:0,ok:0,tot:0,rtS:0,st:{level:Math.min(S.level,6),acc:.7,spd:.4},left:60,lock:true,t0:0};
 let n=3;app.innerHTML=`<div class="res" style="margin-top:30vh"><div class="big" id="cd">3</div><p class="sub">Get ready</p></div>`;sfx.tick();
 const iv=setInterval(()=>{n--;if(n<=0){clearInterval(iv);play()}else{$('cd').textContent=n;sfx.tick()}},700);timers.push(iv)}
function play(){G.endAt=Date.now()+60000;
 app.innerHTML=`<div class="top"><span>Score <b id="sc">0</b></span><big id="tl">60</big><span>Combo <b id="cb">0</b></span></div><div class="tm"><i id="rb"></i></div><div class="flash" id="fl"></div><div class="grid" id="gr"></div><button class="link" onclick="quit()">Quit</button>`;
 const iv=setInterval(()=>{const l=Math.max(0,Math.ceil((G.endAt-Date.now())/1000));$('tl').textContent=l;if(l<=0)finish()},200);timers.push(iv);round()}
function round(){if(!G)return;const r=G.r=makeRound(G.st.level,G.rand),gr=$('gr');
 gr.style.gridTemplateColumns=`repeat(${r.d.grid},1fr)`;
 const l=S.set.dark===false||(S.set.dark===null&&!matchMedia('(prefers-color-scheme:dark)').matches)?52:72;
 let h='';for(let i=0;i<r.n;i++){const odd=i===r.target;h+=`<button class="t" data-i="${i}" aria-label="dot"><i style="background:hsl(${r.hue},70%,${odd?l+(l>60?-1:1)*r.d.delta*60:l}%);${odd?`width:${74-Math.min(14,r.d.delta*35)}%;height:${74-Math.min(14,r.d.delta*35)}%`:''}"></i></button>`}
 gr.innerHTML=h;gr.onpointerdown=e=>{const b=e.target.closest('.t');if(b)answer(+b.dataset.i)};
 G.lock=false;G.t0=performance.now();
 const rb=$('rb');rb.style.transition='none';rb.style.width='100%';void rb.offsetWidth;rb.style.transition=`width ${r.d.limit}ms linear`;rb.style.width='0%';
 clearTimeout(G.to);G.to=setTimeout(()=>answer(-1),r.d.limit);timers.push(G.to)}
function answer(i){if(!G||G.lock)return;G.lock=true;clearTimeout(G.to);
 const r=G.r,rt=performance.now()-G.t0,ok=i===r.target;G.tot++;
 const cells=$('gr').children;
 if(ok){G.ok++;G.rtS+=rt;G.combo++;G.bestCombo=Math.max(G.bestCombo,G.combo);const p=scoreCorrect(rt,G.st.level,G.combo);G.score+=p;
  cells[i].classList.add('ok');[3,5,10,20].includes(G.combo)?(sfx.combo(),flash(G.combo>=20?'Flow!':'Combo x'+comboMult(G.combo))):(sfx.ok(),flash(rt<500?'Perfect +'+p:rt<900?'Fast +'+p:'+'+p))}
 else{G.combo=0;G.score=Math.max(0,G.score-1);if(i>=0)cells[i].classList.add('no');cells[r.target].classList.add('show');sfx.no();flash(i<0?'Too slow -1':'-1')}
 adapt(G.st,ok,ok?rt:r.d.limit,r.d.limit);
 $('sc').textContent=G.score;$('cb').textContent=G.combo;
 setTimeout(()=>{if(G&&Date.now()<G.endAt)round()},ok?180:650)}
function finish(){if(!G)return;const g=G;clearT();G=null;sfx.end();
 const acc=g.tot?Math.round(g.ok/g.tot*100):0,rt=g.ok?g.rtS/g.ok/1000:0,nb=g.score>S.best;
 const k=dayKey(),y=dayKey(new Date(Date.now()-864e5));
 if(S.lastDay!==k){S.streak=S.lastDay===y?S.streak+1:1;S.lastDay=k}
 S.played++;S.total+=g.tot;S.correct+=g.ok;S.rtSum+=g.rtS;S.rtN+=g.ok;S.secs+=60;S.level=Math.round(g.st.level);
 S.bestCombo=Math.max(S.bestCombo,g.bestCombo);if(acc>S.bestAcc&&g.tot>=10)S.bestAcc=acc;if(rt&&(!S.bestRt||rt<S.bestRt))S.bestRt=rt;
 if(nb)S.best=g.score;S.today={day:k,score:Math.max(S.today.day===k?S.today.score:0,g.score)};
 if(g.daily)S.daily={day:k,score:g.score};
 S.hist=[{d:k,s:g.score,a:acc}].concat(S.hist).slice(0,50);save();
 app.innerHTML=`<div class="res" style="margin-top:6vh"><p class="sub">${g.daily?'Daily complete':"Time's up"}</p><div class="big">${g.score}</div><p class="sub">Score</p>${nb?'<p class="pop" style="color:var(--acc);font-weight:700">New best score</p>':''}${S.streak>1?`<p>${S.streak} day streak</p>`:''}</div>
 <div class="g2"><div class="stat"><b>${acc}%</b><span>Accuracy</span></div><div class="stat"><b>${rt?rt.toFixed(2)+'s':'–'}</b><span>Avg reaction</span></div><div class="stat"><b>${g.bestCombo}</b><span>Best combo</span></div><div class="stat"><b>${Math.round(g.st.level)}</b><span>Level reached</span></div></div>
 ${g.daily?'':'<button class="btn" onclick="start(false)">Play again</button>'}<button class="btn alt" onclick="home()">Home</button>`}
