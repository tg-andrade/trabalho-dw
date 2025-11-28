require('dotenv').config();
const express = require('express');
const cors = require('cors');
const APP_CONFIG = require('./config/appConfig');
const moviesRouter = require('./routes/movies.routes');
const genresRouter = require('./routes/genres.routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandlers');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/movies', moviesRouter);
app.use('/api/genres', genresRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(APP_CONFIG.port, () => {
  console.log(`Servidor executando em http://localhost:${APP_CONFIG.port}`);
});

