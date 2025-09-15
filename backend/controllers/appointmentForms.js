const conn = require('../db');
const db = conn.promise();

exports.createAppointment = async (req, res) => {
  const { name, email, contact, dob, otherRequest, confirmDetails } = req.body;
  try {
    if (!name || !email || !contact || !dob || confirmDetails === undefined) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!/^\d{10}$/.test(contact)) {
      return res.status(400).json({ error: 'Contact number must be 10 digits' });
    }

    const [result] = await db.execute(
      'INSERT INTO appointment_forms (name, email, contact, dob, other_request, confirm_details) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, contact, dob, otherRequest || null, confirmDetails]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to submit appointment form' });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, contact, dob, other_request, confirm_details, created_at FROM appointment_forms ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM appointment_forms WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
};

