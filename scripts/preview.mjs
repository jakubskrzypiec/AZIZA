import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon','.pdf':'application/pdf','.mp4':'video/mp4'};
http.createServer((req,res)=>{
 const u=new URL(req.url,'http://localhost');
 let pathname=decodeURIComponent(u.pathname);if(pathname.startsWith('/AZIZA/'))pathname=pathname.slice(6);
 let file=path.resolve(root,'.'+pathname);
 if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);res.end();return;}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory()){
  if(!u.pathname.endsWith('/')){res.writeHead(301,{Location:u.pathname+'/'+u.search});res.end();return;}
  file=path.join(file,'index.html');
 }
 if(!fs.existsSync(file)){res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(fs.readFileSync(path.join(root,'404.html')));return;}
 res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
 const size=fs.statSync(file).size;res.setHeader('Accept-Ranges','bytes');
 const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
 if(range){const start=Number(range[1]),end=Math.min(range[2]?Number(range[2]):size-1,size-1);if(start> end){res.writeHead(416);res.end();return;}res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}
 else{res.setHeader('Content-Length',size);fs.createReadStream(file).pipe(res);}
}).listen(4173,'127.0.0.1',()=>console.log('AZIZA: http://127.0.0.1:4173/ (also /AZIZA/)'));
