// Serves dist/client (or another built folder, given second) the way Vercel does (clean URLs, 404.html, compression, and the security headers), for local checks.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { brotliCompressSync } from 'node:zlib';

const root = resolve(process.argv[3] ?? 'dist/client');
const types: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };
const port = Number(process.argv[2] ?? 5290);
const config = JSON.parse(await readFile('vercel.json', 'utf8'));
const security = Object.fromEntries(config.headers[0].headers.map((h: { key: string; value: string }) => [h.key, h.value]));
const small = (type: string, body: Buffer) => /text|javascript|xml/.test(type) ? { body: brotliCompressSync(body), headers: { 'Content-Encoding': 'br' } } : { body, headers: {} };

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
  const tries = path === '/' ? ['index.html'] : extname(path) ? [path] : [`${path}.html`];
  for (const t of tries) {
    try {
      const type = types[extname(t)] ?? 'application/octet-stream';
      const { body, headers } = small(type, await readFile(join(root, t)));
      res.writeHead(200, { ...security, ...headers, 'Content-Type': type });
      res.end(body);
      return;
    } catch { /* try the next one */ }
  }
  res.writeHead(404, { ...security, 'Content-Type': 'text/html' });
  res.end(await readFile(join(root, '404.html')));
}).listen(port, () => console.log(`http://localhost:${port}`));
