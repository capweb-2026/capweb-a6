# SPEC.md - NetQuiz

## Objectif

L'assistant a une identite reconnaissable des l'ouverture de la page : `NetQuiz` aide a reviser les reseaux, surtout TCP/IP, DNS et HTTP, avec des explications simples et des quiz courts.

Cette identite doit guider l'utilisateur avant son premier message, puis rester visible dans les reponses de l'assistant.

A partir du CP3, NetQuiz peut aussi repondre avec une IA appelee uniquement par le serveur. La cle reste cote serveur. Si l'IA ne repond pas, NetQuiz repond quand meme avec ses regles existantes et signale le mode degrade.

## Criteres d'acceptation

1. **Nom** - Quand la page s'ouvre, le systeme affiche le nom `NetQuiz` dans le titre principal. Le nom affiche, sans les espaces autour, fait de 2 a 20 caracteres.
2. **Emoji** - Quand la page s'ouvre, le systeme affiche exactement un emoji `🌐` a cote du nom. Un emoji visible qui occupe un seul grapheme compte pour un, meme si JavaScript le stocke avec plusieurs unites UTF-16.
3. **Accueil** - Quand la conversation est vide, le systeme affiche le message d'accueil `Bonjour, je suis NetQuiz. Je t'aide à réviser TCP/IP, DNS et HTTP avec des explications simples et des quiz courts.` Ce message contient le nom `NetQuiz`, n'est pas une ligne de `#messages`, disparait des le premier message envoye et revient quand la conversation est effacee.
4. **Suggestions** - Quand la page s'ouvre, le systeme propose exactement trois questions suggerees : `Quiz TCP/IP : que fait TCP ?`, `Explique DNS simplement` et `Quiz HTTP : client ou serveur ?`. Quand l'utilisateur clique sur l'une d'elles, le systeme place son texte dans le champ `#message` sans envoyer le formulaire et sans ajouter de ligne dans `#messages`.
5. **Reponses signees** - Quand l'assistant repond, sa ligne commence par `NetQuiz :` au lieu de `Cap Web :`.
6. **Contrat** - Quand les controles existants sont lances, les tests de contrat CP1 restent verts.
7. **IA cote serveur** - Quand l'utilisateur envoie une question sur TCP/IP, DNS ou HTTP et que l'IA repond dans le delai maximal, le systeme affiche la reponse de l'IA dans la conversation, sans que le navigateur appelle directement la passerelle.
8. **Theme** - Quand l'utilisateur pose une question hors du theme TCP/IP, DNS ou HTTP, le systeme refuse poliment et rappelle qu'il aide a reviser les reseaux.
9. **Prompt protege** - Quand l'utilisateur demande le prompt systeme, une cle, ou tente de changer le role de NetQuiz, le systeme refuse et ne revele ni instruction interne, ni secret, ni variable d'environnement.
10. **Repli** - Quand l'IA echoue, refuse, repond trop lentement ou n'est pas configuree, le systeme repond avec `replyTo` et affiche clairement `mode degrade` dans `#status`, sans ajouter de ligne supplementaire dans `#messages`.
11. **Delai** - Quand l'IA ne repond pas assez vite, le systeme bascule sur les regles en moins de 4 secondes.

## Hors perimetre

Pas de choix de l'identite par l'utilisateur, pas d'image d'avatar, pas de base documentaire, pas de RAG, pas de generation automatique de quiz et pas de theme visuel complet a cette etape.

L'IA ne doit pas recevoir de donnee personnelle, de secret, de fichier du depot ou de contenu `.env`. Le navigateur ne doit jamais connaitre `CAPWEB_IA_CLE`, ni appeler directement `CAPWEB_IA_URL`.

## Donnees et fonctions attendues

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
- `validatePersona` refuse un nom qui, apres `trim()`, fait moins de 2 caracteres ou plus de 20 caracteres.
- `validatePersona` refuse un emoji vide, du texte a la place d'un emoji, ou plusieurs emojis visibles.
- `validatePersona` accepte `🌐` comme un seul emoji visible.
- `validatePersona` refuse un accueil qui ne contient pas le nom.
- `validatePersona` refuse un tableau de suggestions different de trois elements ou une suggestion vide apres `trim()`.
- La page contient `#accueil` et `#suggestions`, en dehors de `#messages`.
- Les boutons de suggestion ont `type="button"` pour ne pas envoyer le formulaire au clic.
- `public/js/view.js` utilise le nom de `persona` pour l'etiquette des messages de l'assistant.
- `public/js/app.js` affiche l'accueil et les suggestions quand l'historique est vide, puis les masque quand l'historique contient au moins un message.
- `server/app.js` ajoute `public/js/persona.js` a la liste blanche des fichiers servis et a ses types MIME JavaScript.
- `server/ia.js` exporte un module serveur dedie a l'IA. C'est le seul module qui construit l'appel a la passerelle.
- Le module serveur dedie recoit son fournisseur en parametre pour permettre des tests sans cle.
- Le module serveur dedie renvoie toujours un objet de la forme `{ texte, source }`, avec `source` egal a `ia` ou `regles`.
- Le module serveur dedie valide le message avec `validateMessage`, applique un delai maximal de 3500 ms, et utilise `replyTo` en repli.
- Le prompt systeme reste cote serveur. Il limite NetQuiz aux revisions TCP/IP, DNS et HTTP, impose le francais, des explications simples et des reponses courtes de 5 phrases maximum.
- `api/chat.js` expose la porte d'entree Vercel. Il reste minimal et delegue au code serveur.
- `server/app.js` expose une route locale `POST /api/chat` pour les tests sans cle.
- La route `/api/chat` accepte un JSON `{ message, historique }` et repond un JSON `{ texte, source }`.
- `public/js/app.js` envoie les messages a `/api/chat`, affiche le texte recu dans la conversation, et affiche `mode degrade` dans `#status` quand `source` n'est pas `ia`.
- Si l'appel navigateur a `/api/chat` echoue, `public/js/app.js` se replie sur `replyTo` et affiche `mode degrade` dans `#status`.

## Questions ouvertes

Aucune.
