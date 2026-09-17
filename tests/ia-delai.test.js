import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { replyTo } from '../public/js/brain.js';
import { DELAI_IA_MS, repondreAvecIA } from '../server/ia.js';

describe('strategie de delai IA', () => {
  it('laisse plus de temps aux questions qui partent a l IA', () => {
    assert.equal(DELAI_IA_MS, 15000);
  });

  it('garde salut en reponse immediate par les regles quand l IA est configuree', async () => {
    let fournisseurAppele = false;

    const resultat = await repondreAvecIA({
      message: 'salut',
      fournisseur: async () => {
        fournisseurAppele = true;
        return 'ne doit pas etre appele';
      }
    });

    assert.equal(fournisseurAppele, false);
    assert.deepEqual(resultat, {
      texte: replyTo('salut'),
      source: 'regles'
    });
  });

  it('envoie une question DNS au fournisseur IA', async () => {
    const resultat = await repondreAvecIA({
      message: 'Explique DNS simplement',
      delaiMs: 100,
      fournisseur: async () => 'DNS traduit les noms en adresses IP.'
    });

    assert.deepEqual(resultat, {
      texte: 'DNS traduit les noms en adresses IP.',
      source: 'ia'
    });
  });
});
