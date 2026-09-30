function stats(){const acc=S.total?S.correct/S.total*100:0,rt=S.rtN?S.rtSum/S.rtN/1000:0;
 const foc=Math.round(acc),rea=rt?Math.round(clamp(100-(rt-.3)*100,0,100)):0,att=Math.round(clamp(S.level*4,0,100));
 const bar=(n,v)=>`<div>${n} <b>${v}</b></div><div class="bar"><i style="width:${v}%"></i></div>`;
 app.innerHTML=`<h1 style="font-size:30px">Your progress</h1>${bar('Focus score',foc)}${bar('Reaction score',rea)}${bar('Attention level',att)}
 <div class="g2"><div class="stat"><b>${S.played}</b><span>Games played</span></div><div class="stat"><b>${S.best}</b><span>Best score</span></div><div class="stat"><b>${S.bestCombo}</b><span>Best combo</span></div><div class="stat"><b>${rt?rt.toFixed(2)+'s':'–'}</b><span>Avg reaction</span></div><div class="stat"><b>${S.bestRt?S.bestRt.toFixed(2)+'s':'–'}</b><span>Best reaction</span></div><div class="stat"><b>${Math.round(S.secs/60)} min</b><span>Training time</span></div></div>
 <p class="sub">Training scores are practice feedback, not a measure of intelligence.</p><button class="btn alt" onclick="home()">Home</button>`}
function settings(){const T=(k,l)=>`<div class="row"><span>${l}</span><button class="tog ${S.set[k]?'on':''}" onclick="tg('${k}')" aria-label="${l}"></button></div>`;
 app.innerHTML=`<h1 style="font-size:30px">Settings</h1>${T('sound','Sound')}${T('haptics','Vibration')}<div class="row"><span>Dark mode</span><button class="tog ${S.set.dark===true||(S.set.dark===null&&matchMedia('(prefers-color-scheme:dark)').matches)?'on':''}" onclick="S.set.dark=!(document.documentElement.getAttribute('data-theme')==='dark'||(S.set.dark===null&&matchMedia('(prefers-color-scheme:dark)').matches));save();applyTheme();settings()"></button></div>${T('reduce','Reduce motion')}
 <button class="btn alt" style="color:var(--bad);border-color:var(--bad)" onclick="if(confirm('Delete all progress? This cannot be undone.')){S=JSON.parse(JSON.stringify(def));save();applyTheme();home()}">Reset progress</button><button class="btn alt" onclick="home()">Home</button>`}
function tg(k){S.set[k]=!S.set[k];save();applyTheme();settings();if(k==='sound')sfx.ok()}
const GAMES=[['Spot','start(false)'],['Recall','startRecall()'],['Track','startTrack()'],['Go / No-Go','startGNG()'],['Sequence','startSeq()'],['Count','startCount()'],['Stroop','startStroop()'],['React','startReact()']];
function home(){clearT();G=null;const t=S.today.day===dayKey()?S.today.score:0,dd=S.daily.day===dayKey();
 app.innerHTML=`<div><h1>MindGrid</h1><p class="sub">Train Your Focus</p></div>
 <button class="btn" onclick="start(false)">Quick Play</button>
 <button class="btn alt" onclick="start(true)" ${dd?'disabled':''}>${dd?'Daily done: '+S.daily.score+' pts':'Daily Challenge'}</button>
 <div class="stats"><div class="stat"><b>${t}</b><span>Today</span></div><div class="stat"><b>${S.best}</b><span>Best</span></div><div class="stat"><b>${S.streak}</b><span>Day streak</span></div></div>
 <p class="sub">Training</p><div class="g2">${GAMES.map(g=>`<button class="btn alt" onclick="${g[1]}">${g[0]}</button>`).join('')}</div>
 <button class="btn alt" onclick="stats()">Your progress</button><button class="btn alt" onclick="settings()">Settings</button>`}
