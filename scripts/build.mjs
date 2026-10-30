import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const json = p => JSON.parse(read(p));
const routes = json('_source/routes.json');
const metadata = json('_source/seo.json');
const responsive = json('_source/responsive.json');
const domain = 'https://www.aziza-suwiczak.pl/';
const checking = process.argv.includes('--check');
const generated = new Map();
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const plain = value => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g,' ').trim();
const serialize = data => JSON.stringify(data).replaceAll('<','\\u003c');
const absolute = route => domain + route;
const baseFor = route => '../'.repeat(route.split('/').filter(Boolean).length) || './';
const sources = fs.readdirSync(path.join(root,'_source/pages')).filter(f=>f.endsWith('.html')).sort();
const removed = sources.filter(f=>!Object.hasOwn(routes,f));
const destinationFor = file => routes[file] ?? 'obrazy/';
const organization = {
  '@type':'ProfessionalService', '@id':domain+'#pracownia',
  name:'AZIZA Pracownia Architektoniczna', url:domain,
  logo:domain+'assets/aziza-logo.png', image:domain+'assets/client/023-1.webp',
  telephone:'+48574278597', email:'izabela.suwiczak@aziza-suwiczak.pl',
  address:{'@type':'PostalAddress',streetAddress:'ul. Feliksa Nowowiejskiego 29',addressLocality:'Kościan',postalCode:'64-000',addressCountry:'PL'},
  sameAs:['https://www.instagram.com/aziza.architektura/','https://www.facebook.com/AZIZA.Pracownia.Architektoniczna/']
};

function pageSchema(file, meta, route, html) {
  const page = {'@type': meta.type==='article'?'BlogPosting':'WebPage', '@id':absolute(route)+'#strona',url:absolute(route),name:meta.heading,description:meta.description,inLanguage:'pl-PL',isPartOf:{'@id':domain+'#witryna'},image:absolute(meta.image)};
  if(meta.type==='article') {
    page.headline=meta.heading;page.author={'@type':'Organization',name:organization.name};page.publisher={'@id':organization['@id']};
    const date=html.match(/<time datetime="(\d{4}-\d{2}-\d{2})"/);
    if(date) page.datePublished=date[1];
    page.mainEntityOfPage=absolute(route);
  }
  const graph=[organization,{'@type':'WebSite','@id':domain+'#witryna',url:domain,name:organization.name,inLanguage:'pl-PL',publisher:{'@id':organization['@id']}},page];
  if(route) {
    const crumbs=[{'@type':'ListItem',position:1,name:'AZIZA',item:domain}];
    const parent=route.split('/')[0];
    const names={oferta:'Oferta',projekty:'Projekty',obrazy:'Obrazy',blog:'Blog'};
    if(route.split('/').filter(Boolean).length>1) crumbs.push({'@type':'ListItem',position:2,name:names[parent],item:absolute(parent+'/')});
    crumbs.push({'@type':'ListItem',position:crumbs.length+1,name:meta.heading,item:absolute(route)});
    graph.push({'@type':'BreadcrumbList',itemListElement:crumbs});
  }
  if(file.startsWith('projektowanie-')) graph.push({'@type':'Service',name:meta.heading,description:meta.description,url:absolute(route),provider:{'@id':organization['@id']}});
  if(route.startsWith('obrazy/') && file.startsWith('realizacja-')) graph.push({'@type':'VisualArtwork',name:meta.heading,image:absolute(meta.image),url:absolute(route),creator:{'@type':'Person',name:'Izabela Suwiczak-Lewandowska'}});
  return {'@context':'https://schema.org','@graph':graph};
}

function replaceLinks(html, route) {
  return html.replace(/\bhref="([^"]*)"/g,(match,ref)=>{
    if(ref.startsWith('#')) return `href="${route+ref}"`;
    const m=ref.match(/^([^?#]*\.html)(.*)$/);
    if(!m) return match;
    const target=m[1];
    if(Object.hasOwn(routes,target)||removed.includes(target)) return `href="${destinationFor(target)+m[2]}"`;
    return match;
  });
}

function images(html) {
  return html.replace(/<img\b[^>]*>/g,tag=>{
    const src=tag.match(/\bsrc="([^"]+)"/)?.[1];
    const photo=responsive[src];
    if(!photo) return tag;
    tag=tag.replace(/\s+(?:width|height|srcset|sizes)="[^"]*"/g,'');
    const full=/subpage-hero-photo/.test(tag);
    const sizes=full?'100vw':'(max-width: 760px) 100vw, 50vw';
    const srcset=photo.variants.map(v=>`${v.src} ${v.width}w`).join(', ');
    return tag.replace('<img ',`<img width="${photo.width}" height="${photo.height}" srcset="${srcset}" sizes="${sizes}" `);
  });
}

