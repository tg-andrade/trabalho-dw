const pool = require('../config/database');

class Genre {
  static async findAll() {
    const [rows] = await pool.execute('SELECT * FROM genres ORDER BY id');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM genres WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async findByName(name) {
    const [rows] = await pool.execute('SELECT * FROM genres WHERE LOWER(name) = LOWER(?)', [name]);
    return rows[0] || null;
  }

  static async create({ name }) {
    const [result] = await pool.execute(
      'INSERT INTO genres (name) VALUES (?)',
      [name.trim()]
    );
    return { id: result.insertId, name: name.trim() };
  }

  static async update(id, { name }) {
    await pool.execute(
      'UPDATE genres SET name = ? WHERE id = ?',
      [name.trim(), id]
    );
    return await this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM genres WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Genre;

