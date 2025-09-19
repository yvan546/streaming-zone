const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Sert les fichiers statiques du dossier public
app.use(express.static(path.join(__dirname, 'public')));

// Route principale
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'watch.html'));
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
