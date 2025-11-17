const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

let genres = [
  { id: 1, name: 'Ação' },
  { id: 2, name: 'Drama' },
  { id: 3, name: 'Comédia' },
  { id: 4, name: 'Ficção Científica' }
];

const generateId = () => (genres.length ? Math.max(...genres.map((genre) => genre.id)) + 1 : 1);

const getAllGenres = () => genres;

const createGenre = (payload) => {
  const { name } = payload || {};

  if (!name || !name.trim()) {
    throw createHttpError(400, 'Nome do gênero é obrigatório');
  }

  const normalizedName = name.trim();

  const alreadyExists = genres.some(
    (genre) => genre.name.toLowerCase() === normalizedName.toLowerCase()
  );

  if (alreadyExists) {
    throw createHttpError(400, 'Gênero já cadastrado');
  }

  const newGenre = {
    id: generateId(),
    name: normalizedName
  };

  genres = [...genres, newGenre];
  return newGenre;
};

const updateGenre = (id, payload) => {
  const targetId = Number(id);
  const genreIndex = genres.findIndex((genre) => genre.id === targetId);

  if (genreIndex === -1) {
    throw createHttpError(404, 'Gênero não encontrado');
  }

  const { name } = payload || {};

  if (!name || !name.trim()) {
    throw createHttpError(400, 'Nome do gênero é obrigatório');
  }

  const normalizedName = name.trim();

  const alreadyExists = genres.some(
    (genre) => genre.id !== targetId && genre.name.toLowerCase() === normalizedName.toLowerCase()
  );

  if (alreadyExists) {
    throw createHttpError(400, 'Já existe outro gênero com esse nome');
  }

  const updatedGenre = {
    ...genres[genreIndex],
    name: normalizedName
  };

  genres[genreIndex] = updatedGenre;

  return updatedGenre;
};

const deleteGenre = (id) => {
  const targetId = Number(id);
  const genreIndex = genres.findIndex((genre) => genre.id === targetId);

  if (genreIndex === -1) {
    throw createHttpError(404, 'Gênero não encontrado');
  }

  genres.splice(genreIndex, 1);
};

const findGenreByName = (name) =>
  genres.find((genre) => genre.name.toLowerCase() === name.toLowerCase());

module.exports = {
  getAllGenres,
  createGenre,
  updateGenre,
  deleteGenre,
  findGenreByName
};

