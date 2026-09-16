import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fournisseurDepuisEnv } from '../server/ia.js';

describe('fournisseurDepuisEnv', () => {
  it('normalise les variables Vercel avant d appeler la passerelle', async () => {
    const fournisseur = fournisseurDepuisEnv({
      CAPWEB_IA_URL: ' https://passerelle.example/v1/ ',
      CAPWEB_IA_CLE: ' cle-test '
    }, async (url, options) => {
      assert.equal(url, 'https://passerelle.example/v1/chat/completions');
      assert.equal(options.headers.authorization, 'Bearer cle-test');

      return {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'Reponse IA' } }]
        })
      };
    });

    assert.equal(typeof fournisseur, 'function');
    assert.equal(await fournisseur({
      messages: [{ role: 'user', content: 'Explique DNS simplement' }]
    }), 'Reponse IA');
  });
});
