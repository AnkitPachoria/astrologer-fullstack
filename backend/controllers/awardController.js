const db = require('../db');
const path = require('path');
const fs = require('fs');

exports.getAllAwards = (req, res) => {
  db.query("SELECT * FROM achievements_awards ORDER BY id DESC", (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

exports.createAward = (req, res) => {
  const { title, short_description, status } = req.body;
  const imagePath = req.file ? `/Uploads/awards-image/${req.file.filename}` : null;

  if (!title || !short_description || !imagePath) {
    return res.status(400).json({ error: "Title, description और image ज़रूरी हैं" });
  }

  db.query(
    "INSERT INTO achievements_awards (title, short_description, image, status) VALUES (?, ?, ?, ?)",
    [title, short_description, imagePath, status || 1],
    (err) => {
      if (err) {
        console.error("DB Insert Error:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Award created successfully" });
    }
  );
};

exports.updateAward = (req, res) => {
  const { id } = req.params;
  const { title, short_description, status } = req.body;

  db.query("SELECT image FROM achievements_awards WHERE id = ?", [id], (err, rows) => {
    if (err || rows.length === 0) {
      console.error("No Award found or DB error:", err);
      return res.status(404).json({ error: "Award not found" });
    }

    const oldImage = rows[0].image;
    const newImage = req.file ? `/Uploads/awards-image/${req.file.filename}` : oldImage;

    if (req.file && oldImage) {
      const oldPath = path.join(__dirname, "..", oldImage);
      fs.unlink(oldPath, () => {});
    }
    db.query(
      "UPDATE achievements_awards SET title = ?, short_description = ?, image = ?, status = ? WHERE id = ?",
      [title, short_description, newImage, status || 1, id],
      (err) => {
        if (err) {
          console.error("DB Update Error:", err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Award updated successfully" });
      }
    );
  });
};

exports.deleteAward = (req, res) => {
  const { id } = req.params;

  db.query("SELECT image FROM achievements_awards WHERE id = ?", [id], (err, rows) => {
    if (err || rows.length === 0) {
      console.error("DB Error or not found:", err);
      return res.status(404).json({ error: "Award not found" });
    }

    const image = rows[0].image;
    if (image) {
      const imagePath = path.join(__dirname, "..", image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    db.query("DELETE FROM achievements_awards WHERE id = ?", [id], (err) => {
      if (err) {
        console.error("DB Delete Error:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Award deleted successfully" });
    });
  });
};


