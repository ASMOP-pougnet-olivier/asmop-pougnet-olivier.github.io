(async function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const IN=window.__INLINE||{};
const get=async u=>IN[u]||(await fetch(u,{cache:'no-cache'})).json();
const path=p=>String(p||'').replace(/^\/(?!\/)/,'');
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
let info={},R={items:[]};
try{info=await get('data/infos.json')}catch(e){}
try{R=await get('data/realisations.json')}catch(e){$('#gal').innerHTML='<p>Les réalisations s’affichent une fois le site publié en ligne.</p>'}

/* Infos de contact (data/infos.json) */
const t=(info.telephone||'').replace(/\D/g,''),intl=t?'+33'+t.replace(/^0/,''):'';
$$('[data-i]').forEach(e=>{const k=e.dataset.i,v=k==='cp_ville'?[info.code_postal,info.ville].filter(Boolean).join(' '):info[k];if(v)e.textContent=v});
if(intl)$$('[data-tel]').forEach(a=>a.href='tel:'+intl);
if(info.email)$$('[data-mail]').forEach(a=>a.href='mailto:'+info.email);
const q=encodeURIComponent([info.adresse,info.code_postal,info.ville].filter(Boolean).join(' '));
if(q)$$('[data-maps]').forEach(a=>{a.href='https://www.google.com/maps/search/?api=1&query='+q;a.target='_blank';a.rel='noopener'});
if(info.facebook)$$('[data-fb]').forEach(a=>a.href=info.facebook);
const j=info.recrutement||{};
if(j.afficher===false){const s=$('#recrutement');if(s)s.remove();const n=$('nav a[href="#recrutement"]');if(n)n.remove()}
else{const l=$('[data-job-link]');if(l&&j.lien)l.href=j.lien;const x=$('[data-job-text]');if(x&&j.texte)x.textContent=j.texte;$$('[data-job]').forEach(e=>{if(j[e.dataset.job])e.textContent=j[e.dataset.job]})}

/* Galerie (data/realisations.json) */
const items=(R.items||[]).filter(x=>x&&x.image);
const cats=['Tout',...new Set(items.map(x=>x.categorie).filter(Boolean))];
let cur='Tout',list=[],idx=0;
const gal=$('#gal'),fil=$('#filters'),lb=$('#lb');
function render(){list=items.filter(g=>cur==='Tout'||g.categorie===cur);
 gal.innerHTML=list.map((g,i)=>`<button class="item" data-i="${i}" aria-label="Agrandir : ${esc(g.titre)}"><div class="im"><img loading="lazy" decoding="async" src="${esc(path(g.image))}" alt="${esc(g.titre)}"></div><div class="tx"><h3>${esc(g.titre)}</h3><p>${esc(g.description)}</p></div></button>`).join('')}
fil.innerHTML=cats.map(c=>`<button data-k="${esc(c)}" aria-pressed="${c===cur}">${esc(c)}</button>`).join('');
fil.onclick=e=>{const b=e.target.closest('button');if(!b)return;cur=b.dataset.k;[...fil.children].forEach(c=>c.setAttribute('aria-pressed',c===b));render()};
gal.onclick=e=>{const b=e.target.closest('.item');if(b)show(+b.dataset.i)};
function show(i){idx=(i+list.length)%list.length;const g=list[idx],im=lb.querySelector('img');im.src=path(g.image);im.alt=g.titre||'';lb.querySelector('figcaption').textContent=(g.titre||'')+(g.description?' – '+g.description:'');lb.classList.add('on')}
lb.querySelector('.x').onclick=()=>lb.classList.remove('on');
lb.querySelector('.p').onclick=()=>show(idx-1);
lb.querySelector('.n').onclick=()=>show(idx+1);
lb.onclick=e=>{if(e.target===lb)lb.classList.remove('on')};
let sx=0;lb.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
lb.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)show(idx+(d<0?1:-1))});
document.addEventListener('keydown',e=>{if(!lb.classList.contains('on'))return;if(e.key==='Escape')lb.classList.remove('on');if(e.key==='ArrowLeft')show(idx-1);if(e.key==='ArrowRight')show(idx+1)});
render();

/* Menu mobile, année, ancienneté */
const menu=$('#menu'),nav=$('#nav');
menu.onclick=()=>{const o=nav.classList.toggle('open');menu.setAttribute('aria-expanded',o)};
nav.onclick=e=>{if(e.target.closest('a'))nav.classList.remove('open')};
$('#yr').textContent=new Date().getFullYear();
const y=$('#yrs');if(y)y.textContent=new Date().getFullYear()-2004;

/* Diaporama de l'accueil : photos cochées « à la une » */
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const fr=$('.frame'),cap=fr.querySelector('figcaption');
let feat=items.filter(x=>x.vedette).slice(0,6);if(!feat.length)feat=items.slice(0,4);
if(!rm&&feat.length){
 const sl=feat.map(g=>{const i=document.createElement('img');i.src=path(g.image);i.alt=g.titre||'';i.className='s';i.dataset.t=g.titre||'';fr.insertBefore(i,cap);return i});
 let n=-1;const step=()=>{sl.forEach(s=>s.classList.remove('on'));n=(n+1)%sl.length;sl[n].classList.add('on');cap.textContent=sl[n].dataset.t+' · fabriqué par ASMOP'};
 setTimeout(()=>{step();setInterval(step,4000)},2500)}

/* Apparition progressive */
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});
 $$('.card,.trust>*,.asks,.two>*,.job .box>*').forEach(el=>{el.classList.add('rv');io.observe(el)})}
})();