function form(html) {
  if(!html.includes('id="contact-form"')) return html;
  html=html.replace(/<form\b[^>]*id="contact-form"[^>]*>/,m=>m.slice(0,-1)+' action="https://formsubmit.co/izabela.suwiczak@aziza-suwiczak.pl" method="POST" data-endpoint="https://formsubmit.co/ajax/izabela.suwiczak@aziza-suwiczak.pl">');
  html=html.replace('Przygotuj e-mail','Wyślij wiadomość');
  html=html.replace(/<p class="form-note"[^>]*>.*?<\/p>/s,'<p class="form-note" role="status" aria-live="polite" aria-atomic="true">Odpowiem na podany adres e-mail. Możesz też napisać bezpośrednio do pracowni.</p><p class="contact-data-note">Dane z formularza służą odpowiedzi na Twoje zapytanie. Wiadomość jest przekazywana do pracowni przez <a href="https://formsubmit.co/privacy.pdf" target="_blank" rel="noopener">FormSubmit</a>.</p>');
  html=html.replace(/<input type="text" name="name"/,'<input maxlength="120" type="text" name="name"');
  html=html.replace(/<input type="email" name="email"/,'<input maxlength="254" type="email" name="email"');
  html=html.replace(/<input type="tel" name="phone"/,'<input maxlength="40" type="tel" name="phone"');
  html=html.replace(/<textarea name="message"/,'<textarea minlength="10" maxlength="10000" name="message"');
  html=html.replace(/(<form\b[^>]*id="contact-form"[^>]*>)/,'$1\n<input type="hidden" name="_subject" value="Zapytanie ze strony AZIZA"><input type="hidden" name="_template" value="table"><input type="hidden" name="_captcha" value="false"><label class="form-honeypot" aria-hidden="true">Zostaw to pole puste<input name="_honey" type="text" tabindex="-1" autocomplete="off"></label>');
  return html.replace('</body>','<script src="contact-form.js" defer></script>\n</body>');
}

