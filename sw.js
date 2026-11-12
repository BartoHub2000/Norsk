const V='n1200-v4';
const CORE=['./','index.html','data.js','manifest.json','icon-192.png','icon-512.png','apple-touch-icon.png'];
const AUD=["audio/a0001.mp3", "audio/a0051.mp3", "audio/a0101.mp3", "audio/a0151.mp3", "audio/a0201.mp3", "audio/a0251.mp3", "audio/a0301.mp3", "audio/a0351.mp3", "audio/a0401.mp3", "audio/a0451.mp3", "audio/a0501.mp3", "audio/a0551.mp3", "audio/a0601.mp3", "audio/a0651.mp3", "audio/a0701.mp3", "audio/a0751.mp3", "audio/a0801.mp3", "audio/a0851.mp3", "audio/a0901.mp3", "audio/a0951.mp3", "audio/a1001.mp3", "audio/a1051.mp3", "audio/a1101.mp3", "audio/a1151.mp3"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE.map(u=>new Request(u,{cache:'reload'})))).then(()=>caches.open(V)).then(c=>Promise.all(AUD.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>null))))); self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
async function ranged(req,resp){const range=req.headers.get('range'); if(!range||!resp) return resp; const buf=await resp.clone().arrayBuffer(); const L=buf.byteLength;
  const m=/bytes=(\d*)-(\d*)/.exec(range); if(!m) return resp; let s,e; if(m[1]===''){s=Math.max(0,L-(+m[2]||0)); e=L-1;} else {s=+m[1]; e=m[2]?Math.min(+m[2],L-1):L-1;}
  if(s>=L) return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+L}});
  const chunk=buf.slice(s,e+1); return new Response(chunk,{status:206,statusText:'Partial Content',headers:{'Content-Type':resp.headers.get('Content-Type')||'audio/mpeg','Content-Range':`bytes ${s}-${e}/${L}`,'Content-Length':String(chunk.byteLength),'Accept-Ranges':'bytes'}});}
self.addEventListener('fetch',e=>{const req=e.request; if(req.method!=='GET') return; const url=new URL(req.url); if(url.origin!==location.origin) return;
  e.respondWith((async()=>{const c=await caches.open(V); const key=url.pathname.endsWith('/')?url.pathname+'index.html':url.pathname;
    let r=await c.match(key,{ignoreSearch:true})||await c.match(req,{ignoreSearch:true});
    if(!r){try{const net=await fetch(url.href); if(net.ok&&net.status===200){c.put(key,net.clone());} r=net;}catch(err){return new Response('Offline',{status:503});}}
    return req.headers.get('range')?ranged(req,r):r;})());});
