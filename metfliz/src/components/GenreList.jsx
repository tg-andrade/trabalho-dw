import { useState } from 'react';

const GenreList = ({ genres, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [draftName, setDraftName] = useState('');

  const startEditing = (genre) => {
    setEditingId(genre.id);
    setDraftName(genre.name);
  };

  const handleSave = (genreId) => {
    if (!draftName.trim()) {
      return;
    }
    onUpdate(genreId, { name: draftName });
    setEditingId(null);
  };

  return (
    <ul className="list">
      {genres.map((genre) => (
        <li key={genre.id} className="list-item">
          {editingId === genre.id ? (
            <>
              <input value={draftName} onChange={(event) => setDraftName(event.target.value)} />
              <div className="list-item__actions button-group">
                <button className="primary small" onClick={() => handleSave(genre.id)}>
                  Salvar
                </button>
                <button className="secondary small" onClick={() => setEditingId(null)}>
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <>
              <span>{genre.name}</span>
              <div className="list-item__actions button-group">
                <button className="secondary small" onClick={() => startEditing(genre)}>
                  Editar
                </button>
                <button className="danger small" onClick={() => onDelete(genre.id)}>
                  Excluir
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default GenreList;

