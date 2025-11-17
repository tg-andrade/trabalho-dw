import { useState } from 'react';
import GenreList from '../components/GenreList';
import { useGenreContext } from '../context/GenreContext';

const GenresPage = () => {
  const { genres, loading, error, createGenre, updateGenre, deleteGenre } = useGenreContext();
  const [genreName, setGenreName] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createGenre({ name: genreName });
      setGenreName('');
      setFeedback('Gênero criado!');
      setTimeout(() => setFeedback(''), 2000);
    } catch (createError) {
      setFeedback(createError.message);
    }
  };

  return (
    <section className="page">
      <header className="page__header">
        <div>
          <h1>Gêneros</h1>
          <p>Rotas completas de CRUD para manter a base em memória do backend.</p>
        </div>
      </header>

      <div className="grid two-columns">
        <form className="card" onSubmit={handleSubmit}>
          <h3>Novo gênero</h3>
          <label className="form-control">
            <span>Nome</span>
            <input value={genreName} onChange={(event) => setGenreName(event.target.value)} required />
          </label>
          <button className="primary" type="submit" disabled={loading}>
            Adicionar
          </button>
          {feedback && <p className="success-text">{feedback}</p>}
        </form>

        <div className="card">
          <h3>Status</h3>
          {loading && <p>Sincronizando gêneros...</p>}
          {error && <p className="danger-text">{error}</p>}
          <p>Total cadastrado: {genres.length}</p>
        </div>
      </div>

      <GenreList genres={genres} onUpdate={updateGenre} onDelete={deleteGenre} />
    </section>
  );
};

export default GenresPage;

