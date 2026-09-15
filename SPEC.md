# SPEC.md — identité de NetQuiz

## Objectif

L'assistant a une identité reconnaissable dès l'ouverture de la page : `NetQuiz` aide à réviser les réseaux, surtout TCP/IP, DNS et HTTP, avec des explications simples et des quiz courts.

Cette identité doit guider l'utilisateur avant son premier message, puis rester visible dans les réponses de l'assistant.

## Critères d'acceptation

1. **Nom** — Quand la page s'ouvre, le système affiche le nom `NetQuiz` dans le titre principal. Le nom affiché, sans les espaces autour, fait de 2 à 20 caractères.
2. **Emoji** — Quand la page s'ouvre, le système affiche exactement un emoji `🌐` à côté du nom. Un emoji visible qui occupe un seul graphème compte pour un, même si JavaScript le stocke avec plusieurs unités UTF-16.
3. **Accueil** — Quand la conversation est vide, le système affiche le message d'accueil `Bonjour, je suis NetQuiz. Je t'aide à réviser TCP/IP, DNS et HTTP avec des explications simples et des quiz courts.` Ce message contient le nom `NetQuiz`, n'est pas une ligne de `#messages`, disparaît dès le premier message envoyé et revient quand la conversation est effacée.
4. **Suggestions** — Quand la page s'ouvre, le système propose exactement trois questions suggérées : `Quiz TCP/IP : que fait TCP ?`, `Explique DNS simplement` et `Quiz HTTP : client ou serveur ?`. Quand l'utilisateur clique sur l'une d'elles, le système place son texte dans le champ `#message` sans envoyer le formulaire et sans ajouter de ligne dans `#messages`.
5. **Réponses signées** — Quand l'assistant répond, sa ligne commence par `NetQuiz :` au lieu de `Cap Web :`.
6. **Contrat** — Quand les contrôles existants sont lancés, les tests de contrat CP1 restent verts.

## Hors périmètre

Pas de choix de l'identité par l'utilisateur, pas d'image d'avatar, pas d'appel à une IA, pas de génération automatique de quiz et pas de thème visuel complet à cette étape.

Les réponses restent celles du cerveau à règles existant. Cette fonctionnalité change l'identité visible et les questions de démarrage, pas le moteur de réponse.

## Données et fonctions attendues

- `public/js/persona.js` exporte `persona`, un objet exactement de la forme :

  ```js
  {
    nom: 'NetQuiz',
    emoji: '🌐',
    accueil: "Bonjour, je suis NetQuiz. Je t'aide à réviser TCP/IP, DNS et HTTP avec des explications simples et des quiz courts.",
    suggestions: [
      'Quiz TCP/IP : que fait TCP ?',
      'Explique DNS simplement',
      'Quiz HTTP : client ou serveur ?'
    ]
  }
  ```

- `public/js/persona.js` exporte `validatePersona(persona)`.
- `validatePersona(persona)` renvoie `{ ok: true }` quand l'objet respecte la spec.
- `validatePersona(persona)` renvoie `{ ok: false, erreurs: [texte, ...] }` quand l'objet ne respecte pas la spec.
- `validatePersona` refuse un nom qui, après `trim()`, fait moins de 2 caractères ou plus de 20 caractères.
- `validatePersona` refuse un emoji vide, du texte à la place d'un emoji, ou plusieurs emojis visibles.
- `validatePersona` accepte `🌐` comme un seul emoji visible.
- `validatePersona` refuse un accueil qui ne contient pas le nom.
- `validatePersona` refuse un tableau de suggestions différent de trois éléments ou une suggestion vide après `trim()`.
- La page contient `#accueil` et `#suggestions`, en dehors de `#messages`.
- Les boutons de suggestion ont `type="button"` pour ne pas envoyer le formulaire au clic.
- `public/js/view.js` utilise le nom de `persona` pour l'étiquette des messages de l'assistant.
- `public/js/app.js` affiche l'accueil et les suggestions quand l'historique est vide, puis les masque quand l'historique contient au moins un message.
- `server/app.js` ajoute `public/js/persona.js` à la liste blanche des fichiers servis et à ses types MIME JavaScript.

## Questions ouvertes

Aucune.
