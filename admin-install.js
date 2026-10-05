'use strict';
(() => {
 const panel=document.querySelector('#installPanel'),button=document.querySelector('#installApp'),hint=document.querySelector('#installHint'),connection=document.querySelector('#connectionStatus');
 let installEvent;
 const standalone=()=>window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 const ios=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 function showInstructions(){panel.hidden=standalone();hint.textContent=ios?'Toque em Compartilhar → Adicionar à Tela de Início.':'Abra o menu ⋮ do navegador e escolha “Instalar aplicativo” ou “Adicionar à tela inicial”.';button.textContent=installEvent?'Instalar painel':'Como instalar'}
 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvent=e;if(!standalone()){panel.hidden=false;hint.textContent='Instale para abrir o painel direto pelo ícone.';button.textContent='Instalar painel'}});
 button.addEventListener('click',async()=>{if(!installEvent){showInstructions();return}button.disabled=true;try{await installEvent.prompt();const choice=await installEvent.userChoice;installEvent=null;if(choice.outcome==='accepted')panel.hidden=true;else showInstructions()}catch{installEvent=null;showInstructions()}finally{button.disabled=false}});
 window.addEventListener('appinstalled',()=>{installEvent=null;panel.hidden=true});
 function onlineStatus(){connection.hidden=navigator.onLine;connection.textContent='Sem conexão. Conecte-se à internet para entrar e salvar alterações no catálogo.'}
 window.addEventListener('online',onlineStatus);window.addEventListener('offline',onlineStatus);onlineStatus();showInstructions();
 if('serviceWorker' in navigator&&window.isSecureContext){navigator.serviceWorker.register('./admin-sw.js',{scope:'./',updateViaCache:'none'}).then(r=>r.update()).catch(()=>{hint.textContent='Para instalar, use o menu do navegador → Adicionar à tela inicial.'})}
})();
