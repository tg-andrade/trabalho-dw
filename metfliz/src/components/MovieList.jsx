import { useState } from 'react';

const MovieList = ({ movies, onDelete, onUpdate }) => {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({});

  const startEditing = (movie) => {
    setEditingId(movie.id);
    setDraft({
      title: movie.title,
      genre: movie.genre,
      year: movie.year,
      type: movie.type,
      description: movie.description,
      coverImage: movie.coverImage
    });
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setDraft((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleUpdate = async (movieId) => {
    try {
      await onUpdate(movieId, draft);
      setEditingId(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid">
      {movies.map((movie) => (
        <article key={movie.id} className="card movie-card">
          {movie.coverImage ? (
            <img src={movie.coverImage} alt={movie.title} className="movie-card__cover" />
          ) : (
            <div className="movie-card__cover fallback">Sem imagem</div>
          )}
          <div className="movie-card__body">
            {editingId === movie.id ? (
              <>
                <input name="title" value={draft.title} onChange={handleFieldChange} />
                <input name="genre" value={draft.genre} onChange={handleFieldChange} />
                <input
                  name="year"
                  type="number"
                  value={draft.year}
                  onChange={handleFieldChange}
                />
                <select name="type" value={draft.type} onChange={handleFieldChange}>
                  <option value="Filme">Filme</option>
                  <option value="Série">Série</option>
                </select>
                <textarea
                  name="description"
                  value={draft.description}
                  onChange={handleFieldChange}
                  rows={3}
                />
                <input
                  name="coverImage"
                  value={draft.coverImage}
                  onChange={handleFieldChange}
                />
              </>
            ) : (
              <>
                <h4>{movie.title}</h4>
                <p className="muted">
                  {movie.genre} • {movie.year} • {movie.type}
                </p>
                <p>{movie.description}</p>
              </>
            )}
          </div>
          <footer className="movie-card__actions">
            {editingId === movie.id ? (
              <>
                <button className="primary" onClick={() => handleUpdate(movie.id)}>
                  Salvar
                </button>
                <button onClick={() => setEditingId(null)}>Cancelar</button>
              </>
            ) : (
              <>
                <button onClick={() => startEditing(movie)}>Editar</button>
                <button className="danger" onClick={() => onDelete(movie.id)}>
                  Excluir
                </button>
              </>
            )}
          </footer>
        </article>
      ))}
    </div>
  );
};

export default MovieList;

