import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const routes=JSON.parse(read('_source/routes.json'));
const seo=JSON.parse(read('_source/seo.json'));
const domain='https://www.aziza-suwiczak.pl/';
const pages=Object.values(routes).map(r=>({route:r,html:read(r+'index.html')}));

test('generated output matches the editable sources',()=>{
 const result=spawnSync(process.execPath,['scripts/build.mjs','--check'],{cwd:root,encoding:'utf8'});
 assert.equal(result.status,0,result.stdout+result.stderr);
});
test('every indexable page has unique metadata, one H1, canonical URL and valid structured data',()=>{
 const titles=new Set(),descriptions=new Set();
 for(const {route,html}of pages){
  const title=html.match(/<title>(.*?)<\/title>/s)?.[1],desc=html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  assert(title&&desc,route);assert(!titles.has(title),`Duplicate title ${route}`);assert(!descriptions.has(desc),`Duplicate description ${route}`);titles.add(title);descriptions.add(desc);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,route);
  assert.equal((html.match(/rel="canonical"/g)||[]).length,1,route);
  assert(html.includes(`rel="canonical" href="${domain+route}"`),route);
  assert(html.includes(`property="og:url" content="${domain+route}"`),route);
  assert(html.includes('name="twitter:card"'),route);
  const data=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert(data['@graph'].some(x=>x['@type']==='ProfessionalService'),route);
  assert(!html.includes('mailto:izabela.suwiczak@aziza-suwiczak.pl?subject='),route);
 }
});
test('links and media resolve at both the custom domain and GitHub repository prefix',()=>{
 for(const prefix of ['https://example.test/','https://example.test/AZIZA/'])for(const {route,html}of pages){
  const base=new URL(html.match(/<base href="([^"]+)"/)[1],prefix+route);
  assert.equal(base.href,prefix,`Base ${route}`);
  for(const m of html.matchAll(/\b(?:href|src|data-image|poster)="([^"]*)"/g)){
   const raw=m[1].replaceAll('&amp;','&');if(/^(https?:|mailto:|tel:|data:)/.test(raw))continue;
   const u=new URL(raw,base);const rel=decodeURIComponent(u.pathname.slice(new URL(prefix).pathname.length));
   const f=rel.endsWith('/')||!rel?rel+'index.html':rel;
   assert(fs.existsSync(path.join(root,f)),`${route} missing ${raw}`);
   if(raw.endsWith('.html'))assert.equal(raw,'404.html',`Internal .html link ${route}: ${raw}`);
   if(u.hash&&f.endsWith('.html')){const target=read(f),id=decodeURIComponent(u.hash.slice(1));if(id)assert(target.includes(`id="${id}"`),`${route} missing anchor ${raw}`);}
  }
  for(const m of html.matchAll(/\bsrcset="([^"]+)"/g))for(const entry of m[1].split(','))assert(fs.existsSync(path.join(root,entry.trim().split(' ')[0])),route);
 }
});
test('sitemap lists canonical content only and old URLs remain redirects',()=>{
 const sitemap=read('sitemap.xml');assert.equal((sitemap.match(/<loc>/g)||[]).length,pages.length);
 for(const {route}of pages)assert(sitemap.includes(`<loc>${domain+route}</loc>`));
 assert(!sitemap.includes('.html'));assert(read('robots.txt').includes(domain+'sitemap.xml'));
 for(const f of fs.readdirSync(path.join(root,'_source/pages')).filter(f=>f.endsWith('.html')&&f!=='index.html')){
  const html=read(f);assert(html.includes('noindex,follow'),f);assert(html.includes('location.replace'),f);
 }
 assert(read('404.html').includes('noindex,follow'));
});
test('both forms have native POST fallback, limits, feedback and spam trap',()=>{
 for(const route of ['',routes['kontakt.html']]){const html=read(route+'index.html');assert(html.includes('method="POST"'));assert(html.includes('https://formsubmit.co/ajax/izabela.suwiczak@aziza-suwiczak.pl'));assert(html.includes('name="_honey"'));assert(html.includes('aria-live="polite"'));assert(html.includes('maxlength="10000"'));assert(html.includes('contact-form.js'));}
});
test('interior projects and paintings retain their distinct route and schema categories',()=>{
 const works=JSON.parse(read('client-paintings.json'));
 const projects=JSON.parse(read('client-projects.json'));
 for(const project of projects){const route=routes[project.file];assert(route.startsWith(project.kind==='Art déco'?'obrazy/':'projekty/'),project.file);}
 let paintings=0;
 for(const {route,html}of pages){if(html.includes('"@type":"VisualArtwork"')){paintings++;assert(route.startsWith('obrazy/'));assert(works.some(w=>html.includes(`data-image="${w.src}"`)));}}
 assert.equal(paintings,9);
});
