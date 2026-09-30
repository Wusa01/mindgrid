
// ---------- storage ----------
const KEY='mindgrid.v1';
const def={best:0,bestCombo:0,bestAcc:0,bestRt:0,played:0,rtSum:0,rtN:0,correct:0,total:0,secs:0,streak:0,lastDay:'',today:{day:'',score:0},daily:{day:'',score:null},level:1,
 set:{sound:true,haptics:true,dark:null,reduce:false},hist:[]};
let S;
function load(){try{S=Object.assign({},def,JSON.parse(localStorage.getItem(KEY)||'{}'));S.set=Object.assign({},def.set,S.set)}catch(e){S=JSON.parse(JSON.stringify(def))}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
const dayKey=(d=new Date())=>d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
// ---------- feedback ----------
let ac;
function tone(f,d=.08,type='sine'){if(!S.set.sound)return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;g.gain.value=.06;o.connect(g);g.connect(ac.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+d);o.stop(ac.currentTime+d)}catch(e){}}
const vib=p=>{if(S.set.haptics&&navigator.vibrate)try{navigator.vibrate(p)}catch(e){}};
const sfx={ok:()=>{tone(660);vib(12)},no:()=>{tone(180,.18,'triangle');vib([30,40,30])},combo:()=>{tone(880,.1);setTimeout(()=>tone(1175,.12),90);vib(25)},end:()=>{tone(440,.15);setTimeout(()=>tone(330,.25),150)},tick:()=>tone(520,.05)};
// ---------- engine: RNG, difficulty, scoring ----------
function rng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
function difficulty(level){ // level 0..25 (float)
 return{grid:clamp(3+Math.floor(level/5),3,6),delta:Math.max(.06,.32*Math.pow(.9,level)),limit:Math.max(1.2,3.6-.1*level)*1000,mult:1+Math.floor(level/5)*.25};}
const comboMult=c=>c>=10?4:c>=5?3:c>=3?2:1;
function scoreCorrect(rt,level,combo){const d=difficulty(level);const sp=rt<500?2:rt<900?1:0;return Math.round(1*d.mult*comboMult(combo))+sp}
function adapt(st,ok,rt,limit){ // rolling average smoothing
 st.acc=st.acc*.8+(ok?1:0)*.2;st.spd=st.spd*.8+clamp(1-rt/limit,0,1)*.2;
 if(st.acc>.8&&st.spd>.35)st.level=clamp(st.level+.35,0,25);
 else if(st.acc<.55)st.level=clamp(st.level-.3,0,25);
 else st.level=clamp(st.level+.08,0,25);}
function makeRound(level,rand){const d=difficulty(level),n=d.grid*d.grid;return{d,n,target:Math.floor(rand()*n),hue:Math.floor(rand()*360)}}
// ---------- ui ----------
const $=id=>document.getElementById(id),app=$('app');
function applyTheme(){const r=document.documentElement;if(S.set.dark===null)r.removeAttribute('data-theme');else r.setAttribute('data-theme',S.set.dark?'dark':'light');document.body.className=S.set.reduce?'rm':''}
let G=null,timers=[];
function clearT(){timers.forEach(clearTimeout);timers.forEach(clearInterval);timers=[];if(G)G.raf&&cancelAnimationFrame(G.raf)}

function flash(t){const f=$('fl');if(f){f.textContent=t;f.classList.remove('pop');void f.offsetWidth;f.classList.add('pop')}}

function quit(){if(confirm('Quit this run? Progress from it will not be saved.'))home()}
