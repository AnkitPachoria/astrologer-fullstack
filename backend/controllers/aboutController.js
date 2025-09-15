const conn = require('../db');
const path = require('path');
const fs = require('fs');

exports.getAbout = (req, res) => {
  conn.query('SELECT * FROM about LIMIT 1', (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error', error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'About data not found' });
    res.json(results[0]);
  });
};

exports.getAllAbouts = (req, res) => {
  conn.query('SELECT * FROM about', (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error', error: err.message });
    res.json(results);
  });
};

exports.getAboutById = (req, res) => {
  conn.query('SELECT * FROM about WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error', error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'About data not found' });
    res.json(results[0]);
  });
};

exports.createAbout = (req, res) => {
  const { short_title, title, subtitle, description, note, seo_title, seo_description } = req.body;
  const image = req.file ? `/Uploads/about-image/${req.file.filename}` : null;

  if (!short_title || !title || !subtitle || !description || !note || !seo_title || !seo_description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  conn.query('SELECT id FROM about', (err, existing) => {
    if (err) return res.status(500).json({ message: 'Server error', error: err.message });

    if (existing.length > 0) {
      return res.status(400).json({ message: 'About data already exists. Use PUT to update.' });
    }

    const sql = `
      INSERT INTO about
      (short_title, title, subtitle, description, note, image, seo_title, seo_description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [short_title, title, subtitle, description, note, image, seo_title, seo_description];

    conn.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ message: 'Server error', error: err.message });
      res.status(201).json({ message: 'About data created', id: result.insertId });
    });
  });
};
exports.updateAbout = (req, res) => {
  const { short_title, title, subtitle, description, note, seo_title, seo_description } = req.body;
  const newImage = req.file ? `/Uploads/about-image/${req.file.filename}` : null;
  const id = parseInt(req.params.id, 10);

  if (!short_title || !title || !subtitle || !description || !note || !seo_title || !seo_description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  conn.query('SELECT image FROM about WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error', error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'About data not found' });

    const oldImage = results[0].image;
    let imageToSave = oldImage;

    // If new image uploaded, update it and delete old one
    if (newImage) {
      imageToSave = newImage;

      if (oldImage) {
        const imagePath = path.join(__dirname, '..', oldImage);
        fs.unlink(imagePath, (err) => {
          if (err) console.warn('Failed to delete old image:', err.message);
        });
      }
    }

    const sql = `
      UPDATE about
      SET short_title = ?, title = ?, subtitle = ?, description = ?, note = ?, image = ?, seo_title = ?, seo_description = ?
      WHERE id = ?
    `;
    const values = [short_title, title, subtitle, description, note, imageToSave, seo_title, seo_description, id];

    conn.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ message: 'Server error', error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'No about data updated' });

      res.json({ message: 'About data updated' });
    });
  });
};
exports.deleteAbout = (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

  conn.query('SELECT image FROM about WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error', error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'About data not found' });

    const image = results[0].image;
    if (image) {
      const imagePath = path.join(__dirname, '..', image);
      fs.unlink(imagePath, (err) => {
        if (err) console.warn('Failed to delete image:', err.message);
      });
    }

    conn.query('DELETE FROM about WHERE id = ?', [id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Server error', error: err.message });
      res.json({ message: 'About data deleted' });
    });
  });
};

