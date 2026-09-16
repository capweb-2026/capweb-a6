import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { repondreAvecIA } from '../server/ia.js';

describe('diagnostic de repli IA', () => {
  it('journalise une configuration absente sans cle', async () => {
    const raisons = [];

    const resultat = await repondreAvecIA({
      message: 'Explique DNS simplement',
      journal: (raison) => raisons.push(raison)
    });

    assert.equal(resultat.source, 'regles');
    assert.deepEqual(raisons, ['configuration_absente']);
  });

  it('journalise le statut passerelle sans exposer de secret', async () => {
    const raisons = [];

    const resultat = await repondreAvecIA({
      message: 'Explique DNS simplement',
      delaiMs: 100,
      journal: (raison) => raisons.push(raison),
      fournisseur: async () => {
        throw new Error('passerelle_401');
      }
    });

    assert.equal(resultat.source, 'regles');
    assert.deepEqual(raisons, ['passerelle_401']);
  });

  it('journalise le delai depasse', async () => {
    const raisons = [];

    const resultat = await repondreAvecIA({
      message: 'Explique DNS simplement',
      delaiMs: 20,
      journal: (raison) => raisons.push(raison),
      fournisseur: () => new Promise((resolve) => {
        setTimeout(() => resolve('trop tard'), 200);
      })
    });

    assert.equal(resultat.source, 'regles');
    assert.deepEqual(raisons, ['delai_depasse']);
  });
});
