const conn = require('../db'); // Matches your db.js

exports.getAllMenus = async (req, res) => {
  try {
    const [rows] = await conn.promise().query('SELECT * FROM menus');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching menus:', error);
    res.status(500).json({ error: 'Error fetching menus' });
  }
};

exports.addMenu = async (req, res) => {
  try {
    const { names } = req.body;
    if (!names || !Array.isArray(names) || names.length === 0 || !names.every(name => name.trim())) {
      return res.status(400).json({ error: 'At least one valid menu name is required' });
    }

    const values = names.map(name => [name]);
    const [result] = await conn.promise().query(
      'INSERT INTO menus (name) VALUES ?',
      [values]
    );
    
    const [newMenus] = await conn.promise().query(
      'SELECT * FROM menus WHERE id >= ? LIMIT ?',
      [result.insertId, names.length]
    );
    
    res.status(201).json(newMenus);
  } catch (error) {
    console.error('Error adding menus:', error);
    res.status(500).json({ error: 'Error adding menus' });
  }
};

exports.getMenuById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await conn.promise().query('SELECT * FROM menus WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: 'Error fetching menu' });
  }
};

exports.updateMenu = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Menu name is required' });
    }
    const [result] = await conn.promise().query('UPDATE menus SET name = ? WHERE id = ?', [name, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    res.status(200).json({ id, name });
  } catch (error) {
    console.error('Error updating menu:', error);
    res.status(500).json({ error: 'Error updating menu' });
  }
};

exports.deleteMenu = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await conn.promise().query('DELETE FROM menus WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    res.status(200).json({ message: 'Menu deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu:', error);
    res.status(500).json({ error: 'Error deleting menu' });
  }
};