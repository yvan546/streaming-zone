const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// Génère un lien temporaire valide 1 minute
const tokens = {}; // { token: expiration }

app.get("/generate", (req, res) => {
  const token = Math.random().toString(36).substring(2, 10);
  const expiresAt = Date.now() + 1 * 60 * 1000; // 1 minute
  tokens[token] = expiresAt;
  res.send(`Votre lien temporaire : http://localhost:${PORT}/watch/${token}`);
});

// Page de visionnage avec iframe + minuterie
app.get("/watch/:token", (req, res) => {
  const token = req.params.token;
  const expiresAt = tokens[token];

  if (!expiresAt || Date.now() > expiresAt) {
    return res.send("<h1>⛔ Lien expiré ou invalide.</h1>");
  }

  res.sendFile(path.join(__dirname, "watch.html"));
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
