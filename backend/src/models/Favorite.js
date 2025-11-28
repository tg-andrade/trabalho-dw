const pool = require('../config/database');

class Favorite {
  static async findAll() {
    const query = `
      SELECT m.*, g.name as genre_name 
      FROM favorites f
      INNER JOIN movies m ON f.movie_id = m.id
      LEFT JOIN genres g ON m.genre_id = g.id
      ORDER BY f.created_at DESC
    `;
    
    const [rows] = await pool.execute(query);
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

  static async findByMovieId(movieId) {
    const [rows] = await pool.execute(
      'SELECT * FROM favorites WHERE movie_id = ?',
      [movieId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async create(movieId) {
    const existing = await this.findByMovieId(movieId);
    if (existing) {
      return existing;
    }

    const [result] = await pool.execute(
      'INSERT INTO favorites (movie_id) VALUES (?)',
      [movieId]
    );

    return { id: result.insertId, movie_id: movieId };
  }

  static async delete(movieId) {
    const [result] = await pool.execute(
      'DELETE FROM favorites WHERE movie_id = ?',
      [movieId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Favorite;

