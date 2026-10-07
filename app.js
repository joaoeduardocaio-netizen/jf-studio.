'use strict';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let products=Array.isArray(window.JF_PRODUCTS)?window.JF_PRODUCTS.filter(p=>p&&p.id&&p.name&&p.category):[];
const whatsapp=String(window.JF_CONFIG?.whatsapp||'').replace(/\D/g,'');
let categories=[...new Set(['Todos',...(window.JF_CATEGORIES||['Articulados','Decoração','Personalizados']),...products.map(p=>p.category)])];
let filter=new URLSearchParams(location.search).get('categoria')||'Todos',cart=[];
if(!categories.includes(filter))filter='Todos';
try{const saved=JSON.parse(localStorage.getItem('ternure-order')||'[]');if(Array.isArray(saved))cart=saved.filter(x=>x&&typeof x.id==='string'&&typeof x.name==='string'&&Number.isInteger(x.qty)&&x.qty>0&&x.qty<=999)}catch{}
const arrow='<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>';
function priceText(p){return p.price==null?'Consultar opções':new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(p.price))}
function productCard(p){const first=p.media?.[0];const url=window.JF_DATA?.safeURL(first?.url||p.image);return `<article class="product-card">${url?(first?.type==='video'?`<video src="${esc(url)}" controls playsinline preload="metadata" aria-label="${esc(p.name)}"></video>`:`<img src="${esc(url)}" alt="${esc(p.name)}" loading="lazy">`):''}<div class="product-info">${p.featured?'<span class="product-badge">Destaque</span>':''}<h3>${esc(p.name)}</h3><p class="price">${esc(priceText(p))}</p><button data-detail="${esc(p.id)}">Ver detalhes ${arrow}</button>${p.demo?'':`<button data-add="${esc(p.id)}">Adicionar ao pedido</button>`}</div></article>`}
let detailId;
function showDetails(id){const p=products.find(x=>String(x.id)===id);if(!p)return;detailId=id;$('#detailTitle').textContent=p.name;$('#detailDescription').textContent=p.description||'';$('#detailPrice').textContent=priceText(p);$('#detailAdd').textContent=p.demo?'Consultar disponibilidade':'Adicionar ao pedido';const media=p.media?.length?p.media:p.image?[{type:'image',url:p.image}]:[];$('#detailGallery').innerHTML=media.map(m=>{const u=window.JF_DATA?.safeURL(m.url);return !u?'':m.type==='video'?`<video src="${esc(u)}" controls playsinline preload="metadata"></video>`:`<img src="${esc(u)}" alt="${esc(p.name)}" loading="lazy">`}).join('');$('#productDialog').showModal()}
function productClick(e){const detail=e.target.closest('button[data-detail]');if(detail){showDetails(detail.dataset.detail);return}const b=e.target.closest('button[data-add]');const p=products.find(x=>String(x.id)===b?.dataset.add);if(p)add(p.id,p.name)}
function render(){
 if(!$('#products'))return;
 const q=($('#search')?.value||$('#headerQuery')?.value||'').trim().toLocaleLowerCase('pt-BR');
 const list=products.filter(p=>(filter==='Todos'||p.category===filter)&&(p.name+' '+(p.description||'')).toLocaleLowerCase('pt-BR').includes(q));
 const home=!location.pathname.endsWith('catalogo.html');$('#products').innerHTML=(home&&filter==='Todos'&&!q&&list.every(p=>p.demo)?list.slice(0,4):list).map(productCard).join('');
 const featured=products.filter(p=>p.featured);if($('#featuredSection')){$('#featuredSection').hidden=!featured.length;$('#featuredProducts').innerHTML=featured.map(productCard).join('')}
 $('#emptyCatalog').hidden=!!list.length;
 $('#emptyCatalog h2').textContent=products.length?'Nenhuma criação encontrada.':'Novas criações em breve';
 $('#emptyMessage').textContent=products.length?'Experimente outra busca ou categoria.':'Estamos preparando nosso catálogo.';
 $('#filterStatus').textContent=`${list.length} ${list.length===1?'criação':'criações'} · ${filter}`;
 const visible=['Todos',...categories.filter(c=>c!=='Todos')];if(!visible.includes(filter))visible.push(filter);
 $('#filters').innerHTML=visible.map(c=>`<button data-filter="${esc(c)}" class="${filter===c?'selected':''}" aria-pressed="${filter===c}">${esc(c)}</button>`).join('');
 $('#allFilters').innerHTML=categories.map(c=>`<button data-filter="${esc(c)}" aria-pressed="${filter===c}">${esc(c)}</button>`).join('');
}
let toastTimer;function toast(message){$('#toast').textContent=message;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,2600)}
function order(){return 'PEDIDO DE ORÇAMENTO — TERNURÊ\n\n'+cart.map(x=>`${x.qty} × ${x.name}`).join('\n')+'\n\nOpções, valores, data e entrega a combinar.'}
function renderCart(){$('#cartItems').innerHTML=cart.length?cart.map((x,i)=>`<div class="order-item"><div><p>${esc(x.name)}</p><div class="quantity"><button data-minus="${i}" aria-label="Diminuir quantidade">−</button><span>${x.qty}</span><button data-plus="${i}" aria-label="Aumentar quantidade">+</button></div></div><button class="remove" data-remove="${i}">Remover</button></div>`).join(''):'<p class="dialog-intro">Seu pedido está vazio. Conte sua ideia para solicitar uma presente personalizado.</p>';$('#orderActions').hidden=!cart.length;$('#sendOrder').hidden=!whatsapp;$('#count').textContent=cart.reduce((n,x)=>n+x.qty,0)}
function save(){try{localStorage.setItem('ternure-order',JSON.stringify(cart))}catch{}renderCart()}
function add(id,name){const item=cart.find(x=>x.id===id);if(item)item.qty=Math.min(999,item.qty+1);else cart.push({id:String(id),name:String(name),qty:1});save();toast('Adicionado ao seu pedido')}
function openWhatsApp(text){if(!whatsapp){$('#ideaDialog').showModal();return}window.open('https://wa.me/'+whatsapp+'?text='+encodeURIComponent(text),'_blank','noopener,noreferrer')}
$('#menuToggle').addEventListener('click',()=>{const open=$('#menuToggle').getAttribute('aria-expanded')!=='true';$('#menuToggle').setAttribute('aria-expanded',String(open));$('#menuToggle').setAttribute('aria-label',open?'Fechar menu':'Abrir menu');$('#siteNav').hidden=!open});
$('#siteNav').addEventListener('click',e=>{if(e.target.closest('a')){$('#menuToggle').setAttribute('aria-expanded','false');$('#menuToggle').setAttribute('aria-label','Abrir menu');$('#siteNav').hidden=true}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#menuToggle').setAttribute('aria-expanded','false');$('#siteNav').hidden=true}});
function chooseFilter(e){const b=e.target.closest('button[data-filter]');if(b){filter=b.dataset.filter;const url=new URL(location.href);if(filter==='Todos')url.searchParams.delete('categoria');else url.searchParams.set('categoria',filter);history.replaceState(null,'',url);render();$('#filterDialog').close()}}
$('#filters')?.addEventListener('click',chooseFilter);
$('#allFilters')?.addEventListener('click',chooseFilter);
$('#filterOpen')?.addEventListener('click',()=>$('#filterDialog').showModal());
$('#filterClose')?.addEventListener('click',()=>$('#filterDialog').close());
const initialSearch=new URLSearchParams(location.search).get('busca')||'';
if($('#search'))$('#search').value=initialSearch;
if($('#headerQuery'))$('#headerQuery').value=initialSearch;
$('#search')?.addEventListener('input',render);
$('#products')?.addEventListener('click',productClick);$('#featuredProducts')?.addEventListener('click',productClick);
$('#detailClose')?.addEventListener('click',()=>$('#productDialog').close());$('#productDialog')?.addEventListener('close',()=>{$('#detailGallery').querySelectorAll('video').forEach(v=>v.pause())});$('#detailAdd')?.addEventListener('click',()=>{const p=products.find(x=>String(x.id)===detailId);if(p){if(p.demo){$('#productDialog').close();openWhatsApp('Olá, Ternurê! Gostaria de consultar opções e disponibilidade de '+p.name+'.')}else add(p.id,p.name)}});
$('#cartOpen').addEventListener('click',()=>{$('#orderStatus').textContent='';$('#cartDialog').showModal()});$('#cartClose').addEventListener('click',()=>$('#cartDialog').close());
$('#cartItems').addEventListener('click',e=>{const d=e.target.closest('button')?.dataset;if(!d)return;const key=['plus','minus','remove'].find(k=>d[k]!==undefined);if(!key)return;const i=Number(d[key]);if(!Number.isInteger(i)||!cart[i])return;if(key==='plus')cart[i].qty=Math.min(999,cart[i].qty+1);else if(key==='minus'&&cart[i].qty>1)cart[i].qty--;else cart.splice(i,1);save()});
document.querySelectorAll('.hero-actions .outline,[data-custom]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();$('#customStatus').textContent='';$('#ideaDialog').showModal()}));$('#ideaClose').addEventListener('click',()=>$('#ideaDialog').close());
$('#contactOpen')?.addEventListener('click',()=>openWhatsApp(cart.length?order():'Olá, Ternurê! Gostaria de um orçamento para uma presente personalizado.'));
$('#customForm').addEventListener('submit',e=>{e.preventDefault();const idea=$('#idea').value.trim();if(!idea)return;add('custom-'+Date.now(),'Presente personalizado: '+idea);$('#idea').value='';$('#ideaDialog').close();$('#orderStatus').textContent='Sua ideia está no pedido. Envie para receber um orçamento.';$('#cartDialog').showModal()});
$('#sendOrder').addEventListener('click',()=>{if(cart.length)openWhatsApp(order())});
$('#copyOrder').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(order());$('#orderStatus').textContent='Pedido copiado.'}catch{$('#orderStatus').textContent='Use “Baixar pedido” ou envie pelo WhatsApp.'}});
$('#downloadOrder').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([order()],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='pedido-ternure.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
$('#year').textContent=new Date().getFullYear();render();save();

async function loadCatalog(){if(!window.JF_DATA?.configured)return;$('#emptyCatalog h2').textContent='Carregando catálogo…';$('#emptyMessage').textContent='';try{const data=await window.JF_DATA.list();const oldCategories=['Articulados','Personagens','Letreiros','Decoração','Chaveiros','Personalizados'];const real=data.products.filter(p=>!oldCategories.includes(p.category));products=real.length?real:window.JF_PRODUCTS;categories=[...new Set(['Todos',...window.JF_CATEGORIES,...data.categories.filter(c=>!oldCategories.includes(c)),...products.map(p=>p.category)])];$('#catalogNotice').hidden=!!real.length;const requested=new URLSearchParams(location.search).get('categoria')||'Todos';filter=categories.includes(requested)?requested:'Todos';render()}catch(error){render();$('#catalogNotice').hidden=false;$('#catalogNotice').textContent='Prévia ilustrativa. Não foi possível atualizar os produtos agora; consulte pelo WhatsApp.';console.error('Catálogo JF:',error.message)}}
loadCatalog();
