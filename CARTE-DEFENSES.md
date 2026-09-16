# Carte des défenses

Chaque ligne dit quelle connerie est arrêtée, par quoi, et **où est la preuve** : le lien d'un run rouge ou d'une PR bloquée. Une barrière sans preuve ne compte pas.

| Connerie | Barrière qui l'arrête | Preuve (lien) | Checkpoint |
|---|---|---|---|
| Régression | Tests de contrat et CI obligatoire sur `main` | CP1 : https://github.com/capweb-2026/capweb-a6/pull/1 : run vert <br> CP2-2 : sur la pr https://github.com/capweb-2026/capweb-a6/pull/2 au commit `test: identité de l'assistant (critères 1 à 5)`, où `verifier` échoue avant le code parce que `public/js/persona.js` ou les éléments d'identité n'existent pas encore | CP1 & CP2 |
| Test affaibli ou supprimé | `check:tests` (TEST-CHANGE obligatoire) et relecture | Aucune PR piégée reçue pour cette ligne, confirmé par le formateur plutôt que de fabriquer une fausse preuve. | CP2 |
| Dépendance ajoutée | `check:deps` et `dependances-autorisees.json` | Aucune PR piégée reçue pour cette ligne, confirmé par le formateur plutôt que d'ajouter une fausse dépendance. | CP2 |
| Secret exposé | | | CP3 |
| IA qui sort de son thème | | | CP3 |
| Faille (`innerHTML`, injection) | | | CP4 |
| Contrôle désactivé | | | CP4 |
| Action destructrice | | | CP4 |
