export default function handler(req, res) {
  const methode = (req.method ?? 'GET').toUpperCase();

  res.setHeader('content-type', 'application/json; charset=utf-8');

  if (methode !== 'GET') {
    res.statusCode = 405;
    res.end(JSON.stringify({ erreur: 'Methode non autorisee' }));
    return;
  }

  res.statusCode = 200;
  res.end(JSON.stringify({ pret: true }));
}
