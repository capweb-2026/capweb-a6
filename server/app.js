import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { repondreRequeteChat } from './ia.js';

const FICHIERS = {
  '/': 'index.html',
  '/index.html': 'index.html',
  '/styles.css': 'styles.css',
  '/js/app.js': 'js/app.js',
  '/js/brain.js': 'js/brain.js',
  '/js/persona.js': 'js/persona.js',
  '/js/view.js': 'js/view.js'
};

const TYPES = {
  'index.html': 'text/html; charset=utf-8',
  'styles.css': 'text/css; charset=utf-8',
  'js/app.js': 'text/javascript; charset=utf-8',
  'js/brain.js': 'text/javascript; charset=utf-8',
  'js/persona.js': 'text/javascript; charset=utf-8',
  'js/view.js': 'text/javascript; charset=utf-8'
};

export function createApp({ publicDir, version = 'dev' } = {}) {
  const serveur = http.createServer((req, res) => {
    traiter(req, res).catch(() => {
      if (!res.headersSent) {
        res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
      }
      res.end('Erreur interne');
    });
  });

  async function traiter(req, res) {
    const methode = (req.method ?? 'GET').toUpperCase();
    let chemin = '/';

    try {
      const url = new URL(req.url ?? '/', 'http://127.0.0.1');
      chemin = decodeURIComponent(url.pathname);
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Non trouve');
      return;
    }

    if (chemin === '/api/chat' && methode === 'POST') {
      const corps = await repondreRequeteChat(req);
      const json = JSON.stringify(corps);
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'content-length': Buffer.byteLength(json) });
      res.end(json);
      return;
    }

    if (methode !== 'GET' && methode !== 'HEAD') {
      res.writeHead(405, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Methode non autorisee');
      return;
    }

    if (chemin === '/version.json') {
      const corps = JSON.stringify({ version });
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'content-length': Buffer.byteLength(corps) });
      res.end(methode === 'HEAD' ? '' : corps);
      return;
    }

    const relatif = FICHIERS[chemin];
    if (!relatif) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Non trouve');
      return;
    }

    try {
      const fichier = path.join(publicDir, relatif);
      const corps = await readFile(fichier);
      res.writeHead(200, { 'content-type': TYPES[relatif], 'content-length': corps.length });
      res.end(methode === 'HEAD' ? '' : corps);
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Non trouve');
    }
  }

  return serveur;
}
