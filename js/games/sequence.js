const startSeq=()=>mini('seq','Sequence',(g,st,done)=>{const n=2+Math.floor(g.level/1.5),seq=[];for(let i=0;i<n;i++)seq.push(Math.floor(g.rand()*9));let inp=0;g.lock=true;
 st.innerHTML=`<div class="grid" id="gr" style="grid-template-columns:repeat(3,1fr)">`+[...Array(9)].map((_,i)=>`<button class="t" data-i="${i}"><i></i></button>`).join('')+`</div>`;
 const c=$('gr').children,lit=(i,on)=>{c[i].firstChild.style.background=on?'var(--acc)':'';c[i].classList.toggle('show',on)};
 seq.forEach((v,k)=>{timers.push(setTimeout(()=>lit(v,true),500+k*700));timers.push(setTimeout(()=>lit(v,false),500+k*700+450))});
 timers.push(setTimeout(()=>{g.lock=false;flash('Your turn')},500+n*700));
 $('gr').onpointerdown=e=>{const b=e.target.closest('.t');if(!b||g.lock)return;const i=+b.dataset.i;lit(i,true);timers.push(setTimeout(()=>lit(i,false),150));
  if(i!==seq[inp])done(false,0,700);else if(++inp===n)done(true,n,500);else sfx.tick()}});
