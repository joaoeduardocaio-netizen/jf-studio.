'use strict';
(() => {
 const el=id=>document.getElementById(id),dashboard=el('dashboard');
 const format=n=>new Intl.NumberFormat('pt-BR').format(Number(n)||0);
 let run=0;
 function clear(){for(const id of ['visitsToday','visitsMonth','visitsViews','visitsTotal'])el(id).textContent='—';el('visitsChart').replaceChildren();el('visitsPages').replaceChildren();el('visitsStatus').textContent='';}
 async function load(){
  if(dashboard.hidden)return;
  const token=++run;el('visitsRefresh').disabled=true;el('visitsStatus').textContent='Carregando…';
  try {
   const {data,error}=await window.JF_DATA.db.rpc('ternure_visit_report');
   if(token!==run||dashboard.hidden)return;
   if(error||!data)throw Error('Não foi possível carregar as visitas. Tente atualizar.');
   for(const [id,key] of [['visitsToday','today'],['visitsMonth','month'],['visitsViews','month_views'],['visitsTotal','total']])el(id).textContent=format(data[key]);
   const daily=data.daily||[],max=Math.max(1,...daily.map(d=>Number(d.visitors)||0));
   el('visitsChart').replaceChildren();
   for(const day of daily){
    const date=String(day.day).slice(5,10).split('-').reverse().join('/');
    const column=document.createElement('div');column.className='visit-column';column.setAttribute('aria-label',date+': '+format(day.visitors)+' visitantes');
    const track=document.createElement('div');track.className='visit-track';
    const bar=document.createElement('div');bar.className='visit-bar';bar.style.height=(Number(day.visitors)/max*100)+'%';track.append(bar);
    const label=document.createElement('small');label.textContent=date;
    const count=document.createElement('strong');count.textContent=format(day.visitors);column.append(track,label,count);el('visitsChart').append(column);
   }
   el('visitsPages').replaceChildren();
   if(!data.pages?.length)el('visitsPages').textContent='Nenhuma visita registrada neste mês.';
   for(const page of data.pages||[]){const row=document.createElement('div');row.className='visit-page-row';const name=document.createElement('span');name.textContent=page.page==='catalogo'?'Catálogo':'Página inicial';const count=document.createElement('strong');count.textContent=format(page.views)+' visualizações';row.append(name,count);el('visitsPages').append(row);}
   el('visitsStatus').textContent='Atualizado agora';
  }catch(e){if(token===run&&!dashboard.hidden){clear();el('visitsStatus').textContent=e.message;}}
  finally{if(token===run)el('visitsRefresh').disabled=false;}
 }
 el('visitsRefresh').addEventListener('click',load);
 new MutationObserver(()=>{if(dashboard.hidden){++run;clear();el('visitsRefresh').disabled=false;}else load();}).observe(dashboard,{attributes:true,attributeFilter:['hidden']});
 if(!dashboard.hidden)load();
})();
