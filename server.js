const express = require('express');
const path = require('path');
const crypto = require('crypto');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

const links = {}; // { token: expirationTimestamp }

// Génère un lien temporaire d'1 minute
app.get('/generate', (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  links[token] = Date.now() + 60 * 1000;
  res.send(`${req.protocol}://${req.get('host')}/watch/${token}`);
});

// Sert le fichier watch.html avec un iframe qui pointe vers /proxy
app.get('/watch/:token', (req, res) => {
  const token = req.params.token;
  if (!links[token] || links[token] < Date.now()) {
    return res.send('<h1>⛔ Lien expiré</h1>');
  }
  res.sendFile(path.join(__dirname, 'watch.html'));
});

// Proxy : charge le HTML de tv.garden et retire la barre du haut
app.get('/proxy', async (req, res) => {
  try {
    const response = await fetch('https://tv.garden');
    let html = await response.text();

    // Supprime la barre du haut avec le logo (balise <header> complète)
    html = html.replace(/<header[\s\S]*?<\/header>/i, '');

    // Corrige les chemins relatifs (CSS, JS, images, etc.)
    html = html.replace(/(src|href)=["']\/(.*?)["']/g, '$1="https://tv.garden/$2"');

    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur de chargement du site distant');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
