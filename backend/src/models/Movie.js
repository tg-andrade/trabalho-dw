const pool = require('../config/database');

class Movie {
  static async findAll(genreFilter = null) {
    let query = 'SELECT m.*, g.name as genre_name FROM movies m LEFT JOIN genres g ON m.genre_id = g.id';
    const params = [];

    if (genreFilter) {
      query += ' WHERE LOWER(g.name) = LOWER(?)';
      params.push(genreFilter.trim());
    }

    query += ' ORDER BY m.id';

    const [rows] = await pool.execute(query, params);
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      genre: row.genre_name || row.genre_id,
      year: row.year,
      type: row.type,
      description: row.description || '',
      coverImage: row.cover_image || ''
    }));
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT m.*, g.name as genre_name FROM movies m LEFT JOIN genres g ON m.genre_id = g.id WHERE m.id = ?',
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    return {
      id: row.id,
      title: row.title,
      genre: row.genre_name || row.genre_id,
      year: row.year,
      type: row.type,
      description: row.description || '',
      coverImage: row.cover_image || ''
    };
  }

  static async create({ title, genre, year, type, description = '', coverImage = '' }) {
    // Primeiro, encontrar o gênero pelo nome
    const Genre = require('./Genre');
    const genreRecord = await Genre.findByName(genre);

    if (!genreRecord) {
      throw new Error('Gênero não encontrado');
    }

    const [result] = await pool.execute(
      'INSERT INTO movies (title, genre_id, year, type, description, cover_image) VALUES (?, ?, ?, ?, ?, ?)',
      [title.trim(), genreRecord.id, year, type, description.trim(), coverImage.trim()]
    );

    return await this.findById(result.insertId);
  }

  static async update(id, { title, genre, year, type, description, coverImage }) {
    const movie = await this.findById(id);
    if (!movie) {
      return null;
    }

    let genreId = null;
    if (genre) {
      const Genre = require('./Genre');
      const genreRecord = await Genre.findByName(genre);
      if (!genreRecord) {
        throw new Error('Gênero não encontrado');
      }
      genreId = genreRecord.id;
    }

    const updateFields = [];
    const updateValues = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title.trim());
    }
    if (genreId !== null) {
      updateFields.push('genre_id = ?');
      updateValues.push(genreId);
    }
    if (year !== undefined) {
      updateFields.push('year = ?');
      updateValues.push(year);
    }
    if (type !== undefined) {
      updateFields.push('type = ?');
      updateValues.push(type);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description.trim());
    }
    if (coverImage !== undefined) {
      updateFields.push('cover_image = ?');
      updateValues.push(coverImage.trim());
    }

    if (updateFields.length > 0) {
      updateValues.push(id);
      await pool.execute(
        `UPDATE movies SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }

    return await this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM movies WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Movie;

