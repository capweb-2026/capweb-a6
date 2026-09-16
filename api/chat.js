import { repondreRequeteChat } from '../server/ia.js';

export default function handler(req, res) {
  const methode = (req.method ?? 'GET').toUpperCase();

  res.setHeader('content-type', 'application/json; charset=utf-8');

  if (methode === 'GET') {
    res.statusCode = 200;
    res.end(JSON.stringify({ pret: true }));
    return;
  }

  if (methode !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ erreur: 'Methode non autorisee' }));
    return;
  }

  repondreRequeteChat(req)
    .then((corps) => {
      res.statusCode = 200;
      res.end(JSON.stringify(corps));
    })
    .catch(() => {
      res.statusCode = 500;
      res.end(JSON.stringify({ erreur: 'Erreur interne' }));
    });
}
