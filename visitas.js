'use strict';
(async () => {
  const db = window.JF_DATA?.db;
  if (!db || !['ternure.com.br','www.ternure.com.br'].includes(location.hostname)) return;
  try {
    const {data} = await db.auth.getSession();
    if (data?.session) return;
    let visitor;
    try {
      visitor = localStorage.getItem('ternure-visitor-v1');
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(visitor || '')) {
        visitor = crypto.randomUUID();
        localStorage.setItem('ternure-visitor-v1', visitor);
      }
    } catch { visitor = crypto.randomUUID(); }
    await db.from('ternure_page_visits').insert({visitor_id:visitor,page:location.pathname.endsWith('catalogo.html')?'catalogo':'inicio'});
  } catch { /* Estatísticas nunca impedem o uso do catálogo. */ }
})();
