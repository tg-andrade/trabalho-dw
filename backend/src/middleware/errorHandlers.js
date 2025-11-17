const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    message: 'Recurso não encontrado'
  });
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (res.headersSent) {
    return next(err);
  }

  const status = err.statusCode || 500;
  const payload = {
    message: err.message || 'Erro interno do servidor'
  };

  res.status(status).json(payload);
};

module.exports = {
  notFoundHandler,
  errorHandler
};

