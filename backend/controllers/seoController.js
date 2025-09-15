const conn = require('../db');
const db = conn.promise();
// Get SEO data
exports.getSeo = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM seo LIMIT 1');
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.json({});
    }
  } catch (err) {
    console.error('Error fetching SEO:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create or update SEO data
exports.upsertSeo = async (req, res) => {
  try {
    const { title, description, seo_title, seo_description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }

    const [rows] = await db.query('SELECT id FROM seo LIMIT 1');
    if (rows.length > 0) {
      // Update
      await db.query(
        'UPDATE seo SET title = ?, description = ?, seo_title = ?, seo_description = ? WHERE id = ?',
        [title, description, seo_title || '', seo_description || '', rows[0].id]
      );
      res.json({ id: rows[0].id, message: 'SEO updated successfully.' });
    } else {
      // Insert
      const [result] = await db.query(
        'INSERT INTO seo (title, description, seo_title, seo_description) VALUES (?, ?, ?, ?)',
        [title, description, seo_title || '', seo_description || '']
      );
      res.status(201).json({ id: result.insertId, message: 'SEO created successfully.' });
    }
  } catch (err) {
    console.error('Error saving SEO:', err);
    res.status(500).json({ error: 'Server error while saving SEO.' });
  }
};

