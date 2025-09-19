const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

const links = {}; // { token: { expiresAt, used } }

app.get('/generate', (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  links[token] = {
    expiresAt: Date.now() + 60 * 1000, // 1 minute
    used: false
  };
  res.send(`${req.protocol}://${req.get('host')}/watch/${token}`);
});

app.get('/watch/:token', (req, res) => {
  const token = req.params.token;
  const now = Date.now();
  const link = links[token];

  if (!link) {
    return res.send('<h1>⛔ Lien invalide</h1>');
  }

  if (link.used) {
    return res.send('<h1>⛔ Lien déjà utilisé</h1>');
  }

  if (link.expiresAt < now) {
    return res.send('<h1>⛔ Lien expiré</h1>');
  }

  link.used = true; // Marquer comme utilisé
  res.sendFile(path.join(__dirname, 'watch.html'));
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
