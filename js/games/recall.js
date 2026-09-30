function startRecall(){clearT();G={mode:'recall',rand:rng(Date.now()),score:0,lives:3,rounds:0,level:0,t0:Date.now(),lock:true};rround()}
function rround(){if(!G)return;const r=makeRound(G.level,G.rand),show=Math.max(500,1800-70*G.level);G.r=r;G.lock=true;
 app.innerHTML=`<div class="top"><span>Score <b id="sc">${G.score}</b></span><span>Lives <b id="lv">${G.lives}</b></span><span>Round <b>${G.rounds+1}</b></span></div><div class="flash" id="fl">Remember the highlighted dot</div><div class="grid" id="gr" style="grid-template-columns:repeat(${r.d.grid},1fr)"></div><button class="link" onclick="quit()">Quit</button>`;
 const gr=$('gr');let h='';for(let i=0;i<r.n;i++)h+=`<button class="t${i===r.target?' show':''}" data-i="${i}" aria-label="dot"><i${i===r.target?' style="background:var(--acc)"':''}></i></button>`;
 gr.innerHTML=h;gr.onpointerdown=e=>{const b=e.target.closest('.t');if(b)ranswer(+b.dataset.i)};
 const t=setTimeout(()=>{if(!G)return;gr.children[r.target].classList.remove('show');gr.children[r.target].firstChild.removeAttribute('style');G.lock=false;flash('Where was it?')},show);timers.push(t)}
function ranswer(i){if(!G||G.lock)return;G.lock=true;const c=$('gr').children,tg=G.r.target;
 if(i===tg){c[i].classList.add('ok');sfx.ok();G.score+=2+Math.floor(G.level/2);G.level=clamp(G.level+.7,0,25);flash('Correct')}
 else{c[i].classList.add('no');c[tg].classList.add('show');sfx.no();G.lives--;G.level=clamp(G.level-.4,0,25);flash('Missed')}
 G.rounds++;$('sc').textContent=G.score;$('lv').textContent=G.lives;
 const t=setTimeout(()=>G.lives<=0?rfinish():rround(),i===tg?450:900);timers.push(t)}
function rfinish(){const g=G;clearT();G=null;sfx.end();const k=dayKey(),y=dayKey(new Date(Date.now()-864e5));
 if(S.lastDay!==k){S.streak=S.lastDay===y?S.streak+1:1;S.lastDay=k}
 const nb=g.score>(S.bestRecall||0);if(nb)S.bestRecall=g.score;S.played++;S.secs+=Math.round((Date.now()-g.t0)/1000);
 S.today={day:k,score:Math.max(S.today.day===k?S.today.score:0,g.score)};save();
 app.innerHTML=`<div class="res" style="margin-top:6vh"><p class="sub">Recall complete</p><div class="big">${g.score}</div><p class="sub">Score</p>${nb?'<p class="pop" style="color:var(--acc);font-weight:700">New best Recall score</p>':''}</div>
 <div class="g2"><div class="stat"><b>${g.rounds}</b><span>Rounds</span></div><div class="stat"><b>${Math.round(g.level)}</b><span>Level reached</span></div></div>
 <button class="btn" onclick="startRecall()">Play again</button><button class="btn alt" onclick="home()">Home</button>`}
