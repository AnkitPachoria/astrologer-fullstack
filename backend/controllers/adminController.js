// controllers/adminController.js
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.loginAdmin = (req, res) => {
  const { username, password } = req.body;

  db.query("SELECT * FROM admin WHERE username = ?", [username], async (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const admin = results[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '3d' });

    res.status(200).json({ token });
  });
};