for(const file of Object.keys(routes)) {
  const route=routes[file],meta=metadata[file];
  let html=read('_source/pages/'+file);
  html=html.replace(/<title>.*?<\/title>/s,`<title>${esc(meta.title)}</title>`);
  html=html.replace(/<meta name="description"[^>]*>/,`<meta name="description" content="${esc(meta.description)}">`);
  html=html.replace(/<meta (?:property="og:[^"]+"|name="twitter:[^"]+")[^>]*>/g,'');
  html=html.replace(/<script type="application\/ld\+json">.*?<\/script>/gs,'');
  html=html.replace(/<link rel="canonical"[^>]*>/g,'');
  html=html.replace(/<meta name="robots"[^>]*>/g,'');
  html=replaceLinks(html,route);
  html=images(html);
  html=form(html);
  // Old portfolio query URLs still point at the respective gallery.
  if(file==='portfolio.html') html=html.replace(/location\.replace\((["'])(obrazy|wnetrza)\.html\1\)/g,(_,q,name)=>`location.replace(new URL("${name}/",document.baseURI).href)`);
  if(!route) {
    const hero=responsive['assets/home-v4-hero.webp'];
    const set=hero.variants.filter(v=>v.width>=960).map(v=>`${v.src} ${v.width}w`).join(', ');
    html=html.replace(/<link rel="preload" as="image" href="assets\/home-v4-hero.webp"[^>]*>/,`<link rel="preload" as="image" href="assets/home-v4-hero.webp" imagesrcset="${set}" imagesizes="100vw" fetchpriority="high">`);
  }
  const head=`<base href="${baseFor(route)}">\n<link rel="canonical" href="${absolute(route)}">\n<meta name="robots" content="index,follow,max-image-preview:large">\n<meta name="theme-color" content="#4e434a">\n<meta name="referrer" content="strict-origin-when-cross-origin">\n<link rel="icon" href="favicon.ico" sizes="any">\n<link rel="apple-touch-icon" href="assets/favicon-192.png">\n<meta property="og:locale" content="pl_PL">\n<meta property="og:site_name" content="AZIZA Pracownia Architektoniczna">\n<meta property="og:type" content="${meta.type}">\n<meta property="og:title" content="${esc(meta.title)}">\n<meta property="og:description" content="${esc(meta.description)}">\n<meta property="og:url" content="${absolute(route)}">\n<meta property="og:image" content="${absolute(meta.image)}">\n<meta property="og:image:alt" content="${esc(meta.heading)}">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${esc(meta.title)}">\n<meta name="twitter:description" content="${esc(meta.description)}">\n<meta name="twitter:image" content="${absolute(meta.image)}">`;
  html=html.replace(/(<meta charset="utf-8">)/,'$1\n'+head);
  html=html.replace('</head>',`<link rel="stylesheet" href="production.css">\n<script type="application/ld+json">${serialize(pageSchema(file,meta,route,html))}</script>\n</head>`);
  if(!route) html=html.replace('</head>',`<script>if(location.pathname.endsWith('/index.html')){const u=new URL('./',location.href);u.search=location.search;u.hash=location.hash;location.replace(u.href);}</script></head>`);
  generated.set(route+'index.html',html);
}

function redirect(route,target) {
  const base=route.endsWith('.html')?'./':baseFor(route);
  return `<!doctype html>\n<html lang="pl"><head><meta charset="utf-8"><base href="${base}"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,follow"><link rel="canonical" href="${absolute(target.split(/[?#]/)[0])}"><meta http-equiv="refresh" content="0;url=${esc(target)}"><title>Przekierowanie — AZIZA</title><script>const u=new URL(${serialize(target)},document.baseURI);if(!u.search)u.search=location.search;if(!u.hash)u.hash=location.hash;location.replace(u.href);</script></head><body><p><a href="${esc(target)}">Przejdź do aktualnej strony AZIZA</a></p></body></html>\n`;
}
const aliases={};
for(const file of sources) if(file!=='index.html') aliases[file]=destinationFor(file);
Object.assign(aliases,{'uslugi/':'oferta/','portfolio/':'projekty/','cennik/':'oferta/#warianty','o-mnie/':'#o-mnie'});
for(const file of sources) if(file.startsWith('realizacja-')) {
  const slug=file.slice('realizacja-'.length,-5);
  aliases['portfolio/'+slug+'/']=destinationFor(file);
  aliases['project-'+slug+'/']=destinationFor(file);
}
for(const file of ['projektowanie-wnetrz.html','projektowanie-domow-jednorodzinnych-i-wielorodzinnych.html','projektowanie-budynkow-uslugowych.html']) aliases[file.slice(0,-5)+'/']=routes[file];
const source=json('content-sources.json');
for(const article of source.posts||[]) {
  const slug=article.slug || new URL(article.url).pathname.split('/').filter(Boolean).at(-1);
  const file='blog-'+slug+'.html';
  if(slug && routes[file]) {aliases[slug+'/']=routes[file];aliases[new URL(article.url).pathname.slice(1)]=routes[file];}
}
for(const [alias,target] of Object.entries(aliases)) {
  if(Object.values(routes).includes(alias)) continue;
  generated.set(alias.endsWith('.html')?alias:alias+'index.html',redirect(alias,target));
}
const locations=Object.values(routes).map(route=>`  <url><loc>${absolute(route)}</loc></url>`).join('\n');
generated.set('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${locations}\n</urlset>\n`);
generated.set('robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${domain}sitemap.xml\n`);
generated.set('docs/redirects.json',JSON.stringify({domain,mechanism:'GitHub Pages: immediate meta refresh and location.replace; HTTP 301 requires an external redirect-capable layer.',aliases},null,2)+'\n');
const notfound=`<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>Nie znaleziono strony | AZIZA</title><script>const base=document.createElement('base');base.href=location.hostname.endsWith('github.io')?'/AZIZA/':'/';document.head.append(base);</script><link rel="stylesheet" href="style.css"><link rel="stylesheet" href="typography.css"></head><body class="subpage"><main class="section"><p>404</p><h1>Ta strona nie istnieje.</h1><p>Wróć do pracowni AZIZA lub zobacz aktualne projekty.</p><a class="text-link" href="./">Strona główna ↗</a> <a class="text-link" href="projekty/">Projekty ↗</a></main></body></html>`;
generated.set('404.html',notfound);

const stale=[];
for(const [file,content] of generated) {
  const full=path.join(root,file);
  if(checking) { if(!fs.existsSync(full)||fs.readFileSync(full,'utf8').replaceAll('\r\n','\n')!==content.replaceAll('\r\n','\n')) stale.push(file); }
  else {fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,content);}
}
if(stale.length) {console.error('Generated pages need rebuilding:',stale.join(', '));process.exitCode=1;}
else console.log(`${checking?'Checked':'Built'} ${Object.keys(routes).length} canonical pages and ${Object.keys(aliases).length} legacy URLs.`);
export {routes,metadata,generated,domain};
