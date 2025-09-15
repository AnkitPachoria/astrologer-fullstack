const conn = require('../db');
const db = conn.promise();

// Get all blogs
exports.getAll = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT id, title, subtitle, content, image, status, seo_title, seo_description, created_at, updated_at FROM blogs ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// Get blog by ID
exports.getById = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, title, subtitle, content, image, status, seo_title, seo_description, created_at, updated_at FROM blogs WHERE id = ?',
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json(null);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get blog by title
exports.getByTitle = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, title, subtitle, content, image, status, seo_title, seo_description, created_at, updated_at FROM blogs WHERE title = ?',
      [req.params.title]
    );
    if (!rows[0]) return res.status(404).json(null);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create blog
exports.create = async (req, res) => {
  const { title, subtitle, content, status, seo_title, seo_description } = req.body;
  const image = req.file ? `/Uploads/blogimage/${req.file.filename}` : null;
  try {
    const [result] = await db.execute(
      'INSERT INTO blogs (title, subtitle, content, image, status, seo_title, seo_description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, subtitle, content, image, status || 'active', seo_title, seo_description]
    );
    const [row] = await db.execute('SELECT * FROM blogs WHERE id = ?', [result.insertId]);
    res.status(201).json(row[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Update blog
exports.update = async (req, res) => {
  const { title, subtitle, content, status, seo_title, seo_description } = req.body;
  let sql = 'UPDATE blogs SET title=?, subtitle=?, content=?, status=?, seo_title=?, seo_description=?';
  const params = [title, subtitle, content, status, seo_title, seo_description];
  if (req.file) {
    const image = `/Uploads/blogimage/${req.file.filename}`;
    sql += ', image=?';
    params.push(image);
  }
  sql += ' WHERE id = ?';
  params.push(req.params.id);
  try {
    await db.execute(sql, params);
    const [row] = await db.execute('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
    if (!row[0]) return res.status(404).json(null);
    res.json(row[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete blog
exports.delete = async (req, res) => {
  try {
    await db.execute('DELETE FROM blogs WHERE id = ?', [req.params.id]);
    console.log('Deleted blog with ID:', req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: error.message });
  }
};

