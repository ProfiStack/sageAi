const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const db = require('./models');

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });
const app = express();
app.use(cors());
// Middleware to serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/nemat/build')));

app.use(bodyParser.json());

app.use('/api',routes(app));
app.get('*', (req, res) => {
  console.log(path.join(__dirname, '../frontend/nemat/build/index.html'));
  res.sendFile(path.join(__dirname, '../frontend/nemat/build/index.html'));
});

module.exports = app;
