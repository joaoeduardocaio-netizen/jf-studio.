'use strict';
const CACHE='jf-admin-shell-ternure-visits-v3';
const SHELL=['admin.html','admin.css','admin.js','admin-analytics.js','admin-install.js','admin.webmanifest','config.js','dados.js','assets/supabase-2.117.2.js','assets/ternure/logo.webp','assets/atelier-sans.otf','assets/atelier-sans-bold.otf','jf-admin-192.png','jf-admin-512.png','jf-admin-180.png'].map(path=>new URL(path,self.registration.scope).href);
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('jf-admin-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
// Cache apenas do HTML vazio e arquivos estáticos. Nenhum token, produto ou resposta de API.
self.addEventListener('fetch',event=>{const url=new URL(event.request.url),key=url.origin+url.pathname;if(event.request.method!=='GET'||!SHELL.includes(key))return;event.respondWith((async()=>{const cache=await caches.open(CACHE);try{const response=await fetch(event.request);if(response.ok)await cache.put(key,response.clone());return response}catch(error){const cached=await cache.match(key);if(cached)return cached;throw error}})())});
