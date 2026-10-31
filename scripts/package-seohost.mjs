import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {generated} from './build.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.resolve(process.argv[2] || path.join(root,'..','AZIZA-seohost-2026-10-31'));
if(fs.existsSync(output)) throw new Error('Use a new, empty output directory.');
fs.mkdirSync(output,{recursive:true});
for(const [file,content] of generated) {
  if(file.startsWith('docs/')) continue;
  const dest=path.join(output,file);
  fs.mkdirSync(path.dirname(dest),{recursive:true});
  fs.writeFileSync(dest,content);
}
for(const name of fs.readdirSync(root)) {
  if(/\.(css|js|png|webp|ico)$/.test(name)) fs.copyFileSync(path.join(root,name),path.join(output,name));
}
fs.cpSync(path.join(root,'assets'),path.join(output,'assets'),{recursive:true});
const {aliases}=JSON.parse(fs.readFileSync(path.join(root,'docs/redirects.json'),'utf8'));
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const rules=Object.entries(aliases).map(([old,target])=>`RewriteRule ^${escape(old.replace(/\/$/,''))}${old.endsWith('/')?'/?':''}$ https://www.aziza-suwiczak.pl/${target.replaceAll('#','\\#')} [R=301,L,NE]`);
const htaccess=`# AZIZA static production website — Apache / LiteSpeed
Options -Indexes -MultiViews
DirectoryIndex index.html
ErrorDocument 404 /404.html
AddDefaultCharset UTF-8
<IfModule mod_rewrite.c>
RewriteEngine On
# ACME certificate renewal must remain reachable.
RewriteRule ^\\.well-known/acme-challenge/ - [L]
${rules.join('\n')}
RewriteCond %{HTTPS} !=on [OR]
RewriteCond %{HTTP_HOST} !^www\\.aziza-suwiczak\\.pl$ [NC]
RewriteRule ^ https://www.aziza-suwiczak.pl%{REQUEST_URI} [R=301,L,NE]
# Prevent duplicate index.html addresses, only for explicit client requests.
RewriteCond %{THE_REQUEST} \\s/+(.*/)?index\\.html[?\\s] [NC]
RewriteRule ^(.*)index\\.html$ /$1 [R=301,L,NE]
</IfModule>
<IfModule mod_deflate.c>
AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript application/json image/svg+xml
</IfModule>
<IfModule mod_headers.c>
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
<FilesMatch "\\.html$">
Header set Cache-Control "no-cache"
</FilesMatch>
<FilesMatch "\\.(css|js)$">
Header set Cache-Control "public, max-age=3600, must-revalidate"
</FilesMatch>
<FilesMatch "\\.(webp|png|jpg|jpeg|svg|ico|woff2|mp4|pdf)$">
Header set Cache-Control "public, max-age=604800"
</FilesMatch>
</IfModule>
`;
fs.writeFileSync(path.join(output,'.htaccess'),htaccess);
console.log(`Deployment directory: ${output}; ${rules.length} server-side redirects. No sources, Git data or credentials included.`);
