// Shared lives-based framework: each mini game only builds one round.
function mini(key,title,build){clearT();G={key,title,build,score:0,lives:3,rounds:0,level:0,t0:Date.now(),rand:rng(Date.now())};mnext()}
function mnext(){if(!G)return;G.lock=false;app.innerHTML=`<div class="top"><span>Score <b id="sc">${G.score}</b></span><span>Lives <b id="lv">${G.lives}</b></span><span>Round <b>${G.rounds+1}</b></span></div><div class="flash" id="fl"></div><div id="st"></div><button class="link" onclick="quit()">Quit</button>`;G.build(G,$('st'),mdone)}
function mdone(ok,pts,delay=800){if(!G||G.lock)return;G.lock=true;
 if(ok){G.score+=pts;G.level=clamp(G.level+.7,0,25);sfx.ok();flash('Correct')}else{G.lives--;G.level=clamp(G.level-.4,0,25);sfx.no();flash('Missed')}
 G.rounds++;$('sc').textContent=G.score;$('lv').textContent=G.lives;
 timers.push(setTimeout(()=>G&&G.lives<=0?mfin():mnext(),delay))}
function mfin(){const g=G;clearT();G=null;sfx.end();const k=dayKey(),y=dayKey(new Date(Date.now()-864e5));
 if(S.lastDay!==k){S.streak=S.lastDay===y?S.streak+1:1;S.lastDay=k}
 const bk='best_'+g.key,nb=g.score>(S[bk]||0);if(nb)S[bk]=g.score;S.played++;S.secs+=Math.round((Date.now()-g.t0)/1000);
 S.today={day:k,score:Math.max(S.today.day===k?S.today.score:0,g.score)};save();
 app.innerHTML=`<div class="res" style="margin-top:6vh"><p class="sub">${g.title} complete</p><div class="big">${g.score}</div><p class="sub">Score</p>${nb?'<p class="pop" style="color:var(--acc);font-weight:700">New best</p>':''}</div><div class="g2"><div class="stat"><b>${g.rounds}</b><span>Rounds</span></div><div class="stat"><b>${Math.round(g.level)}</b><span>Level reached</span></div></div>
 <button class="btn" onclick="G=null;${GAMES.find(x=>x[0]===g.title||x[1].toLowerCase().includes(g.key))[1]}">Play again</button><button class="btn alt" onclick="home()">Home</button>`}
