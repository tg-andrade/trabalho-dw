import { useState } from 'react';

const emptyState = {
  title: '',
  genre: '',
  year: '',
  type: 'Filme',
  description: '',
  coverImage: ''
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

      <button type="submit" className="primary">
        {submitLabel}
      </button>
    </form>
  );
};

export default MovieForm;

