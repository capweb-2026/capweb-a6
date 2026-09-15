import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateMessage, replyTo } from '../public/js/brain.js';

describe('validateMessage', () => {
  it('refuse une chaîne vide', () => {
    assert.equal(validateMessage('   ').ok, false);
  });

  it('nettoie les espaces', () => {
    assert.deepEqual(validateMessage('  salut  '), { ok: true, value: 'salut' });
  });

  it('accepte 280 caractères', () => {
    assert.equal(validateMessage('a'.repeat(280)).ok, true);
  });

  it('refuse 281 caractères', () => {
    assert.equal(validateMessage('a'.repeat(281)).ok, false);
  });
});

describe('replyTo', () => {
  it('répond pareil aux majuscules', () => {
    assert.equal(replyTo('SALUT'), replyTo('salut'));
  });

  it('répond autrement à une phrase inconnue que pour aide', () => {
    assert.notEqual(replyTo('une phrase inconnue'), replyTo('aide'));
  });

  it('liste les commandes avec /aide', () => {
    const reponse = replyTo('/aide');

    assert.ok(reponse.includes('/aide'));
    assert.ok(reponse.includes('/effacer'));
    assert.ok(reponse.includes('/compte'));
    assert.ok(reponse.includes('tcp'));
    assert.ok(reponse.includes('ip'));
    assert.ok(reponse.includes('dns'));
    assert.ok(reponse.includes('http'));
  });

  it('compte les messages avec /compte', () => {
    assert.equal(replyTo('/compte', 4), 'Il y a 4 messages dans la conversation.');
  });

  it('reconnaît bonjour dans une phrase', () => {
    assert.equal(replyTo('bonjour à tous'), replyTo('bonjour'));
  });

  it('reconnaît des synonymes', () => {
    assert.equal(replyTo('coucou'), replyTo('salut'));
    assert.equal(replyTo('essai'), replyTo('test'));
  });

  it('ne confond pas tester avec test', () => {
    assert.equal(replyTo('tester'), replyTo('une phrase inconnue'));
  });

  it('répond en anglais après /lang en', () => {
    assert.equal(replyTo('/lang en', 0, 'en'), 'Hello! I can help you review TCP/IP, DNS and HTTP in simple words.');
    assert.equal(replyTo('salut', 0, 'en'), 'Hello! I can help you review TCP/IP, DNS and HTTP in simple words.');
  });

  it('répond sur TCP/IP, DNS et HTTP', () => {
    assert.equal(
      replyTo('tcp'),
      "TCP decoupe les donnees, verifie leur arrivee et les remet dans l'ordre."
    );
    assert.equal(
      replyTo('ip'),
      "IP sert a adresser les machines et a faire voyager les paquets jusqu'a la bonne destination."
    );
    assert.equal(
      replyTo('dns'),
      'DNS traduit un nom comme example.com en adresse IP utilisable par les machines.'
    );
    assert.equal(
      replyTo('http'),
      'HTTP organise les demandes et les reponses entre un navigateur et un serveur web.'
    );
  });
});
