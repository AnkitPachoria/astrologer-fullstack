const conn = require('../db');
const db = conn.promise();

exports.getAll = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM best_solution ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM best_solution WHERE id = ?', [req.params.id]);
    res.json(rows[0] || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, subtitle = '', note = '' } = req.body;
    const image = req.file ? `/Uploads/best-solution-image/${req.file.filename}` : '';

    const [result] = await db.execute(
      'INSERT INTO best_solution (title, subtitle, note, image) VALUES (?, ?, ?, ?)',
      [title, subtitle, note, image]
    );

    const [row] = await db.execute('SELECT * FROM best_solution WHERE id = ?', [result.insertId]);
    res.status(201).json(row[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.update = async (req, res) => {
  try {
    const { title, subtitle = '', note = '' } = req.body;
    const image = req.file ? `/Uploads/best-solution-image/${req.file.filename}` : null;

    const query = image
      ? 'UPDATE best_solution SET title = ?, subtitle = ?, note = ?, image = ? WHERE id = ?'
      : 'UPDATE best_solution SET title = ?, subtitle = ?, note = ? WHERE id = ?';
    const params = image
      ? [title, subtitle, note, image, req.params.id]
      : [title, subtitle, note, req.params.id];

    await db.execute(query, params);

    const [row] = await db.execute('SELECT * FROM best_solution WHERE id = ?', [req.params.id]);
    res.json(row[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.delete = async (req, res) => {
  try {
    await db.execute('DELETE FROM best_solution WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
