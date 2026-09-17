# Carte des défenses

Chaque ligne dit quelle connerie est arrêtée, par quoi, et **où est la preuve** : le lien d'un run rouge ou d'une PR bloquée. Une barrière sans preuve ne compte pas.

| Connerie | Barrière qui l'arrête | Preuve (lien) | Checkpoint |
|---|---|---|---|
| Régression | Tests de contrat et CI obligatoire sur `main` | CP1 : https://github.com/capweb-2026/capweb-a6/pull/1 : run vert <br> CP2-2 : sur la pr https://github.com/capweb-2026/capweb-a6/pull/2 au commit `test: identité de l'assistant (critères 1 à 5)`, où `verifier` échoue avant le code parce que `public/js/persona.js` ou les éléments d'identité n'existent pas encore <br> PR piégée #7 : https://github.com/capweb-2026/capweb-a6/pull/7 - refusée car elle acceptait 281 à 300 caractères, arrêtée par `npm test` dans `verifier` : https://github.com/capweb-2026/capweb-a6/actions/runs/35104597943 | CP1 & CP2 |
| Test affaibli ou supprimé | `check:tests` (TEST-CHANGE obligatoire) et relecture | PR piégée #8 : https://github.com/capweb-2026/capweb-a6/pull/8 - refusée car elle remplaçait une vraie assertion de contrat par une tautologie, arrêtée par `check:tests` faute de `TEST-CHANGE:` : https://github.com/capweb-2026/capweb-a6/actions/runs/35104617906 | CP2 |
| Dépendance ajoutée | `check:deps` et `dependances-autorisees.json` | PR piégée #9 : https://github.com/capweb-2026/capweb-a6/pull/9 - refusée car elle ajoutait `dayjs@1.11.23` dans `package.json` et `package-lock.json`, arrêtée par `check:deps` : https://github.com/capweb-2026/capweb-a6/actions/runs/35104627711 | CP2 |
| Secret exposé | Clé app stockée uniquement dans Vercel, appel IA côté serveur, aucun secret dans `public/`, vérification par test de coupure de la clé app. | PR CP3 IA : https://github.com/capweb-2026/capweb-a6/pull/11 <br> Redéploiement après correction de la clé app : https://github.com/capweb-2026/capweb-a6/pull/14 <br> Rapport `evals/RAPPORT.md` : incident clé agent/app et test de coupure validé | CP3 |
| IA qui sort de son thème | Prompt système côté serveur limité à TCP/IP, DNS et HTTP, refus hors thème, refus d'injection, évaluation manuelle avec questions durcies. | Rapport `evals/RAPPORT.md` : questions 5 à 8 durcies, passage 1 OK, passage 2 OK, aucun KO inventé | CP3 |
| Faille (`innerHTML`, injection) | | | CP4 |
| Contrôle désactivé | | | CP4 |
| Action destructrice | | | CP4 |
