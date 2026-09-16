import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');

const INTERDITS_PUBLICS = [
  ['CAPWEB', 'IA', 'CLE'].join('_'),
  ['CAPWEB', 'IA', 'URL'].join('_'),
  'Bearer ',
  '/v1/chat/completions',
  'sk-capweb-test-secret'
];

async function fichiersDans(dossier) {
  const entrees = await readdir(dossier, { withFileTypes: true });
  const fichiers = [];

  for (const entree of entrees) {
    const chemin = path.join(dossier, entree.name);
    if (entree.isDirectory()) {
      fichiers.push(...await fichiersDans(chemin));
    } else {
      fichiers.push(chemin);
    }
  }

  return fichiers;
}

test('public ne contient ni nom de secret IA, ni adresse de passerelle, ni fausse cle', async () => {
  const fichiers = await fichiersDans(publicDir);

  for (const fichier of fichiers) {
    const contenu = await readFile(fichier, 'utf8');
    for (const interdit of INTERDITS_PUBLICS) {
      assert.ok(!contenu.includes(interdit), `${path.relative(publicDir, fichier)} contient ${interdit}`);
    }
  }
});
