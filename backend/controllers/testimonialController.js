const conn = require('../db');       // This is your connection
const db = conn.promise();           // Wrap it once here to get promise interface

exports.getAll = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM testimonials');
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM testimonials WHERE id = ?', [req.params.id]);
  res.json(rows[0] || null);
};

exports.create = async (req, res) => {
  const { name, country, description, date } = req.body;
  const image = req.file ? `/Uploads/testimonial-image/${req.file.filename}` : null;
  const [result] = await db.execute(
    'INSERT INTO testimonials (name,country,description,date,image) VALUES (?,?,?,?,?)',
    [name, country, description, date, image]
  );
  const [row] = await db.execute('SELECT * FROM testimonials WHERE id = ?', [result.insertId]);
  res.status(201).json(row[0]);
};

exports.update = async (req, res) => {
  const { name, country, description, date } = req.body;
  let sql = 'UPDATE testimonials SET name=?, country=?, description=?, date=?';
  const params = [name, country, description, date];
  if (req.file) {
    sql += ', image=?';
    params.push(`/Uploads/testimonial-image/${req.file.filename}`);
  }
  sql += ' WHERE id = ?';
  params.push(req.params.id);
  await db.execute(sql, params);
  const [row] = await db.execute('SELECT * FROM testimonials WHERE id = ?', [req.params.id]);
  res.json(row[0]);
};

exports.delete = async (req, res) => {
  await db.execute('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
  res.json({ success: true });
};



