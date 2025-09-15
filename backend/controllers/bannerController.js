const db = require('../db');
const path = require('path');
const fs = require('fs/promises');

// GET all banners
exports.getBanner = (req, res) => {
  db.query('SELECT * FROM banner', (err, rows) => {
    if (err) {
      console.error('Error fetching banners:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(rows);
  });
};

// CREATE new banner
exports.createBanner = (req, res) => {
  const fields = ['image1', 'image2', 'image3', 'mob_image1', 'mob_image2', 'mob_image3'];
  const imagePaths = fields.map((field) =>
    req.files?.[field]?.[0] ? `/Uploads/bannerimage/${req.files[field][0].filename}` : null
  );

  if (!imagePaths.some(Boolean)) {
    return res.status(400).json({ message: 'At least one image is required' });
  }

  db.query(
    'INSERT INTO banner (image1, image2, image3, mob_image1, mob_image2, mob_image3) VALUES (?, ?, ?, ?, ?, ?)',
    imagePaths,
    (err, result) => {
      if (err) {
        console.error('Error creating banner:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      res.status(201).json({ message: 'Banner created', id: result.insertId });
    }
  );
};

// UPDATE banner
exports.updateBanner = (req, res) => {
  const bannerId = req.params.id;

  db.query('SELECT * FROM banner WHERE id = ?', [bannerId], async (err, results) => {
    if (err) {
      console.error('Error fetching banner:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    const existing = results[0];
    const fields = ['image1', 'image2', 'image3', 'mob_image1', 'mob_image2', 'mob_image3'];
    const imagePaths = fields.map((field) =>
      req.files?.[field]?.[0]
        ? `/Uploads/bannerimage/${req.files[field][0].filename}`
        : existing[field]
    );

    // Delete old files if new uploaded
    for (const field of fields) {
      if (req.files?.[field]?.[0] && existing[field]) {
        const oldPath = path.join(__dirname, '..', existing[field]);
        try {
          await fs.unlink(oldPath);
        } catch (unlinkErr) {
          console.warn(`Could not delete old image ${field}:`, unlinkErr.message);
        }
      }
    }

    db.query(
      'UPDATE banner SET image1 = ?, image2 = ?, image3 = ?, mob_image1 = ?, mob_image2 = ?, mob_image3 = ? WHERE id = ?',
      [...imagePaths, bannerId],
      (err) => {
        if (err) {
          console.error('Error updating banner:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        res.json({ message: 'Banner updated' });
      }
    );
  });
};
// DELETE banner
exports.deleteBanner = (req, res) => {
  const bannerId = req.params.id;

  db.query('SELECT * FROM banner WHERE id = ?', [bannerId], async (err, results) => {
    if (err) {
      console.error('Error finding banner:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    const banner = results[0];
    const fields = ['image1', 'image2', 'image3', 'mob_image1', 'mob_image2', 'mob_image3'];

    for (const field of fields) {
      const imgPath = banner[field];
      if (imgPath) {
        const fullPath = path.join(__dirname, '..', imgPath);
        try {
          await fs.unlink(fullPath);
        } catch (err) {
          console.warn(`Failed to delete image ${field}:`, err.message);
        }
      }
    }

    db.query('DELETE FROM banner WHERE id = ?', [bannerId], (err) => {
      if (err) {
        console.error('Error deleting banner:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      res.json({ message: 'Banner deleted' });
    });
  });
};


