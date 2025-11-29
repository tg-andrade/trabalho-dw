import { useState } from 'react';
import { Link } from 'react-router-dom';

const MovieList = ({ movies, onDelete, onUpdate, onToggleFavorite, favorites = [] }) => {
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
      coverImage: movie.coverImage,
      videoUrl: movie.videoUrl || ''
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

  if (!movies || movies.length === 0) {
    return <p style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center' }}>Nenhum filme encontrado</p>;
  }

  return (
    <>
      {movies.map((movie) => (
        <article key={movie.id} className="card movie-card">
          {editingId === movie.id ? (
            <>
              {movie.coverImage ? (
                <img src={movie.coverImage} alt={movie.title} className="movie-card__cover" />
              ) : (
                <div className="movie-card__cover fallback">Sem imagem</div>
              )}
              <div className="movie-card__body">
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
                <input
                  name="videoUrl"
                  value={draft.videoUrl || ''}
                  onChange={handleFieldChange}
                  placeholder="URL do vídeo"
                />
              </div>
              <footer className="movie-card__actions">
                <div className="button-group">
                  <button className="primary" onClick={() => handleUpdate(movie.id)}>
                    Salvar
                  </button>
                  <button className="secondary" onClick={() => setEditingId(null)}>
                    Cancelar
                  </button>
                </div>
              </footer>
            </>
          ) : (
            <>
              <Link to={`/movie/${movie.id}`} className="movie-card__link">
                {movie.coverImage ? (
                  <img src={movie.coverImage} alt={movie.title} className="movie-card__cover" />
                ) : (
                  <div className="movie-card__cover fallback">Sem imagem</div>
                )}
                <div className="movie-card__body">
                  <h4>{movie.title}</h4>
                  <p className="muted">
                    {movie.genre} • {movie.year} • {movie.type}
                  </p>
                  <p>{movie.description}</p>
                </div>
              </Link>
              <footer className="movie-card__actions">
                <div className="button-group">
                  {onToggleFavorite && (
                    <button
                      className={favorites.some(f => f.id === movie.id) ? 'primary small' : 'secondary small'}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onToggleFavorite(movie.id);
                      }}
                    >
                      {favorites.some(f => f.id === movie.id) ? '❤️ Remover' : '🤍 Adicionar'}
                    </button>
                  )}
                  {onUpdate && (
                    <button className="secondary small" onClick={() => startEditing(movie)}>
                      Editar
                    </button>
                  )}
                  {onDelete && (
                    <button className="danger small" onClick={() => onDelete(movie.id)}>
                      Excluir
                    </button>
                  )}
                </div>
              </footer>
            </>
          )}
        </article>
      ))}
    </>
  );
};

export default MovieList;

