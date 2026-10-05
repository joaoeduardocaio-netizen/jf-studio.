'use strict';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const products=Array.isArray(window.JF_PRODUCTS)?window.JF_PRODUCTS.filter(p=>p&&p.id&&p.name&&p.category):[];
const whatsapp=String(window.JF_CONFIG?.whatsapp||'').replace(/\D/g,'');
const categories=[...new Set(['Todos',...(window.JF_CATEGORIES||['Articulados','Decoração','Personalizados']),...products.map(p=>p.category)])];
let filter=new URLSearchParams(location.search).get('categoria')||'Todos',cart=[];
if(!categories.includes(filter))filter='Todos';
try{const saved=JSON.parse(localStorage.getItem('jf-atelie-order')||'[]');if(Array.isArray(saved))cart=saved.filter(x=>x&&typeof x.id==='string'&&typeof x.name==='string'&&Number.isInteger(x.qty)&&x.qty>0&&x.qty<=999)}catch{}
const arrow='<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>';
function render(){
 if(!$('#products'))return;
 const q=$('#search').value.trim().toLocaleLowerCase('pt-BR');
 const list=products.filter(p=>(filter==='Todos'||p.category===filter)&&(p.name+' '+(p.description||'')).toLocaleLowerCase('pt-BR').includes(q));
 $('#products').innerHTML=list.map(p=>`<article class="product-card">${p.image?`<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">`:''}<div class="product-info"><h3>${esc(p.name)}</h3>${p.description?`<p>${esc(p.description)}</p>`:''}<button data-add="${esc(p.id)}">Adicionar ao pedido ${arrow}</button></div></article>`).join('');
 $('#emptyCatalog').hidden=!!list.length;
 $('#emptyCatalog h2').textContent=products.length?'Nenhuma criação encontrada.':'Novas criações em breve.';
 $('#emptyMessage').textContent=products.length?'Experimente outra busca ou categoria.':'Estamos preparando nosso catálogo. Enquanto isso, conte sua ideia para a JF Studio.';
 $('#filterStatus').textContent=`${list.length} ${list.length===1?'criação':'criações'} · ${filter}`;
 $('#filters').innerHTML=categories.map(c=>`<button data-filter="${esc(c)}" class="${filter===c?'selected':''}" aria-pressed="${filter===c}">${esc(c)}</button>`).join('');
}
let toastTimer;function toast(message){$('#toast').textContent=message;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,2600)}
function order(){return 'PEDIDO DE ORÇAMENTO — JF STUDIO\n\n'+cart.map(x=>`${x.qty} × ${x.name}`).join('\n')+'\n\nCores, medidas, valores e prazo a combinar.'}
function renderCart(){$('#cartItems').innerHTML=cart.length?cart.map((x,i)=>`<div class="order-item"><div><p>${esc(x.name)}</p><div class="quantity"><button data-minus="${i}" aria-label="Diminuir quantidade">−</button><span>${x.qty}</span><button data-plus="${i}" aria-label="Aumentar quantidade">+</button></div></div><button class="remove" data-remove="${i}">Remover</button></div>`).join(''):'<p class="dialog-intro">Seu pedido está vazio. Conte sua ideia para solicitar uma peça personalizada.</p>';$('#orderActions').hidden=!cart.length;$('#sendOrder').hidden=!whatsapp;$('#count').textContent=cart.reduce((n,x)=>n+x.qty,0)}
function save(){try{localStorage.setItem('jf-atelie-order',JSON.stringify(cart))}catch{}renderCart()}
function add(id,name){const item=cart.find(x=>x.id===id);if(item)item.qty=Math.min(999,item.qty+1);else cart.push({id:String(id),name:String(name),qty:1});save();toast('Adicionado ao seu pedido')}
function openWhatsApp(text){if(!whatsapp){$('#ideaDialog').showModal();return}window.open('https://wa.me/'+whatsapp+'?text='+encodeURIComponent(text),'_blank','noopener,noreferrer')}
$('#menuToggle').addEventListener('click',()=>{const open=$('#menuToggle').getAttribute('aria-expanded')!=='true';$('#menuToggle').setAttribute('aria-expanded',String(open));$('#menuToggle').setAttribute('aria-label',open?'Fechar menu':'Abrir menu');$('#siteNav').hidden=!open});
$('#siteNav').addEventListener('click',e=>{if(e.target.closest('a')){$('#menuToggle').setAttribute('aria-expanded','false');$('#menuToggle').setAttribute('aria-label','Abrir menu');$('#siteNav').hidden=true}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#menuToggle').setAttribute('aria-expanded','false');$('#siteNav').hidden=true}});
$('#filters')?.addEventListener('click',e=>{const b=e.target.closest('button[data-filter]');if(b){filter=b.dataset.filter;const url=new URL(location.href);if(filter==='Todos')url.searchParams.delete('categoria');else url.searchParams.set('categoria',filter);history.replaceState(null,'',url);render()}});
$('#search')?.addEventListener('input',render);
$('#products')?.addEventListener('click',e=>{const b=e.target.closest('button[data-add]');const p=products.find(x=>String(x.id)===b?.dataset.add);if(p)add(p.id,p.name)});
$('#cartOpen').addEventListener('click',()=>{$('#orderStatus').textContent='';$('#cartDialog').showModal()});$('#cartClose').addEventListener('click',()=>$('#cartDialog').close());
$('#cartItems').addEventListener('click',e=>{const d=e.target.closest('button')?.dataset;if(!d)return;const key=['plus','minus','remove'].find(k=>d[k]!==undefined);if(!key)return;const i=Number(d[key]);if(!Number.isInteger(i)||!cart[i])return;if(key==='plus')cart[i].qty=Math.min(999,cart[i].qty+1);else if(key==='minus'&&cart[i].qty>1)cart[i].qty--;else cart.splice(i,1);save()});
document.querySelectorAll('.hero-actions .outline,[data-custom]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();$('#customStatus').textContent='';$('#ideaDialog').showModal()}));$('#ideaClose').addEventListener('click',()=>$('#ideaDialog').close());
$('#contactOpen')?.addEventListener('click',()=>openWhatsApp(cart.length?order():'Olá, JF Studio! Gostaria de um orçamento para uma peça personalizada.'));
$('#customForm').addEventListener('submit',e=>{e.preventDefault();const idea=$('#idea').value.trim();if(!idea)return;add('custom-'+Date.now(),'Projeto personalizado: '+idea);$('#idea').value='';$('#ideaDialog').close();$('#orderStatus').textContent='Sua ideia está no pedido. Envie para receber um orçamento.';$('#cartDialog').showModal()});
$('#sendOrder').addEventListener('click',()=>{if(cart.length)openWhatsApp(order())});
$('#copyOrder').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(order());$('#orderStatus').textContent='Pedido copiado.'}catch{$('#orderStatus').textContent='Use “Baixar pedido” ou envie pelo WhatsApp.'}});
$('#downloadOrder').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([order()],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='pedido-jf-studio.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
$('#year').textContent=new Date().getFullYear();render();save();
