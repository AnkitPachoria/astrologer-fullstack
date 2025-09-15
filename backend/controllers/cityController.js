const db = require('../db');

// Create City
exports.createCity = (req, res) => {
  const {
    name, title, sub_title, slug, description,
    seo_title, seo_description, status
  } = req.body;
const image = req.file ? `/Uploads/city-image/${req.file.filename}` : req.body.image;


  const query = `
    INSERT INTO cities
    (name, title, sub_title, slug, description, seo_title, seo_description, image, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [name, title, sub_title, slug, description, seo_title, seo_description, image, status || 1],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'City created successfully', cityId: result.insertId });
    }
  );
};

// Update City by ID
exports.updateCity = (req, res) => {
  const { id } = req.params;
  const {
    name, title, sub_title, slug, description,
    seo_title, seo_description, status
  } = req.body;
  const image = req.file ? `/Uploads/city-image/${req.file.filename}` : req.body.image;

  const query = `
    UPDATE cities SET
    name=?, title=?, sub_title=?, slug=?, description=?,
    seo_title=?, seo_description=?, image=?, status=?
    WHERE id=?
  `;

  db.query(
    query,
    [name, title, sub_title, slug, description, seo_title, seo_description, image, status, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'City not found' });
      res.json({ message: 'City updated successfully' });
    }
  );
};

// Get all Cities
// Get all cities or city by slug
exports.getCities = (req, res) => {
  const { slug } = req.query;

  if (slug) {
    // Filter by slug
    db.query('SELECT * FROM cities WHERE slug = ?', [slug], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ error: 'City not found' });
      res.json(results);
    });
  } else {
    // Return all cities
    db.query('SELECT * FROM cities', (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  }
};
// Get one City by ID
exports.getCityById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM cities WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'City not found' });
    res.json(results[0]);
  });
};

// Delete City by ID
exports.deleteCity = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM cities WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'City not found' });
    res.json({ message: 'City deleted successfully' });
  });
};
