const Genre = require('../models/Genre');

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getAllGenres = async () => {
  return await Genre.findAll();
};

const createGenre = async (payload) => {
  const { name } = payload || {};

  if (!name || !name.trim()) {
    throw createHttpError(400, 'Nome do gênero é obrigatório');
  }

  const normalizedName = name.trim();

  const alreadyExists = await Genre.findByName(normalizedName);

  if (alreadyExists) {
    throw createHttpError(400, 'Gênero já cadastrado');
  }

  return await Genre.create({ name: normalizedName });
};

const updateGenre = async (id, payload) => {
  const targetId = Number(id);
  const existingGenre = await Genre.findById(targetId);

  if (!existingGenre) {
    throw createHttpError(404, 'Gênero não encontrado');
  }

  const { name } = payload || {};

  if (!name || !name.trim()) {
    throw createHttpError(400, 'Nome do gênero é obrigatório');
  }

  const normalizedName = name.trim();

  const alreadyExists = await Genre.findByName(normalizedName);

  if (alreadyExists && alreadyExists.id !== targetId) {
    throw createHttpError(400, 'Já existe outro gênero com esse nome');
  }

  return await Genre.update(targetId, { name: normalizedName });
};

const deleteGenre = async (id) => {
  const targetId = Number(id);
  const existingGenre = await Genre.findById(targetId);

  if (!existingGenre) {
    throw createHttpError(404, 'Gênero não encontrado');
  }

  const deleted = await Genre.delete(targetId);
  if (!deleted) {
    throw createHttpError(404, 'Gênero não encontrado');
  }
};

const findGenreByName = async (name) => {
  return await Genre.findByName(name);
};

module.exports = {
  getAllGenres,
  createGenre,
  updateGenre,
  deleteGenre,
  findGenreByName
};

