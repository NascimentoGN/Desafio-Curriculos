const express = require('express');
const cors = require('cors');

const candidatoRoutes = require('./routes/candidatoRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/candidatos', candidatoRoutes);

// O errorHandler vai por último
app.use(errorHandler);

module.exports = app;