import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { replyTo, validateMessage } from '../public/js/brain.js';
import { repondreAvecIA } from '../server/ia.js';

describe('repondreAvecIA', () => {
  it('renvoie la reponse du fournisseur quand il repond', async () => {
    const resultat = await repondreAvecIA({
      message: 'Explique DNS simplement',
      historique: [],
      delaiMs: 100,
      fournisseur: async ({ messages }) => {
        assert.ok(Array.isArray(messages));
        assert.ok(messages.some((message) => message.role === 'user' && message.content === 'Explique DNS simplement'));
        return 'DNS traduit un nom de domaine en adresse IP.';
      }
    });

    assert.deepEqual(resultat, {
      texte: 'DNS traduit un nom de domaine en adresse IP.',
      source: 'ia'
    });
  });

  it('se replie sur les regles quand le fournisseur echoue', async () => {
    const resultat = await repondreAvecIA({
      message: 'salut',
      historique: [],
      delaiMs: 100,
      fournisseur: async () => {
        throw new Error('passerelle indisponible');
      }
    });

    assert.deepEqual(resultat, {
      texte: replyTo('salut'),
      source: 'regles'
    });
  });

  it('se replie sur les regles quand le fournisseur est trop lent', async () => {
    const debut = Date.now();

    const resultat = await repondreAvecIA({
      message: 'tcp',
      historique: [],
      delaiMs: 20,
      fournisseur: () => new Promise((resolve) => {
        setTimeout(() => resolve('trop tard'), 200);
      })
    });

    assert.deepEqual(resultat, {
      texte: replyTo('tcp'),
      source: 'regles'
    });
    assert.ok(Date.now() - debut < 150, 'le repli doit arriver avant la reponse lente');
  });

  it('refuse un message vide avec le message de validateMessage', async () => {
    const validation = validateMessage('   ');

    const resultat = await repondreAvecIA({
      message: '   ',
      historique: [],
      delaiMs: 100,
      fournisseur: async () => 'ne doit pas etre appele'
    });

    assert.equal(validation.ok, false);
    assert.deepEqual(resultat, {
      texte: validation.error,
      source: 'regles'
    });
  });
});
