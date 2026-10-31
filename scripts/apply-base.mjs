// Runs after `astro build`. The pages link to each other with root paths ("/about/", "/favicon.svg", ...).
// That is right on a domain root, but on GitHub Pages the site lives under /<repo>/, so those links would
// point at the wrong place. When BASE is set, this prefixes every root-relative link in the built files.
import fs from 'node:fs';
import path from 'node:path';

const raw = process.env.BASE || '/';
const base = '/' + raw.replace(/^\/+|\/+$/g, '');
if (base === '/') { console.log('apply-base: BASE not set, nothing to do'); process.exit(0); }

const dist = path.resolve('dist');
const prefix = (u) => (u.startsWith('//') || u === base || u.startsWith(base + '/') || u.startsWith(base + '?') || u.startsWith(base + '#')) ? u : base + u;

let files = 0, changes = 0;
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) { walk(f); continue; }
    const ext = path.extname(f);
    if (!['.html', '.json', '.css', '.xml'].includes(ext)) continue;
    let s = fs.readFileSync(f, 'utf8');
    const before = s;
    if (ext === '.html') {
      // href="/x", src="/x", action="/x", content="/x" (not protocol-relative "//")
      s = s.replace(/(\s(?:href|src|action|poster|data-src)=)(["'])(\/[^"']*)\2/g, (m, a, q, u) => `${a}${q}${prefix(u)}${q}`);
      // redirect pages: <meta http-equiv="refresh" content="0;url=/x">
      s = s.replace(/(content=["']\d+;\s*url=)(\/[^"']*)/g, (m, a, u) => a + prefix(u));
    } else if (ext === '.json' && path.basename(f) === 'search-index.json') {
      // the header search opens pages from these links
      s = s.replace(/("h":")(\/[^"]*)"/g, (m, a, u) => `${a}${prefix(u)}"`);
    }
    if (s !== before) { fs.writeFileSync(f, s); files++; changes += (before.length === s.length ? 0 : 1); }
  }
};
walk(dist);
// a preview on github.io should not show up in Google; the real domain build keeps the normal robots.txt
fs.writeFileSync(path.join(dist, 'robots.txt'), ['User-agent: *', 'Disallow: /', ''].join('\n'));
console.log(`apply-base: prefixed links with "${base}" in ${files} files`);
