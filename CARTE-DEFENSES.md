# Carte des défenses

Chaque ligne dit quelle connerie est arrêtée, par quoi, et **où est la preuve** : le lien d'un run rouge ou d'une PR bloquée. Une barrière sans preuve ne compte pas.

| Connerie | Barrière qui l'arrête | Preuve (lien) | Checkpoint |
|---|---|---|---|
| Régression | Tests de contrat et CI obligatoire sur `main` | CP1 : https://github.com/capweb-2026/capweb-a6/pull/1 : run vert <br> CP2-2 : sur la pr https://github.com/capweb-2026/capweb-a6/pull/2 au commit `test: identité de l'assistant (critères 1 à 5)`, où `verifier` échoue avant le code parce que `public/js/persona.js` ou les éléments d'identité n'existent pas encore <br> PR piégée #7 : https://github.com/capweb-2026/capweb-a6/pull/7 - refusée car elle acceptait 281 à 300 caractères, arrêtée par `npm test` dans `verifier` : https://github.com/capweb-2026/capweb-a6/actions/runs/35104597943 | CP1 & CP2 |
| Test affaibli ou supprimé | `check:tests` (TEST-CHANGE obligatoire) et relecture | PR piégée #8 : https://github.com/capweb-2026/capweb-a6/pull/8 - refusée car elle remplaçait une vraie assertion de contrat par une tautologie, arrêtée par `check:tests` faute de `TEST-CHANGE:` : https://github.com/capweb-2026/capweb-a6/actions/runs/35104617906 | CP2 |
| Dépendance ajoutée | `check:deps` et `dependances-autorisees.json` | PR piégée #9 : https://github.com/capweb-2026/capweb-a6/pull/9 - refusée car elle ajoutait `dayjs@1.11.23` dans `package.json` et `package-lock.json`, arrêtée par `check:deps` : https://github.com/capweb-2026/capweb-a6/actions/runs/35104627711 | CP2 |
| Secret exposé | | | CP3 |
| IA qui sort de son thème | | | CP3 |
| Faille (`innerHTML`, injection) | | | CP4 |
| Contrôle désactivé | | | CP4 |
| Action destructrice | | | CP4 |
