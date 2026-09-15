import { test, expect } from '@playwright/test';

/* global localStorage -- callbacks exécutés dans la page */

// Tests TDD de l'identité NetQuiz visible (SPEC.md critères 1 à 5).
// Rouge attendu : #accueil, #suggestions et public/js/persona.js n'existent pas encore.

const ACCUEIL = "Bonjour, je suis NetQuiz. Je t'aide à réviser TCP/IP, DNS et HTTP avec des explications simples et des quiz courts.";

const SUGGESTIONS = [
  'Quiz TCP/IP : que fait TCP ?',
  'Explique DNS simplement',
  'Quiz HTTP : client ou serveur ?'
];

function surveiller(page) {
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(e.message));
  return erreurs;
}

async function pageNeuve(page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

const lignes = (page) => page.locator('#messages li');

test.describe('Identité NetQuiz — nom et emoji (critères 1 et 2)', () => {
  test('le titre principal affiche NetQuiz et un seul emoji 🌐 à côté', async ({ page }) => {
    const erreurs = surveiller(page);
    await pageNeuve(page);
    const titre = page.locator('header h1');
    await expect(titre).toContainText('NetQuiz');
    await expect(titre).toContainText('🌐');
    const texte = (await titre.textContent()) ?? '';
    const nom = texte.replace('🌐', '').trim();
    expect(nom).toBe('NetQuiz');
    expect(nom.length).toBeGreaterThanOrEqual(2);
    expect(nom.length).toBeLessThanOrEqual(20);
    expect(erreurs).toHaveLength(0);
  });
});

test.describe('Identité NetQuiz — accueil (critère 3)', () => {
  test('l’accueil exact est visible hors #messages à l’ouverture', async ({ page }) => {
    const erreurs = surveiller(page);
    await pageNeuve(page);
    const accueil = page.locator('#accueil');
    await expect(accueil).toBeVisible();
    await expect(accueil).toHaveText(ACCUEIL);
    // L'accueil n'est pas une ligne de #messages.
    await expect(page.locator('#messages #accueil')).toHaveCount(0);
    expect(erreurs).toHaveLength(0);
  });

  test('l’accueil disparaît au premier message et revient après effacement', async ({ page }) => {
    const erreurs = surveiller(page);
    await pageNeuve(page);
    await expect(page.locator('#accueil')).toBeVisible();
    await page.locator('#message').fill('salut');
    await page.getByRole('button', { name: /envoyer/i }).click();
    await expect(lignes(page)).toHaveCount(2);
    await expect(page.locator('#accueil')).toBeHidden();
    page.once('dialog', (d) => d.accept());
    await page.locator('#effacer').click();
    await expect(lignes(page)).toHaveCount(0);
    await expect(page.locator('#accueil')).toBeVisible();
    // Jamais une ligne de #messages.
    await expect(page.locator('#messages #accueil')).toHaveCount(0);
    expect(erreurs).toHaveLength(0);
  });
});

test.describe('Identité NetQuiz — suggestions (critère 4)', () => {
  test('trois boutons type=button hors #messages, textes exacts dans l’ordre', async ({ page }) => {
    const erreurs = surveiller(page);
    await pageNeuve(page);
    const zone = page.locator('#suggestions');
    await expect(zone).toBeVisible();
    const boutons = zone.locator('button');
    await expect(boutons).toHaveCount(3);
    await expect(boutons.nth(0)).toHaveText(SUGGESTIONS[0]);
    await expect(boutons.nth(1)).toHaveText(SUGGESTIONS[1]);
    await expect(boutons.nth(2)).toHaveText(SUGGESTIONS[2]);
    for (let i = 0; i < 3; i += 1) {
      await expect(boutons.nth(i)).toHaveAttribute('type', 'button');
    }
    await expect(page.locator('#messages #suggestions')).toHaveCount(0);
    expect(erreurs).toHaveLength(0);
  });

  test('un clic place la question dans #message sans envoyer ni ligne ajoutée', async ({ page }) => {
    const erreurs = surveiller(page);
    await pageNeuve(page);
    const boutons = page.locator('#suggestions button');
    for (let i = 0; i < 3; i += 1) {
      await pageNeuve(page);
      await boutons.nth(i).click();
      await expect(page.locator('#message')).toHaveValue(SUGGESTIONS[i]);
      await expect(lignes(page)).toHaveCount(0);
    }
    expect(erreurs).toHaveLength(0);
  });
});

test.describe('Identité NetQuiz — réponses signées (critère 5)', () => {
  test('la ligne de l’assistant commence par NetQuiz : et non Cap Web :', async ({ page }) => {
    const erreurs = surveiller(page);
    await pageNeuve(page);
    await page.locator('#message').fill('salut');
    await page.getByRole('button', { name: /envoyer/i }).click();
    await expect(lignes(page)).toHaveCount(2);
    const texte = (await lignes(page).nth(1).textContent()) ?? '';
    expect(texte.startsWith('NetQuiz :')).toBe(true);
    expect(texte).not.toContain('Cap Web');
    expect(erreurs).toHaveLength(0);
  });
});
