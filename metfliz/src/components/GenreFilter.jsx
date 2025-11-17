const GenreFilter = ({ genres, value, onChange, disabled }) => (
  <label className="form-control">
    <span>Filtrar por gênero</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled}>
      <option value="">Todos</option>
      {genres.map((genre) => (
        <option key={genre.id} value={genre.name}>
          {genre.name}
        </option>
      ))}
    </select>
  </label>
);

export default GenreFilter;

