'use strict';
(() => {
 const config=window.JF_BACKEND;
 const configured=!!(config?.url&&config?.key&&window.supabase);
 const db=configured?window.supabase.createClient(config.url,config.key):null;
 const bucket='jf-media';
 function safeURL(value){try{const url=new URL(value,location.href);return ['https:','http:'].includes(url.protocol)?url.href:''}catch{return ''}}
 function normalize(p){const media=Array.isArray(p.media)?p.media.map(m=>({...m,url:safeURL(m.url)})).filter(m=>m.url&&['image','video'].includes(m.type)):[];return {...p,media,image:media.find(m=>m.type==='image')?.url||'',price:p.price==null?null:Number(p.price)}}
 async function list(publicOnly=true){if(!db)return {products:window.JF_PRODUCTS||[],categories:window.JF_CATEGORIES||[]};let q=db.from('jf_products').select('*').order('featured',{ascending:false}).order('created_at',{ascending:false});if(publicOnly)q=q.eq('published',true);const [p,c]=await Promise.all([q,db.from('jf_categories').select('name').order('name')]);if(p.error)throw p.error;if(c.error)throw c.error;return {products:p.data.map(normalize),categories:c.data.map(x=>x.name)}}
 function validateFiles(files){const allowed=['image/jpeg','image/png','image/webp','video/mp4','video/webm'];for(const f of files){if(!allowed.includes(f.type))throw Error('Use fotos JPG, PNG ou WebP e vídeos MP4 ou WebM.');if(f.size>50*1024*1024)throw Error('Cada arquivo pode ter no máximo 50 MB.')}}
 async function upload(file,id){validateFiles([file]);const ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','video/mp4':'mp4','video/webm':'webm'}[file.type];const path=id+'/'+crypto.randomUUID()+'.'+ext;const {error}=await db.storage.from(bucket).upload(path,file,{contentType:file.type,upsert:false});if(error)throw error;return {type:file.type.startsWith('video/')?'video':'image',path,url:db.storage.from(bucket).getPublicUrl(path).data.publicUrl}}
 async function removeFiles(media){const paths=media.map(m=>m.path).filter(Boolean);if(!paths.length)return;const {error}=await db.storage.from(bucket).remove(paths);if(error)throw error}
 window.JF_DATA={db,configured,list,normalize,safeURL,validateFiles,upload,removeFiles};
})();
