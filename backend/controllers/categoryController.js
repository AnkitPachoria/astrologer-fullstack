const db = require('../db');

// Create Category
exports.createCategory = (req, res) => {
  const {
    name, title, sub_title, slug, description,
    seo_title, seo_description, status
  } = req.body;
const image = req.file
  ? `/Uploads/category-image/${req.file.filename}`
  : req.body.image; // Use existing image if no new file


  console.log('Creating category with data:', { name, title, sub_title, slug, description, seo_title, seo_description, image, status, reqFile: req.file });

  const query = `
    INSERT INTO categories
    (name, title, sub_title, slug, description, seo_title, seo_description, image, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [name, title, sub_title, slug, description, seo_title, seo_description, image, status || 1],
    (err, result) => {
      if (err) {
        console.error('Create category error:', err);
        return res.status(500).json({ error: err.message });
      }
      console.log('Category created, ID:', result.insertId);
      res.status(201).json({ message: 'Category created successfully', categoryId: result.insertId });
    }
  );
};

// Update Category by ID
exports.updateCategory = (req, res) => {
  const { id } = req.params;
  const {
    name, title, sub_title, slug, description,
    seo_title, seo_description, status, image: currentImage
  } = req.body;
  let newImage = currentImage || null; // Default to current image or null if not provided

  console.log('Update request received:', { id, reqBody: req.body, reqFile: req.file });

  // Only update image if a new file is uploaded
  if (req.file) {
    newImage = `/Uploads/category-image/${req.file.filename}`;
    console.log('New image uploaded:', newImage);
  } else if (!currentImage) {
    // Fetch existing image if not provided in body
    db.query('SELECT image FROM categories WHERE id = ?', [id], (err, results) => {
      if (err) {
        console.error('Error fetching existing image:', err);
        return res.status(500).json({ error: err.message });
      }
      newImage = results[0]?.image || null;
      console.log('Fetched existing image:', newImage);
      proceedWithUpdate();
    });
    return; // Exit early to handle async callback
  }

  proceedWithUpdate();

  function proceedWithUpdate() {
    console.log('Updating category ID:', id, 'with data:', { name, title, sub_title, slug, description, seo_title, seo_description, image: newImage, status });

    const query = `
      UPDATE categories SET
      name=?, title=?, sub_title=?, slug=?, description=?,
      seo_title=?, seo_description=?, image=?, status=?
      WHERE id=?
    `;

    db.query(
      query,
      [name, title, sub_title, slug, description, seo_title, seo_description, newImage, status, id],
      (err, result) => {
        if (err) {
          console.error('Update category error:', err);
          return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Category not found' });
        console.log('Category updated, ID:', id);
        res.json({ message: 'Category updated successfully' });
      }
    );
  }
};
// Get all Categories
exports.getCategories = (req, res) => {
  const { slug, name } = req.query;
  let query = 'SELECT * FROM categories';
  let queryParams = [];

  if (slug || name) {
    query += ' WHERE slug = ? OR name = ?';
    queryParams = [slug || name, slug || name];
  }

  console.log('Fetching categories with query:', query, 'params:', queryParams);

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Get categories error:', err);
      return res.status(500).json({ error: err.message });
    }
    console.log('Categories fetched:', results);
    res.json(results);
  });
};

// Get one Category by ID
exports.getCategoryById = (req, res) => {
  const { id } = req.params;
  console.log('Fetching category ID:', id);
  db.query('SELECT * FROM categories WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Get category by ID error:', err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) return res.status(404).json({ message: 'Category not found' });
    console.log('Category fetched:', results[0]);
    res.json(results[0]);
  });
};

// Delete Category by ID
exports.deleteCategory = (req, res) => {
  const { id } = req.params;
  console.log('Deleting category ID:', id);
  db.query('DELETE FROM categories WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Delete category error:', err);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Category not found' });
    console.log('Category deleted, ID:', id);
    res.json({ message: 'Category deleted successfully' });
  });
};
