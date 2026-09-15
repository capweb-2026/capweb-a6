import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { persona, validatePersona } from '../public/js/persona.js';

// Tests TDD de l'identité NetQuiz (SPEC.md critères 1 à 4).
// Rouge attendu : public/js/persona.js n'existe pas encore.

const ACCUEIL = "Bonjour, je suis NetQuiz. Je t'aide à réviser TCP/IP, DNS et HTTP avec des explications simples et des quiz courts.";

const SUGGESTIONS = [
  'Quiz TCP/IP : que fait TCP ?',
  'Explique DNS simplement',
  'Quiz HTTP : client ou serveur ?'
];

describe('identite — critère 1 (nom)', () => {
  it('persona.nom vaut NetQuiz, entre 2 et 20 caractères après trim', () => {
    assert.equal(persona.nom, 'NetQuiz');
    const taille = persona.nom.trim().length;
    assert.ok(taille >= 2 && taille <= 20);
  });

  it('validatePersona refuse un nom trop court ou trop long', () => {
    for (const nom of ['N', '   ', 'x'.repeat(21)]) {
      const r = validatePersona({ ...persona, nom });
      assert.equal(r.ok, false);
      assert.ok(Array.isArray(r.erreurs) && r.erreurs.length > 0);
    }
  });
});

describe('identite — critère 2 (emoji)', () => {
  it('persona.emoji vaut 🌐, un seul emoji visible', () => {
    assert.equal(persona.emoji, '🌐');
    assert.equal(validatePersona(persona).ok, true);
  });

  it('validatePersona refuse un emoji vide, du texte ou deux emojis', () => {
    for (const emoji of ['', 'abc', '🌐🌐']) {
      const r = validatePersona({ ...persona, emoji });
      assert.equal(r.ok, false);
      assert.ok(Array.isArray(r.erreurs) && r.erreurs.length > 0);
    }
  });
});

describe('identite — critère 3 (accueil)', () => {
  it('persona.accueil est le message exact et contient le nom', () => {
    assert.equal(persona.accueil, ACCUEIL);
    assert.ok(persona.accueil.includes('NetQuiz'));
  });

  it('validatePersona refuse un accueil sans le nom', () => {
    const r = validatePersona({ ...persona, accueil: 'Bonjour, je révise les réseaux.' });
    assert.equal(r.ok, false);
    assert.ok(Array.isArray(r.erreurs) && r.erreurs.length > 0);
  });
});

describe('identite — critère 4 (suggestions)', () => {
  it('persona.suggestions vaut exactement les trois questions, dans l’ordre', () => {
    assert.deepEqual(persona.suggestions, SUGGESTIONS);
  });

  it('validatePersona refuse un nombre de suggestions différent de trois', () => {
    for (const suggestions of [[], SUGGESTIONS.slice(0, 2), [...SUGGESTIONS, 'Une de plus']]) {
      const r = validatePersona({ ...persona, suggestions });
      assert.equal(r.ok, false);
      assert.ok(Array.isArray(r.erreurs) && r.erreurs.length > 0);
    }
  });

  it('validatePersona refuse une suggestion vide ou faite d’espaces', () => {
    for (const suggestions of [['', SUGGESTIONS[1], SUGGESTIONS[2]], [SUGGESTIONS[0], '   ', SUGGESTIONS[2]]]) {
      const r = validatePersona({ ...persona, suggestions });
      assert.equal(r.ok, false);
      assert.ok(Array.isArray(r.erreurs) && r.erreurs.length > 0);
    }
  });
});

describe('identite — persona valide', () => {
  it('validatePersona(persona) renvoie { ok: true }', () => {
    assert.deepEqual(validatePersona(persona), { ok: true });
  });
});
