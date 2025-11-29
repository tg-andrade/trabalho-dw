import { useState } from 'react';

const emptyState = {
  title: '',
  genre: '',
  year: '',
  type: 'Filme',
  description: '',
  coverImage: '',
  videoUrl: ''
};

const MovieForm = ({ genres, onSubmit, initialValues = emptyState, submitLabel = 'Adicionar' }) => {
  const [formData, setFormData] = useState(initialValues);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log('MovieForm - Enviando dados:', formData);
      console.log('MovieForm - videoUrl sendo enviado:', formData.videoUrl);
      await onSubmit(formData);
      setFormData(emptyState);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>{submitLabel} filme/série</h3>
      <label className="form-control">
        <span>Título</span>
        <input name="title" value={formData.title} onChange={handleChange} required />
      </label>

      <label className="form-control">
        <span>Gênero</span>
        <select name="genre" value={formData.genre} onChange={handleChange} required>
          <option value="">Selecione</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.name}>
              {genre.name}
            </option>
          ))}
        </select>
      </label>

      <label className="form-control">
        <span>Ano</span>
        <input name="year" type="number" value={formData.year} onChange={handleChange} required />
      </label>

      <label className="form-control">
        <span>Tipo</span>
        <select name="type" value={formData.type} onChange={handleChange} required>
          <option value="Filme">Filme</option>
          <option value="Série">Série</option>
        </select>
      </label>

      <label className="form-control">
        <span>Descrição</span>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
        />
      </label>

      <label className="form-control">
        <span>URL da capa</span>
        <input name="coverImage" value={formData.coverImage} onChange={handleChange} />
      </label>

      <label className="form-control">
        <span>URL do vídeo</span>
        <input 
          name="videoUrl" 
          value={formData.videoUrl} 
          onChange={handleChange} 
          placeholder="https://exemplo.com/video.mp4 ou https://youtube.com/watch?v=..." 
        />
        <small style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          URL do arquivo de vídeo (MP4, WebM, OGG) ou link do YouTube
        </small>
      </label>

      <button type="submit" className="primary">
        {submitLabel}
      </button>
    </form>
  );
};

export default MovieForm;

