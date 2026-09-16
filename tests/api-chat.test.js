import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { replyTo } from '../public/js/brain.js';
import { createApp } from '../server/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');

let serveur;
let baseUrl;

before(async () => {
  const app = createApp({ publicDir, version: 'test-cp3' });
  await new Promise((resolve) => {
    serveur = app.listen(0, '127.0.0.1', resolve);
  });
  const adresse = serveur.address();
  const port = typeof adresse === 'object' && adresse !== null ? adresse.port : 0;
  baseUrl = `http://127.0.0.1:${port}`;
});

after(
  () =>
    new Promise((resolve, reject) => {
      if (!serveur) {
        resolve();
        return;
      }
      serveur.close((erreur) => (erreur ? reject(erreur) : resolve()));
    }),
);

test('POST /api/chat repond en JSON avec les regles quand aucune cle IA locale n est configuree', async () => {
  const reponse = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ message: 'salut', historique: [] })
  });

  assert.equal(reponse.status, 200);
  const mime = reponse.headers.get('content-type') ?? '';
  assert.ok(mime.includes('application/json'), `MIME JSON attendu, recu : ${mime}`);
  assert.deepEqual(await reponse.json(), {
    texte: replyTo('salut'),
    source: 'regles'
  });
});
