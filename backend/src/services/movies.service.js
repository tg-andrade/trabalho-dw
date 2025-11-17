const { getAllGenres } = require('./genres.service');

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

let movies = [
  {
    id: 1,
    title: 'Inception',
    genre: 'Ação',
    year: 2010,
    type: 'Filme',
    description: 'Um ladrão entra nos sonhos das pessoas para roubar segredos.',
    coverImage: 'https://image.tmdb.org/t/p/w500/s3TBrRGB1iav7gFOCNx3H31MoES.jpg'
  },
  {
    id: 2,
    title: 'Dark',
    genre: 'Ficção Científica',
    year: 2017,
    type: 'Série',
    description: 'Famílias alemãs enfrentam viagens no tempo e segredos sombrios.',
    coverImage: 'https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg'
  }
];

const generateId = () => (movies.length ? Math.max(...movies.map((movie) => movie.id)) + 1 : 1);

const validateGenreExists = (genreName) => {
  const normalizedGenre = genreName?.trim();
  if (!normalizedGenre) {
    throw createHttpError(400, 'Gênero é obrigatório');
  }

  const genreExists = getAllGenres().some(
    (genre) => genre.name.toLowerCase() === normalizedGenre.toLowerCase()
  );

  if (!genreExists) {
    throw createHttpError(400, 'Gênero informado não está cadastrado');
  }

  return normalizedGenre;
};

const requireMovieById = (id) => {
  const movieId = Number(id);
  const movie = movies.find((item) => item.id === movieId);

  if (!movie) {
    throw createHttpError(404, 'Filme ou série não encontrado');
  }

  return movie;
};

const getAllMovies = (genreFilter) => {
  if (!genreFilter) {
    return movies;
  }

  const normalizedGenre = genreFilter.trim().toLowerCase();
  return movies.filter((movie) => movie.genre.toLowerCase() === normalizedGenre);
};

const getMovieById = (id) => requireMovieById(id);

const createMovie = (payload) => {
  const { title, genre, year, type, description = '', coverImage = '' } = payload || {};

  if (!title || !title.trim()) {
    throw createHttpError(400, 'Título é obrigatório');
  }

  if (!year || Number.isNaN(Number(year))) {
    throw createHttpError(400, 'Ano é obrigatório e deve ser numérico');
  }

  if (!type || !['Filme', 'Série'].includes(type)) {
    throw createHttpError(400, 'Tipo deve ser "Filme" ou "Série"');
  }

  const normalizedGenre = validateGenreExists(genre);

  const newMovie = {
    id: generateId(),
    title: title.trim(),
    genre: normalizedGenre,
    year: Number(year),
    type,
    description: description.trim(),
    coverImage: coverImage.trim()
  };

  movies = [...movies, newMovie];
  return newMovie;
};

const updateMovie = (id, payload) => {
  const movie = requireMovieById(id);
  const { title, genre, year, type, description, coverImage } = payload || {};

  if (genre) {
    validateGenreExists(genre);
  }

  if (year && Number.isNaN(Number(year))) {
    throw createHttpError(400, 'Ano deve ser numérico');
  }

  if (type && !['Filme', 'Série'].includes(type)) {
    throw createHttpError(400, 'Tipo deve ser "Filme" ou "Série"');
  }

  const updatedMovie = {
    ...movie,
    title: title !== undefined ? title.trim() : movie.title,
    genre: genre !== undefined ? genre.trim() : movie.genre,
    year: year !== undefined ? Number(year) : movie.year,
    type: type !== undefined ? type : movie.type,
    description: description !== undefined ? description.trim() : movie.description,
    coverImage: coverImage !== undefined ? coverImage.trim() : movie.coverImage
  };

  movies = movies.map((item) => (item.id === updatedMovie.id ? updatedMovie : item));
  return updatedMovie;
};

const deleteMovie = (id) => {
  const movie = requireMovieById(id);
  movies = movies.filter((item) => item.id !== movie.id);
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
};

