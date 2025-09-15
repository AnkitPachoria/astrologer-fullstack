const conn = require('../db');
const db = conn.promise();

// Create contact
exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, message, seo_title, seo_description } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ error: 'Name, phone, and message are required.' });
    }

    const q = `
      INSERT INTO contacts (name, email, phone, message, seo_title, seo_description)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [name, email, phone, message, seo_title, seo_description];

    await db.query(q, values);

    res.status(201).json({ message: 'Contact submitted successfully.' });
  } catch (err) {
    console.error('Error inserting contact:', err);
    res.status(500).json({ error: 'Server error while submitting contact.' });
  }
};

// Get all contacts
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

